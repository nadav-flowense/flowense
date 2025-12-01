# User Flow Documentation

This document describes the authentication and authorization flows for both the **Backoffice** (internal admin panel) and **Platform** (customer-facing flow builder) applications.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Backoffice User Flows](#2-backoffice-user-flows)
3. [Platform User Flows](#3-platform-user-flows)
4. [Better Auth Configuration](#4-better-auth-configuration)
5. [Stripe Configuration](#5-stripe-configuration)
6. [Database Schema Additions](#6-database-schema-additions)
7. [Implementation Checklist](#7-implementation-checklist)

---

## 1. Overview

### Architecture Summary

| Application | Access Model | Authentication | Authorization |
|-------------|--------------|----------------|---------------|
| **Backoffice** | Invitation-only (email whitelist) | Email/password only | App-level roles (admin plugin) |
| **Platform** | Subscription + Invitation | Social providers + Email/password | Org-level roles (organization plugin) |

### Key Principles

1. **Backoffice**: Only pre-approved emails can access. No self-registration.
2. **Platform**: Users must either have an active subscription OR have been invited to an existing organization.
3. **Subscriptions**: Even free-tier users must go through Stripe checkout (with $0 charge).

---

## 2. Backoffice User Flows

### 2.1 Email Whitelist System

The backoffice uses an **authorized emails repository** to control who can access the admin panel.

#### Database Table: `backoffice_authorized_email`

```sql
CREATE TABLE backoffice_authorized_email (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'backoffice',  -- 'admin' | 'backoffice'
  invited_by TEXT REFERENCES user(id),
  invited_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  is_owner BOOLEAN DEFAULT FALSE,           -- Manual setup for initial owners
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Drizzle Schema

```typescript
// packages/db/src/schema/backoffice.ts

import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const backofficeAuthorizedEmail = pgTable("backoffice_authorized_email", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("backoffice"), // 'admin' | 'backoffice'
  invitedBy: text("invited_by").references(() => user.id),
  invitedAt: timestamp("invited_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  isOwner: boolean("is_owner").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 2.2 Initial Owner Setup

Owners (lead developers) must be set up manually in the database:

```sql
-- Manual setup for initial owners
INSERT INTO backoffice_authorized_email (id, email, role, is_owner)
VALUES 
  (gen_random_uuid(), 'lead-dev-1@company.com', 'admin', true),
  (gen_random_uuid(), 'lead-dev-2@company.com', 'admin', true);
```

### 2.3 Flow Diagrams

#### Owner Inviting a New Backoffice User

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     OWNER INVITES NEW USER                               │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌──────────────┐         ┌─────────────────┐
    │  Owner   │         │  Backoffice  │         │    Database     │
    │  (Admin) │         │     App      │         │                 │
    └────┬─────┘         └──────┬───────┘         └────────┬────────┘
         │                      │                          │
         │  1. Enter email +    │                          │
         │     select role      │                          │
         │─────────────────────>│                          │
         │                      │                          │
         │                      │  2. Check owner has      │
         │                      │     'user:manage:roles'  │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  3. Insert into          │
         │                      │     authorized_emails    │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  4. Send invitation      │
         │                      │     email with link      │
         │                      │─────────────────────────>│ (Email Service)
         │                      │                          │
         │  5. Success          │                          │
         │<─────────────────────│                          │
         │                      │                          │
```

#### New Backoffice User Accepting Invitation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  NEW USER ACCEPTS INVITATION                             │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌──────────────┐         ┌─────────────────┐
    │  Invited │         │  Backoffice  │         │   Better Auth   │
    │   User   │         │     App      │         │                 │
    └────┬─────┘         └──────┬───────┘         └────────┬────────┘
         │                      │                          │
         │  1. Click invite     │                          │
         │     link in email    │                          │
         │─────────────────────>│                          │
         │                      │                          │
         │                      │  2. Verify token &       │
         │                      │     check email in       │
         │                      │     whitelist            │
         │                      │─────────────────────────>│
         │                      │                          │
         │  3. Show password    │                          │
         │     setup form       │                          │
         │<─────────────────────│                          │
         │                      │                          │
         │  4. Submit password  │                          │
         │─────────────────────>│                          │
         │                      │                          │
         │                      │  5. Create user with     │
         │                      │     role from whitelist  │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  6. Update accepted_at   │
         │                      │     in whitelist         │
         │                      │─────────────────────────>│
         │                      │                          │
         │  7. Redirect to      │                          │
         │     backoffice       │                          │
         │<─────────────────────│                          │
         │                      │                          │
```

#### Backoffice Sign-In Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     BACKOFFICE SIGN-IN                                   │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌──────────────┐         ┌─────────────────┐
    │   User   │         │  Backoffice  │         │   Better Auth   │
    │          │         │     App      │         │                 │
    └────┬─────┘         └──────┬───────┘         └────────┬────────┘
         │                      │                          │
         │  1. Navigate to      │                          │
         │     /backoffice      │                          │
         │─────────────────────>│                          │
         │                      │                          │
         │                      │  2. Check session        │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  No session              │
         │                      │<─────────────────────────│
         │                      │                          │
         │  3. Redirect to      │                          │
         │     /login           │                          │
         │<─────────────────────│                          │
         │                      │                          │
         │  4. Enter email +    │                          │
         │     password         │                          │
         │─────────────────────>│                          │
         │                      │                          │
         │                      │  5. Authenticate         │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  6. Check user has       │
         │                      │     backoffice:access    │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  ✓ Has permission        │
         │                      │<─────────────────────────│
         │                      │                          │
         │  7. Redirect to      │                          │
         │     /backoffice      │                          │
         │<─────────────────────│                          │
         │                      │                          │
```

### 2.4 Key Implementation Points

1. **No Social Providers**: Backoffice uses email/password only
2. **No Self-Registration**: The `disableSignUp` option is used
3. **Email Whitelist Check**: Happens in `databaseHooks.user.create.before`
4. **Role Assignment**: Role is pulled from the whitelist, not chosen by user

---

## 3. Platform User Flows

### 3.1 Access Rules

A user can access the platform if they meet **ONE** of these conditions:

1. **Has an active subscription** (including free tier) → Can create organizations
2. **Has been invited to an organization** → Joins as member with assigned role

### 3.2 Flow Diagrams

#### Platform Sign-In Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PLATFORM AUTHENTICATION FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   User at   │
                              │  /platform  │
                              └──────┬──────┘
                                     │
                                     ▼
                            ┌────────────────┐
                            │  Has Session?  │
                            └────────┬───────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │ NO                              │ YES
                    ▼                                 ▼
           ┌────────────────┐               ┌────────────────┐
           │ Redirect to    │               │ Has active org │
           │ /auth/signin   │               │  membership?   │
           └────────┬───────┘               └────────┬───────┘
                    │                                │
                    ▼                       ┌────────┴────────┐
           ┌────────────────┐               │ YES             │ NO
           │ Has pending    │               ▼                 ▼
           │  invitation?   │       ┌──────────────┐  ┌──────────────┐
           └────────┬───────┘       │   Show org   │  │ Has active   │
                    │               │   selector   │  │ subscription?│
           ┌────────┴────────┐      └──────────────┘  └──────┬───────┘
           │ YES             │ NO                            │
           ▼                 ▼                      ┌────────┴────────┐
   ┌──────────────┐  ┌──────────────┐               │ YES             │ NO
   │ Show sign-in │  │ Show sign-in │               ▼                 ▼
   │ + invitation │  │    with      │       ┌──────────────┐  ┌──────────────┐
   │   accept     │  │ sign-up link │       │  Org creation│  │ Redirect to  │
   └──────────────┘  └──────────────┘       │    wizard    │  │   /pricing   │
                                            └──────────────┘  └──────────────┘
```

#### New User Sign-Up with Subscription

```
┌─────────────────────────────────────────────────────────────────────────┐
│                NEW USER SIGN-UP (WITH SUBSCRIPTION)                      │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐    ┌──────────┐    ┌─────────────┐    ┌─────────┐
    │   User   │    │ Platform │    │ Better Auth │    │  Stripe │
    └────┬─────┘    └────┬─────┘    └──────┬──────┘    └────┬────┘
         │               │                 │                │
         │ 1. Click      │                 │                │
         │    "Sign Up"  │                 │                │
         │──────────────>│                 │                │
         │               │                 │                │
         │ 2. Show       │                 │                │
         │    pricing    │                 │                │
         │<──────────────│                 │                │
         │               │                 │                │
         │ 3. Select     │                 │                │
         │    plan       │                 │                │
         │    (free/pro) │                 │                │
         │──────────────>│                 │                │
         │               │                 │                │
         │ 4. Show       │                 │                │
         │    sign-up    │                 │                │
         │    form       │                 │                │
         │<──────────────│                 │                │
         │               │                 │                │
         │ 5. Submit     │                 │                │
         │    email +    │                 │                │
         │    password   │                 │                │
         │──────────────>│                 │                │
         │               │                 │                │
         │               │ 6. Create user  │                │
         │               │    + Stripe     │                │
         │               │    customer     │                │
         │               │────────────────>│                │
         │               │                 │                │
         │               │                 │ 7. Create      │
         │               │                 │    customer    │
         │               │                 │───────────────>│
         │               │                 │                │
         │               │ 8. Create       │                │
         │               │    checkout     │                │
         │               │    session      │                │
         │               │────────────────>│                │
         │               │                 │                │
         │               │                 │ 9. Create      │
         │               │                 │    checkout    │
         │               │                 │───────────────>│
         │               │                 │                │
         │ 10. Redirect  │                 │                │
         │     to Stripe │                 │                │
         │     checkout  │                 │                │
         │<──────────────│                 │                │
         │               │                 │                │
         │ 11. Complete  │                 │                │
         │     checkout  │                 │                │
         │     ($0 for   │                 │                │
         │     free tier)│                 │                │
         │───────────────────────────────────────────────>  │
         │               │                 │                │
         │               │                 │ 12. Webhook:   │
         │               │                 │     checkout   │
         │               │                 │     completed  │
         │               │                 │<───────────────│
         │               │                 │                │
         │               │ 13. Create      │                │
         │               │     subscription│                │
         │               │     record      │                │
         │               │<────────────────│                │
         │               │                 │                │
         │ 14. Redirect  │                 │                │
         │     to org    │                 │                │
         │     creation  │                 │                │
         │<──────────────│                 │                │
         │               │                 │                │
```

#### Invited User Sign-Up Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│              INVITED USER SIGN-UP (NO SUBSCRIPTION NEEDED)               │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌──────────────┐         ┌─────────────────┐
    │ Invited  │         │   Platform   │         │   Better Auth   │
    │   User   │         │     App      │         │                 │
    └────┬─────┘         └──────┬───────┘         └────────┬────────┘
         │                      │                          │
         │  1. Click invite     │                          │
         │     link in email    │                          │
         │─────────────────────>│                          │
         │                      │                          │
         │                      │  2. Validate invitation  │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  ✓ Valid invitation      │
         │                      │<─────────────────────────│
         │                      │                          │
         │  3. Show sign-up     │                          │
         │     form (social     │                          │
         │     or email/pass)   │                          │
         │<─────────────────────│                          │
         │                      │                          │
         │  4. Complete         │                          │
         │     sign-up          │                          │
         │─────────────────────>│                          │
         │                      │                          │
         │                      │  5. Create user          │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  6. Accept invitation    │
         │                      │     (add to org as       │
         │                      │     member with role)    │
         │                      │─────────────────────────>│
         │                      │                          │
         │  7. Redirect to      │                          │
         │     platform with    │                          │
         │     active org set   │                          │
         │<─────────────────────│                          │
         │                      │                          │
```

#### Organization Creation After Subscription

```
┌─────────────────────────────────────────────────────────────────────────┐
│              ORGANIZATION CREATION (POST-SUBSCRIPTION)                   │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌──────────────┐         ┌─────────────────┐
    │   User   │         │   Platform   │         │   Better Auth   │
    │          │         │     App      │         │                 │
    └────┬─────┘         └──────┬───────┘         └────────┬────────┘
         │                      │                          │
         │  1. After checkout   │                          │
         │     success, show    │                          │
         │     org wizard       │                          │
         │<─────────────────────│                          │
         │                      │                          │
         │  2. Enter org name   │                          │
         │     + slug           │                          │
         │─────────────────────>│                          │
         │                      │                          │
         │                      │  3. Create organization  │
         │                      │     (user becomes owner) │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  4. Link subscription    │
         │                      │     to organization      │
         │                      │     (referenceId =       │
         │                      │     org.id)              │
         │                      │─────────────────────────>│
         │                      │                          │
         │                      │  5. Set active org       │
         │                      │─────────────────────────>│
         │                      │                          │
         │  6. Redirect to      │                          │
         │     /dashboard       │                          │
         │<─────────────────────│                          │
         │                      │                          │
```

### 3.3 Key Implementation Points

1. **Social Sign-In Restriction**: Use `databaseHooks.user.create.before` to check for pending invitation
2. **Subscription Check**: After sign-in, verify user has subscription OR org membership
3. **Free Tier**: Stripe checkout with $0 price still creates subscription record
4. **Org-Subscription Link**: Use `referenceId` to associate subscription with organization

---

## 4. Better Auth Configuration

### 4.1 Complete Server Configuration

```typescript
// packages/auth/src/auth.ts

import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import Stripe from "stripe";
import { db } from "@your-org/db";
import { 
  appAc, appRoles, 
  orgAc, orgRoles 
} from "./permissions";
import { 
  backofficeAuthorizedEmail, 
  invitation 
} from "@your-org/db/schema";
import { eq } from "drizzle-orm";

// Initialize Stripe client
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  
  // Base URL for the auth server
  baseURL: process.env.BETTER_AUTH_URL,
  
  // Email/Password configuration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // Implement email sending
    },
  },
  
  // Social providers (Platform only - controlled via databaseHooks)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  
  // Database hooks for access control
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const email = user.email.toLowerCase();
          
          // Check if this is a backoffice sign-up attempt
          const isBackofficeAttempt = ctx.request?.headers
            .get("x-app-type") === "backoffice";
          
          if (isBackofficeAttempt) {
            // Backoffice: Check email whitelist
            const authorized = await db.query.backofficeAuthorizedEmail.findFirst({
              where: eq(backofficeAuthorizedEmail.email, email),
            });
            
            if (!authorized) {
              throw new APIError("FORBIDDEN", {
                message: "Email not authorized for backoffice access",
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
          
          // Platform: Check for pending invitation
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
              role: "member", // Default app-level role for platform users
            },
          };
        },
        after: async (user) => {
          // Update backoffice whitelist if applicable
          await db
            .update(backofficeAuthorizedEmail)
            .set({ acceptedAt: new Date() })
            .where(eq(backofficeAuthorizedEmail.email, user.email.toLowerCase()));
        },
      },
    },
  },
  
  // Trusted origins
  trustedOrigins: [
    process.env.PLATFORM_URL!,
    process.env.BACKOFFICE_URL!,
  ],
  
  plugins: [
    // Admin plugin (App-level RBAC)
    admin({
      ac: appAc,
      roles: appRoles,
      defaultRole: "member",
      adminUserIds: process.env.ADMIN_USER_IDS?.split(",") || [],
    }),
    
    // Organization plugin (Org-level RBAC)
    organization({
      ac: orgAc,
      roles: orgRoles,
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      membershipLimit: 50,
      organizationLimit: 5,
      invitationExpiresIn: 60 * 60 * 48, // 48 hours
      sendInvitationEmail: async (data) => {
        // Implement invitation email
        // data: { email, organization, inviter, url, role }
      },
      onInvitationAccepted: async (data) => {
        // Log analytics, send welcome email, etc.
      },
    }),
    
    // Stripe plugin (Subscriptions)
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      
      subscription: {
        enabled: true,
        plans: [
          {
            name: "free",
            priceId: process.env.STRIPE_FREE_PRICE_ID!, // $0/month price
            limits: {
              flows: 3,
              members: 2,
              executions: 100,
            },
          },
          {
            name: "starter",
            priceId: process.env.STRIPE_STARTER_PRICE_ID!,
            annualDiscountPriceId: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
            limits: {
              flows: 10,
              members: 5,
              executions: 1000,
            },
            freeTrial: {
              days: 14,
              onTrialStart: async (subscription) => {
                // Send trial start email
              },
              onTrialEnd: async ({ subscription }) => {
                // Send trial ending email
              },
            },
          },
          {
            name: "pro",
            priceId: process.env.STRIPE_PRO_PRICE_ID!,
            annualDiscountPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
            limits: {
              flows: 50,
              members: 20,
              executions: 10000,
            },
          },
          {
            name: "enterprise",
            priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
            limits: {
              flows: -1, // unlimited
              members: -1,
              executions: -1,
            },
          },
        ],
        
        // Authorize subscription operations for organizations
        authorizeReference: async ({ user, referenceId, action }) => {
          // If referenceId is user ID, always allow
          if (referenceId === user.id) return true;
          
          // For org referenceId, check membership
          const member = await db.query.member.findFirst({
            where: and(
              eq(member.userId, user.id),
              eq(member.organizationId, referenceId)
            ),
          });
          
          // Only owner can manage billing
          if (action === "upgrade-subscription" || 
              action === "cancel-subscription" ||
              action === "restore-subscription") {
            return member?.role === "owner";
          }
          
          // Admin can view billing
          if (action === "list-subscription") {
            return member?.role === "owner" || member?.role === "admin";
          }
          
          return false;
        },
        
        // Hook: When subscription is created
        onSubscriptionComplete: async ({ subscription, plan }) => {
          // If this is a new subscription (not linked to org yet),
          // the frontend will prompt org creation
          console.log(`Subscription ${subscription.id} created for plan ${plan.name}`);
        },
        
        // Customize checkout
        getCheckoutSessionParams: async ({ user, plan }) => {
          return {
            params: {
              allow_promotion_codes: true,
              billing_address_collection: "auto",
              customer_email: user.email,
            },
          };
        },
      },
      
      // Handle additional webhook events
      onEvent: async (event) => {
        switch (event.type) {
          case "invoice.paid":
            // Handle successful payment
            break;
          case "invoice.payment_failed":
            // Handle failed payment, notify user
            break;
        }
      },
    }),
  ],
});

