import { stripe } from '@better-auth/stripe';
import type { DatabaseInstance } from '@repo/db/client';
import { and, eq } from '@repo/db';
import {
  backofficeAuthorizedEmail,
  invitation,
  member,
  subscriptionPlan,
} from '@repo/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import { admin, openAPI, organization } from 'better-auth/plugins';
import Stripe from 'stripe';
import urlJoin from 'url-join';

import { appAc, appRoles, orgAc, orgRoles } from './permissions';

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
}

export interface AuthOptions {
  platformUrl: string;
  backofficeUrl: string;
  serverUrl: string;
  apiPath: `/${string}`;
  authSecret: string;
  db: DatabaseInstance;
  // Stripe configuration (optional - enabled when provided)
  stripe?: StripeConfig;
}

export type AuthInstance = ReturnType<typeof createAuth>;

export const createAuth = ({
  platformUrl,
  backofficeUrl,
  serverUrl,
  apiPath,
  db,
  authSecret,
  stripe: stripeConfig,
}: AuthOptions) => {
  // Build plugins array
  const plugins: Parameters<typeof betterAuth>[0]['plugins'] = [
    openAPI(),
    // App-level RBAC (backoffice)
    admin({
      ac: appAc,
      roles: appRoles,
      defaultRole: 'member',
    }),
    // Organization-level RBAC (platform)
    organization({
      ac: orgAc,
      roles: orgRoles,
      allowUserToCreateOrganization: true,
      creatorRole: 'owner',
      membershipLimit: 50,
      organizationLimit: 5,
      invitationExpiresIn: 60 * 60 * 48, // 48 hours
      sendInvitationEmail: async (data) => {
        // TODO: Implement invitation email sending
        console.log('Send invitation email:', {
          email: data.email,
          organization: data.organization,
          inviter: data.inviter,
          role: data.role,
        });
      },
    }),
  ];

  // Add Stripe plugin if configured
  if (stripeConfig) {
    const stripeClient = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2025-11-17.clover',
    });

    plugins.push(
      stripe({
        stripeClient,
        stripeWebhookSecret: stripeConfig.webhookSecret,
        createCustomerOnSignUp: true,

        subscription: {
          enabled: true,
          // Dynamic plans fetched from database (source of truth)
          plans: async () => {
            const plans = await db
              .select()
              .from(subscriptionPlan)
              .where(eq(subscriptionPlan.isActive, true))
              .orderBy(subscriptionPlan.sortOrder);

            return plans.map((plan) => ({
              name: plan.name,
              priceId: plan.stripePriceId,
              annualDiscountPriceId: plan.stripeAnnualPriceId ?? undefined,
              limits: plan.limits,
              freeTrial: plan.trialDays ? { days: plan.trialDays } : undefined,
            }));
          },

          // Authorize subscription operations for organizations
          authorizeReference: async ({ user, referenceId, action }) => {
            return authorizeSubscriptionReference(db, user.id, referenceId, action);
          },

          // Lifecycle hooks
          onSubscriptionComplete: async ({ subscription, plan }) => {
            console.log(
              `Subscription ${subscription.id} created for plan ${plan.name}`,
            );
            // TODO: Send welcome email
          },

          onSubscriptionCancel: async ({ subscription }) => {
            console.log(`Subscription ${subscription.id} canceled`);
            // TODO: Send cancellation email
          },
        },

        // Handle additional webhook events
        onEvent: async (event) => {
          switch (event.type) {
            case 'invoice.paid':
              console.log('Invoice paid:', event.data.object.id);
              break;
            case 'invoice.payment_failed':
              console.log('Invoice payment failed:', event.data.object.id);
              // TODO: Notify user of failed payment
              break;
          }
        },
      }),
    );
  }

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    baseURL: urlJoin(serverUrl, apiPath, 'auth'),
    secret: authSecret,
    trustedOrigins: [platformUrl, backofficeUrl].map(
      (url) => new URL(url).origin,
    ),

    // Database hooks for access control
    databaseHooks: {
      user: {
        create: {
          before: async (user, ctx) => {
            const email = user.email.toLowerCase();

            // Check if this is a backoffice sign-up attempt
            // The x-app-type header is set by the backoffice client
            const isBackofficeAttempt =
              ctx?.request?.headers?.get('x-app-type') === 'backoffice';

            if (isBackofficeAttempt) {
              // Backoffice: Check email whitelist
              const authorized =
                await db.query.backofficeAuthorizedEmail.findFirst({
                  where: eq(backofficeAuthorizedEmail.email, email),
                });

              if (!authorized) {
                throw new APIError('FORBIDDEN', {
                  message: 'Email not authorized for backoffice access',
                });
              }

              // Return user with role from whitelist
              return {
                data: {
                  ...user,
                  role: authorized.role,
                },
              };
            }

            // Platform: Check for pending invitation (for social sign-up)
            const pendingInvitation = await db.query.invitation.findFirst({
              where: eq(invitation.email, email),
            });

            // If signing up via social provider without invitation,
            // they'll need to complete subscription after
            // (handled in the application flow, not here)

            // Set default platform role
            return {
              data: {
                ...user,
                role: pendingInvitation ? 'member' : 'member', // Default app-level role
              },
            };
          },
          after: async (user) => {
            // Update backoffice whitelist if applicable
            const email = user.email.toLowerCase();
            await db
              .update(backofficeAuthorizedEmail)
              .set({ acceptedAt: new Date() })
              .where(eq(backofficeAuthorizedEmail.email, email));
          },
        },
      },
    },

    plugins,

    onAPIError: {
      throw: true,
      onError: (error) => {
        console.error('auth onAPIError', error);
      },
      errorURL: '/signin',
    },
    user: {
      deleteUser: { enabled: true },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignIn: false,
      sendOnSignUp: false,
      requireEmailVerification: false,
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'email-password', 'github'],
      },
    },
  });
};

