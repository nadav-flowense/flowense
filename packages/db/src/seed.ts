import crypto from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { eq } from 'drizzle-orm';

import { createDb } from './client';
import {
  account,
  backofficeAuthorizedEmail,
  backofficeInvitationToken,
  flow,
  invitation,
  member,
  organization,
  subscription,
  subscriptionPlan,
  type PlanLimits,
  user,
} from './schema';

type SeedUser = {
  key: string;
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'backoffice' | 'member';
  stripeCustomerId?: string;
};

type SeedOrganization = {
  key: string;
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
};

type SeededUser = SeedUser & { id: string };

type BackofficeWhitelistEntry =
  | {
      emailKey: SeedUser['key'];
      role: 'admin' | 'backoffice';
      isOwner?: boolean;
      acceptedAt: Date | null;
    }
  | {
      email: string;
      role: 'admin' | 'backoffice';
      isOwner?: boolean;
      acceptedAt: Date | null;
    };

const databaseUrl =
  process.env.DB_POSTGRES_URL ?? process.env.SERVER_POSTGRES_URL;

if (!databaseUrl) {
  throw new Error(
    'Missing DB_POSTGRES_URL (preferred) or SERVER_POSTGRES_URL for seeding',
  );
}

const now = new Date();
const addDays = (base: Date, days: number) =>
  new Date(base.getTime() + days * 86_400_000);

const seededUsers: SeedUser[] = [
  {
    key: 'nadav',
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    name: 'Nadav',
    email: 'nadav@flowense.com',
    password: 'Password123!',
    role: 'admin',
    stripeCustomerId: 'cus_seed_nadav',
  },
  {
    key: 'zakkai',
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    name: 'Zakkai',
    email: 'zakkai@flowense.com',
    password: 'Password123!',
    role: 'admin',
    stripeCustomerId: 'cus_seed_zakkai',
  },
  {
    key: 'owner',
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Olivia Owens',
    email: 'olivia@acme.test',
    password: 'Password123!',
    role: 'admin',
    stripeCustomerId: 'cus_seed_owner',
  },
  {
    key: 'ops',
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Sam Sawyer',
    email: 'sam@acme.test',
    password: 'Password123!',
    role: 'backoffice',
    stripeCustomerId: 'cus_seed_ops',
  },
  {
    key: 'builder',
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Priya Patel',
    email: 'priya@flowforge.test',
    password: 'Password123!',
    role: 'member',
    stripeCustomerId: 'cus_seed_builder',
  },
];

const backofficeWhitelist: BackofficeWhitelistEntry[] = [
  {
    emailKey: 'nadav',
    role: 'admin' as const,
    isOwner: true,
    acceptedAt: now,
  },
  {
    emailKey: 'zakkai',
    role: 'admin' as const,
    isOwner: true,
    acceptedAt: now,
  },
  {
    emailKey: 'owner',
    role: 'admin' as const,
    isOwner: true,
    acceptedAt: now,
  },
  {
    emailKey: 'ops',
    role: 'backoffice' as const,
    isOwner: false,
    acceptedAt: now,
  },
  {
    email: 'audit@acme.test',
    role: 'backoffice' as const,
    isOwner: false,
    acceptedAt: null,
  },
];

const organizations: SeedOrganization[] = [
  {
    key: 'acme',
    id: '44444444-4444-4444-8444-444444444444',
    name: 'Acme Robotics',
    slug: 'acme-robotics',
    createdAt: new Date('2024-08-15T12:00:00Z'),
    metadata: {
      segment: 'Automation',
      tier: 'starter',
      region: 'NA',
    },
  },
  {
    key: 'flowforge',
    id: '55555555-5555-4555-8555-555555555555',
    name: 'FlowForge Labs',
    slug: 'flowforge-labs',
    createdAt: new Date('2024-10-02T12:00:00Z'),
    metadata: {
      segment: 'AI Tooling',
      tier: 'free',
      region: 'EU',
    },
  },
];

const memberships = [
  { id: 'mem-acme-nadav', orgKey: 'acme', userKey: 'nadav', role: 'owner' },
  { id: 'mem-acme-zakkai', orgKey: 'acme', userKey: 'zakkai', role: 'owner' },
  { id: 'mem-acme-owner', orgKey: 'acme', userKey: 'owner', role: 'owner' },
  { id: 'mem-acme-ops', orgKey: 'acme', userKey: 'ops', role: 'admin' },
  { id: 'mem-acme-builder', orgKey: 'acme', userKey: 'builder', role: 'viewer' },
  { id: 'mem-flowforge-nadav', orgKey: 'flowforge', userKey: 'nadav', role: 'owner' },
  { id: 'mem-flowforge-zakkai', orgKey: 'flowforge', userKey: 'zakkai', role: 'owner' },
  { id: 'mem-flowforge-builder', orgKey: 'flowforge', userKey: 'builder', role: 'owner' },
];