export type Auth = typeof auth;
```

### 4.2 Platform Client Configuration

```typescript
// apps/platform/src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
import { orgAc, orgRoles } from "@your-org/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL!,
  plugins: [
    organizationClient({
      ac: orgAc,
      roles: orgRoles,
    }),
    stripeClient({
      subscription: true,
    }),
  ],
});

// Helper to check if user can access platform
export async function canAccessPlatform(): Promise<{
  canAccess: boolean;
  reason: "authenticated" | "needs-subscription" | "needs-signin";
  hasSubscription: boolean;
  hasOrgMembership: boolean;
}> {
  const { data: session } = await authClient.getSession();
  
  if (!session) {
    return {
      canAccess: false,
      reason: "needs-signin",
      hasSubscription: false,
      hasOrgMembership: false,
    };
  }
  
  // Check for organization membership
  const { data: orgs } = await authClient.organization.list();
  const hasOrgMembership = orgs && orgs.length > 0;
  
  // Check for active subscription
  const { data: subscriptions } = await authClient.subscription.list();
  const hasSubscription = subscriptions?.some(
    (s) => s.status === "active" || s.status === "trialing"
  );
  
  if (hasOrgMembership || hasSubscription) {
    return {
      canAccess: true,
      reason: "authenticated",
      hasSubscription: !!hasSubscription,
      hasOrgMembership: !!hasOrgMembership,
    };
  }
  
  return {
    canAccess: false,
    reason: "needs-subscription",
    hasSubscription: false,
    hasOrgMembership: false,
  };
}
```

### 4.3 Backoffice Client Configuration

```typescript
// apps/backoffice/src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { appAc, appRoles } from "@your-org/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL!,
  plugins: [
    adminClient({
      ac: appAc,
      roles: appRoles,
    }),
  ],
  // Add header to identify backoffice requests
  fetchOptions: {
    headers: {
      "x-app-type": "backoffice",
    },
  },
});
```

---

## 5. Stripe Configuration

### 5.1 Stripe Dashboard Setup (Sandbox/Test Mode)

#### Step 1: Ensure Test Mode is Active

In Stripe Dashboard:
1. Toggle **"Test mode"** in the top-right corner
2. All operations will use test data

#### Step 2: Create Products and Prices

Create products in **Products** section:

```
Product: Flow Builder Free
├── Price: $0/month (price_test_free_monthly)