/**
 * Helper function to check if user has access to platform
 * User can access if they have:
 * 1. An active subscription (including free tier)
 * 2. Been invited to an organization
 */
export async function checkPlatformAccess(
  db: DatabaseInstance,
  userId: string,
): Promise<{
  hasAccess: boolean;
  reason: 'has-subscription' | 'has-org-membership' | 'no-access';
  organizationIds: string[];
}> {
  // Check for organization membership
  const memberships = await db.query.member.findMany({
    where: eq(member.userId, userId),
    columns: { organizationId: true },
  });

  if (memberships.length > 0) {
    return {
      hasAccess: true,
      reason: 'has-org-membership',
      organizationIds: memberships.map((m) => m.organizationId),
    };
  }

  // TODO: Check for active subscription when Stripe is integrated
  // const subscriptions = await db.query.subscription.findMany({...})

  return {
    hasAccess: false,
    reason: 'no-access',
    organizationIds: [],
  };
}

/**
 * Helper to authorize subscription operations for organizations
 * Used with Stripe plugin's authorizeReference option
 */
export async function authorizeSubscriptionReference(
  db: DatabaseInstance,
  userId: string,
  referenceId: string,
  action: string,
): Promise<boolean> {
  // If referenceId is user ID, always allow
  if (referenceId === userId) return true;

  // For org referenceId, check membership
  const membership = await db.query.member.findFirst({
    where: and(
      eq(member.userId, userId),
      eq(member.organizationId, referenceId),
    ),
  });

  if (!membership) return false;

  // Only owner can manage billing
  if (
    action === 'upgrade-subscription' ||
    action === 'cancel-subscription' ||
    action === 'restore-subscription'
  ) {
    return membership.role === 'owner';
  }

  // Admin can view billing
  if (action === 'list-subscription') {
    return membership.role === 'owner' || membership.role === 'admin';
  }

  return false;
}