const flows = [
  {
    id: '66666666-6666-4666-8666-666666666661',
    createdByKey: 'owner',
    title: 'Onboarding: qualify + welcome',
    content:
      'Collect sign-up details, enrich with Clearbit, send welcome email, and create a default workspace.',
  },
  {
    id: '66666666-6666-4666-8666-666666666662',
    createdByKey: 'builder',
    title: 'Incident triage webhook',
    content:
      'Ingest webhook, fan-out to PagerDuty/Slack, and open a Jira ticket with severity mapping.',
  },
  {
    id: '66666666-6666-4666-8666-666666666663',
    createdByKey: 'ops',
    title: 'Billing dunning sequence',
    content:
      'Detect failed Stripe invoices, send three-stage reminder, and downgrade plan after grace period.',
  },
];

const subscriptionPlans: Array<{
  name: string;
  displayName: string;
  description: string;
  stripePriceIdEnv: string | undefined;
  stripeAnnualPriceIdEnv?: string | undefined;
  limits: PlanLimits;
  sortOrder: number;
  trialDays?: number;
  features: string[];
  isActive?: boolean;
}> = [
  {
    name: 'free',
    displayName: 'Free',
    description: 'Sandbox plan for testing basic flows.',
    stripePriceIdEnv: process.env.STRIPE_FREE_PRICE_ID,
    limits: { flows: 3, members: 3, executions: 5_000, storageGb: 1 },
    sortOrder: 1,
    features: ['Basic flow builder', 'Team invites', 'Email/password auth'],
  },
  {
    name: 'starter',
    displayName: 'Starter',
    description: 'For small teams piloting automation across a few projects.',
    stripePriceIdEnv: process.env.STRIPE_STARTER_PRICE_ID,
    stripeAnnualPriceIdEnv: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
    limits: { flows: 20, members: 15, executions: 50_000, storageGb: 5 },
    sortOrder: 2,
    trialDays: 7,
    features: ['API access', 'Audit log export', 'Community support'],
  },
  {
    name: 'pro',
    displayName: 'Pro',
    description: 'For product teams shipping production automations.',
    stripePriceIdEnv: process.env.STRIPE_PRO_PRICE_ID,
    stripeAnnualPriceIdEnv: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    limits: { flows: 100, members: 50, executions: 250_000, storageGb: 25 },
    sortOrder: 3,
    trialDays: 14,
    features: [
      'SAML/SSO ready',
      'Advanced permissions',
      'Custom webhooks',
      'Priority support',
    ],
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise',
    description: 'Unlimited plan with custom limits and support.',
    stripePriceIdEnv: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    limits: { flows: -1, members: -1, executions: -1, storageGb: 100 },
    sortOrder: 4,
    trialDays: 30,
    features: [
      'Unlimited resources',
      'Dedicated Slack channel',
      'Custom contracts',
    ],
    isActive: false, // enable once you have live Stripe price IDs
  },
];

const subscriptionsSeed = [
  {
    id: 'sub-acme-starter',
    orgKey: 'acme',
    plan: 'starter',
    status: 'active',
    seats: 10,
    stripeSubscriptionId: 'sub_seed_acme_starter',
    stripeCustomerId: 'cus_seed_owner',
    periodStart: addDays(now, -10),
    periodEnd: addDays(now, 20),
    trialEnd: addDays(now, 4),
  },
  {
    id: 'sub-flowforge-free',
    orgKey: 'flowforge',
    plan: 'free',
    status: 'active',
    seats: 5,
    stripeSubscriptionId: 'sub_seed_flowforge_free',
    stripeCustomerId: 'cus_seed_builder',
    periodStart: addDays(now, -5),
    periodEnd: addDays(now, 25),
    trialEnd: null,
  },
];

const orgInvitations = [
  {
    id: 'invite-flowforge-analyst',
    orgKey: 'flowforge',
    email: 'analyst@flowforge.test',
    role: 'editor',
    expiresAt: addDays(now, 5),
    inviterKey: 'builder',
  },
  {
    id: 'invite-acme-customer-success',
    orgKey: 'acme',
    email: 'cs@acme.test',
    role: 'admin',
    expiresAt: addDays(now, 7),
    inviterKey: 'owner',
  },
];