Product: Flow Builder Starter
├── Price: $19/month (price_test_starter_monthly)
├── Price: $190/year (price_test_starter_annual)

Product: Flow Builder Pro
├── Price: $49/month (price_test_pro_monthly)
├── Price: $490/year (price_test_pro_annual)

Product: Flow Builder Enterprise
├── Price: $199/month (price_test_enterprise_monthly)
```

#### Step 3: Configure Webhook

1. Go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Enter URL: `https://your-domain.com/api/auth/stripe/webhook`
   - For local dev: Use Stripe CLI (see below)
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

#### Step 4: Get API Keys

1. Go to **Developers → API keys**
2. Copy **Secret key** → `STRIPE_SECRET_KEY`
3. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 5.2 Local Development with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# Copy the webhook signing secret from the output
# > Ready! Your webhook signing secret is whsec_xxxxx
```

### 5.3 Environment Variables

```env
# .env.local (development)

# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Test Price IDs
STRIPE_FREE_PRICE_ID=price_test_free_monthly
STRIPE_STARTER_PRICE_ID=price_test_starter_monthly
STRIPE_STARTER_ANNUAL_PRICE_ID=price_test_starter_annual
STRIPE_PRO_PRICE_ID=price_test_pro_monthly
STRIPE_PRO_ANNUAL_PRICE_ID=price_test_pro_annual
STRIPE_ENTERPRISE_PRICE_ID=price_test_enterprise_monthly
```

### 5.4 Test Card Numbers

Use these test cards in Stripe checkout:

| Scenario | Card Number |
|----------|-------------|
| Successful payment | `4242 4242 4242 4242` |
| Requires authentication | `4000 0025 0000 3155` |
| Declined | `4000 0000 0000 9995` |

Use any future expiry date and any 3-digit CVC.

---

## 6. Database Schema Additions

### 6.1 Complete Schema Summary

Beyond Better Auth's default tables, you need:

```typescript
// packages/db/src/schema/custom.ts

import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { user, organization } from "./auth"; // Better Auth tables

// Backoffice email whitelist
export const backofficeAuthorizedEmail = pgTable("backoffice_authorized_email", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("backoffice"),
  invitedBy: text("invited_by").references(() => user.id),
  invitedAt: timestamp("invited_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  isOwner: boolean("is_owner").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invitation token for backoffice (separate from org invitations)
export const backofficeInvitationToken = pgTable("backoffice_invitation_token", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 6.2 Tables Created by Better Auth Plugins

**Admin Plugin** adds to `user` table:
- `role` (string)
- `banned` (boolean)
- `banReason` (string)
- `banExpires` (timestamp)

**Admin Plugin** adds to `session` table:
- `impersonatedBy` (string)

**Organization Plugin** creates:
- `organization` table
- `member` table
- `invitation` table

**Stripe Plugin** creates:
- `subscription` table
- Adds `stripeCustomerId` to `user` table

---

## 7. Implementation Checklist

### 7.1 Backoffice Setup

- [ ] Create `backoffice_authorized_email` table
- [ ] Create `backoffice_invitation_token` table
- [ ] Manually insert initial owner emails
- [ ] Implement invitation email sending
- [ ] Create invitation acceptance page
- [ ] Implement email whitelist check in `databaseHooks`
- [ ] Create backoffice sign-in page (email/password only)
- [ ] Add `backoffice:access` permission check on all backoffice routes
- [ ] Create user invitation UI for owners

### 7.2 Platform Setup

- [ ] Configure Stripe products and prices (test mode)
- [ ] Set up Stripe webhook endpoint
- [ ] Configure Stripe CLI for local development
- [ ] Implement pricing page with plan selection
- [ ] Create sign-up flow with Stripe checkout
- [ ] Handle checkout success → org creation wizard
- [ ] Implement invitation acceptance flow
- [ ] Add subscription/membership check on platform routes
- [ ] Create organization selector for users with multiple orgs
- [ ] Implement billing portal link for subscription management

### 7.3 Better Auth Setup

- [ ] Configure admin plugin with app-level permissions
- [ ] Configure organization plugin with org-level permissions
- [ ] Configure Stripe plugin with plans
- [ ] Set up `databaseHooks` for access control
- [ ] Configure social providers
- [ ] Set up trusted origins
- [ ] Run database migrations

### 7.4 Testing

- [ ] Test backoffice invitation flow
- [ ] Test backoffice sign-in with unauthorized email (should fail)
- [ ] Test platform sign-up with free plan
- [ ] Test platform sign-up with paid plan
- [ ] Test invitation acceptance for new user
- [ ] Test invitation acceptance for existing user
- [ ] Test subscription webhook handling
- [ ] Test organization creation after subscription
- [ ] Test billing portal access