const backofficeInvitationTokensSeed = [
  {
    email: 'audit@acme.test',
    token: crypto.randomBytes(16).toString('hex'),
    expiresAt: addDays(now, 2),
  },
];

const db = createDb({ databaseUrl });

async function seedUsers() {
  const userMap = new Map<string, SeededUser>();

  for (const seed of seededUsers) {
    const hashed = await hashPassword(seed.password);

    const [savedUser] = await db
      .insert(user)
      .values({
        id: seed.id,
        name: seed.name,
        email: seed.email.toLowerCase(),
        role: seed.role,
        emailVerified: true,
        stripeCustomerId: seed.stripeCustomerId,
      })
      .onConflictDoUpdate({
        target: user.email,
        set: {
          name: seed.name,
          role: seed.role,
          stripeCustomerId: seed.stripeCustomerId,
          emailVerified: true,
        },
      })
      .returning({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    if (!savedUser) {
      throw new Error(`Failed to upsert user ${seed.email}`);
    }

    // Keep credential account in sync with seeded password
    await db
      .insert(account)
      .values({
        id: `acct-${seed.key}-credential`,
        accountId: savedUser.id,
        providerId: 'credential',
        userId: savedUser.id,
        password: hashed,
      })
      .onConflictDoUpdate({
        target: account.id,
        set: {
          accountId: savedUser.id,
          userId: savedUser.id,
          password: hashed,
          updatedAt: new Date(),
        },
      });

    userMap.set(seed.key, { ...seed, id: savedUser.id });
  }

  return userMap;
}

async function seedBackofficeAuthorizedEmails(userMap: Map<string, SeededUser>) {
  for (const entry of backofficeWhitelist) {
    const email =
      'emailKey' in entry
        ? userMap.get(entry.emailKey)?.email
        : entry.email;
    if (!email) continue;

    await db
      .insert(backofficeAuthorizedEmail)
      .values({
        email: email.toLowerCase(),
        role: entry.role,
        invitedBy: userMap.get('owner')?.id,
        invitedAt: entry.acceptedAt ?? now,
        acceptedAt: entry.acceptedAt,
        isOwner: entry.isOwner ?? false,
      })
      .onConflictDoUpdate({
        target: backofficeAuthorizedEmail.email,
        set: {
          role: entry.role,
          invitedBy: userMap.get('owner')?.id,
          acceptedAt: entry.acceptedAt,
          isOwner: entry.isOwner ?? false,
        },
      });
  }
}

async function seedOrganizations() {
  const orgMap = new Map<string, string>();

  for (const org of organizations) {
    const [savedOrg] = await db
      .insert(organization)
      .values({
        id: org.id,
        name: org.name,
        slug: org.slug,
        createdAt: org.createdAt,
        metadata: org.metadata ? JSON.stringify(org.metadata) : null,
      })
      .onConflictDoUpdate({
        target: organization.slug,
        set: {
          name: org.name,
          metadata: org.metadata ? JSON.stringify(org.metadata) : null,
        },
      })
      .returning({ id: organization.id, slug: organization.slug });

    if (!savedOrg) {
      throw new Error(`Failed to upsert organization ${org.slug}`);
    }

    orgMap.set(org.key, savedOrg.id);
  }

  return orgMap;
}

async function seedMemberships(
  userMap: Map<string, SeededUser>,
  orgMap: Map<string, string>,
) {
  for (const membership of memberships) {
    const userId = userMap.get(membership.userKey)?.id;
    const orgId = orgMap.get(membership.orgKey);
    if (!userId || !orgId) continue;

    await db
      .insert(member)
      .values({
        id: membership.id,
        organizationId: orgId,
        userId,
        role: membership.role,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: member.id,
        set: { role: membership.role },
      });
  }
}

async function seedFlows(userMap: Map<string, SeededUser>) {
  for (const flowSeed of flows) {
    const createdBy = userMap.get(flowSeed.createdByKey)?.id;
    if (!createdBy) continue;

    await db
      .insert(flow)
      .values({
        id: flowSeed.id,
        title: flowSeed.title,
        content: flowSeed.content,
        createdBy,
      })
      .onConflictDoUpdate({
        target: flow.id,
        set: {
          title: flowSeed.title,
          content: flowSeed.content,
          createdBy,
        },
      });
  }
}

const fallbackPriceId = (name: string) => `price_seed_${name}`;

async function seedSubscriptionPlans() {
  for (const plan of subscriptionPlans) {
    const stripePriceId = plan.stripePriceIdEnv || fallbackPriceId(plan.name);
    const stripeAnnualPriceId =
      plan.stripeAnnualPriceIdEnv && plan.stripeAnnualPriceIdEnv.trim().length
        ? plan.stripeAnnualPriceIdEnv
        : null;

    await db
      .insert(subscriptionPlan)
      .values({
        name: plan.name,
        displayName: plan.displayName,
        description: plan.description,
        stripePriceId,
        stripeAnnualPriceId,
        limits: plan.limits,
        trialDays: plan.trialDays ?? 0,
        sortOrder: plan.sortOrder,
        features: plan.features,
        isActive: plan.isActive ?? true,
      })
      .onConflictDoUpdate({
        target: subscriptionPlan.name,
        set: {
          displayName: plan.displayName,
          description: plan.description,
          stripePriceId,
          stripeAnnualPriceId,
          limits: plan.limits,
          trialDays: plan.trialDays ?? 0,
          sortOrder: plan.sortOrder,
          features: plan.features,
          isActive: plan.isActive ?? true,
        },
      });
  }
}

async function seedSubscriptions(
  orgMap: Map<string, string>,
  userMap: Map<string, SeededUser>,
) {
  for (const sub of subscriptionsSeed) {
    const orgId = orgMap.get(sub.orgKey);
    if (!orgId) continue;

    const stripeCustomerId =
      sub.stripeCustomerId ??
      userMap.get('owner')?.stripeCustomerId ??
      null;

    await db
      .insert(subscription)
      .values({
        id: sub.id,
        plan: sub.plan,
        referenceId: orgId,
        stripeCustomerId,
        stripeSubscriptionId: sub.stripeSubscriptionId,
        status: sub.status,
        periodStart: sub.periodStart,
        periodEnd: sub.periodEnd,
        trialEnd: sub.trialEnd,
        cancelAtPeriodEnd: false,
        seats: sub.seats,
      })
      .onConflictDoUpdate({
        target: subscription.id,
        set: {
          plan: sub.plan,
          stripeCustomerId,
          stripeSubscriptionId: sub.stripeSubscriptionId,
          status: sub.status,
          periodStart: sub.periodStart,
          periodEnd: sub.periodEnd,
          trialEnd: sub.trialEnd,
          seats: sub.seats,
        },
      });
  }
}

async function seedOrgInvitations(
  orgMap: Map<string, string>,
  userMap: Map<string, SeededUser>,
) {
  for (const invite of orgInvitations) {
    const orgId = orgMap.get(invite.orgKey);
    const inviterId = userMap.get(invite.inviterKey)?.id;
    if (!orgId || !inviterId) continue;

    await db
      .insert(invitation)
      .values({
        id: invite.id,
        organizationId: orgId,
        email: invite.email.toLowerCase(),
        role: invite.role,
        status: 'pending',
        expiresAt: invite.expiresAt,
        inviterId,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: invitation.id,
        set: {
          organizationId: orgId,
          role: invite.role,
          expiresAt: invite.expiresAt,
          status: 'pending',
          inviterId,
        },
      });
  }
}

async function seedBackofficeInvitationTokens() {
  for (const tokenSeed of backofficeInvitationTokensSeed) {
    await db
      .delete(backofficeInvitationToken)
      .where(eq(backofficeInvitationToken.email, tokenSeed.email));

    await db.insert(backofficeInvitationToken).values({
      id: crypto.randomUUID(),
      email: tokenSeed.email,
      token: tokenSeed.token,
      expiresAt: tokenSeed.expiresAt,
      usedAt: null,
      createdAt: now,
    });
  }
}

async function main() {
  const userMap = await seedUsers();
  const orgMap = await seedOrganizations();

  await Promise.all([
    seedBackofficeAuthorizedEmails(userMap),
    seedMemberships(userMap, orgMap),
    seedFlows(userMap),
    seedSubscriptionPlans(),
  ]);

  await Promise.all([
    seedSubscriptions(orgMap, userMap),
    seedOrgInvitations(orgMap, userMap),
    seedBackofficeInvitationTokens(),
  ]);

  console.log('Seed complete ✅');
  console.table(
    Array.from(userMap.values()).map((u) => ({
      email: u.email,
      role: u.role,
      password: u.password,
    })),
  );
  console.table(
    subscriptionPlans.map((plan) => ({
      name: plan.name,
      priceId: plan.stripePriceIdEnv || fallbackPriceId(plan.name),
      annualPriceId: plan.stripeAnnualPriceIdEnv || '—',
      active: plan.isActive ?? true,
    })),
  );
  console.table(
    backofficeInvitationTokensSeed.map((token) => ({
      email: token.email,
      token: token.token,
      expiresAt: token.expiresAt.toISOString(),
    })),
  );
}

main().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
