# Two-Level RBAC Implementation Guide with Better Auth

This guide covers implementing a two-level role-based access control system using Better Auth for applications with both a backoffice (internal team) and a platform (customer-facing product).
SMARTLY USE YOUR TOOLS, AGENTS, AND MCPs - you have a lot of power to use and a lot of information to learn. don't reinvent the wheel.
---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Roles & Permissions Reference](#2-roles--permissions-reference)
3. [Database Layer](#3-database-layer)
4. [Permissions Definition](#4-permissions-definition)
5. [Better Auth Server Configuration](#5-better-auth-server-configuration)
6. [Hono Server Integration](#6-hono-server-integration)
7. [React Client Configuration](#7-react-client-configuration)
8. [Server-Side Permission Checks](#8-server-side-permission-checks)
9. [Client-Side Permission Checks](#9-client-side-permission-checks)
10. [Key Operations Reference](#10-key-operations-reference)
11. [Important Considerations](#11-important-considerations)

---

## 1. Architecture Overview

You have **two distinct permission systems** that Better Auth supports natively:

| Level | Plugin | Scope | Use Case |
|-------|--------|-------|----------|
| **App-level** | `admin` plugin | Global user roles | Backoffice (devs, analytics, support) |
| **Organization-level** | `organization` plugin | Per-org member roles | Platform (customers, teams) |

Both plugins coexist and are designed for exactly this scenario.

### Key Concepts

- **App-level roles** are stored on the `user` table and apply globally across the entire application
- **Organization-level roles** are stored on the `member` table and are scoped to a specific organization
- A user can have BOTH an app-level role AND be a member of multiple organizations with different org-level roles

---

## 2. Roles & Permissions Reference

### 2.1 App-Level Roles (Backoffice)

These roles control access to the backoffice admin panel for your internal team.

#### Admin Role
Full system access including user management and impersonation.

| Resource | Permissions |
|----------|-------------|
| flow | create, read, read:all, update, update:all, delete, delete:all, restore, restore:all |
| user | read, update, delete, manage:roles, impersonate |
| backoffice | access, analytics, audit-logs |

#### Backoffice Role
Standard backoffice operator with read/write access but no user management.

| Resource | Permissions |
|----------|-------------|
| flow | read:all, update:all, delete:all |
| user | read, update |
| backoffice | access, analytics |

#### Member Role
Regular platform user with standard flow operations (no backoffice access).

| Resource | Permissions |
|----------|-------------|
| flow | create, read, read:all, update, delete, restore |
| user | read |

#### Viewer Role
Read-only access to flows (no backoffice access).

| Resource | Permissions |
|----------|-------------|
| flow | read, read:all |
| user | read |

---

### 2.2 Organization-Level Roles (Platform)

These roles control what members can do within their organization on your flow builder platform.

#### Owner Role
The subscriber who created/pays for the organization. Full control including billing.

| Resource | Permissions |
|----------|-------------|
| flow | create, read, update, delete, publish, unpublish, duplicate, export, restore |
| template | create, read, update, delete |
| integration | create, read, update, delete, test |
| variable | create, read, update, delete |
| webhook | create, read, update, delete, test |
| billing | read, update |
| analytics | read, export |
| auditLog | read |
| member | create, update, delete |
| invitation | create, cancel |
| organization | update, delete |

#### Admin Role
Can manage everything except billing updates and org deletion.

| Resource | Permissions |
|----------|-------------|
| flow | create, read, update, delete, publish, unpublish, duplicate, export, restore |
| template | create, read, update, delete |
| integration | create, read, update, delete, test |
| variable | create, read, update, delete |
| webhook | create, read, update, delete, test |
| billing | read |
| analytics | read, export |
| auditLog | read |
| member | create, update, delete |
| invitation | create, cancel |
| organization | update |

#### Editor Role
Standard team member who builds flows. Cannot publish or manage configurations.

| Resource | Permissions |
|----------|-------------|
| flow | create, read, update, duplicate, export |
| template | read |
| integration | read, test |
| variable | read |
| webhook | read |
| analytics | read |

#### Viewer Role
Read-only access for stakeholders, clients, or reviewers.

| Resource | Permissions |
|----------|-------------|
| flow | read |
| template | read |
| integration | read |
| analytics | read |

---

### 2.3 Permissions Matrix (Organization-Level)

| Resource | Action | Owner | Admin | Editor | Viewer |
|----------|--------|:-----:|:-----:|:------:|:------:|
| **flow** | create | ✓ | ✓ | ✓ | |
| | read | ✓ | ✓ | ✓ | ✓ |
| | update | ✓ | ✓ | ✓ | |
| | delete | ✓ | ✓ | | |
| | publish | ✓ | ✓ | | |
| | unpublish | ✓ | ✓ | | |
| | duplicate | ✓ | ✓ | ✓ | |
| | export | ✓ | ✓ | ✓ | |
| | restore | ✓ | ✓ | | |
| **template** | create | ✓ | ✓ | | |
| | read | ✓ | ✓ | ✓ | ✓ |
| | update | ✓ | ✓ | | |
| | delete | ✓ | ✓ | | |
| **integration** | create | ✓ | ✓ | | |
| | read | ✓ | ✓ | ✓ | ✓ |
| | update | ✓ | ✓ | | |
| | delete | ✓ | ✓ | | |
| | test | ✓ | ✓ | ✓ | |
| **variable** | create | ✓ | ✓ | | |
| | read | ✓ | ✓ | ✓ | |
| | update | ✓ | ✓ | | |
| | delete | ✓ | ✓ | | |
| **webhook** | create | ✓ | ✓ | | |
| | read | ✓ | ✓ | ✓ | |
| | update | ✓ | ✓ | | |
| | delete | ✓ | ✓ | | |
| | test | ✓ | ✓ | ✓ | |
| **billing** | read | ✓ | ✓ | | |
| | update | ✓ | | | |
| **analytics** | read | ✓ | ✓ | ✓ | ✓ |
| | export | ✓ | ✓ | | |
| **auditLog** | read | ✓ | ✓ | | |
| **member** | create | ✓ | ✓ | | |
| | update | ✓ | ✓ | | |
| | delete | ✓ | ✓ | | |
| **invitation** | create | ✓ | ✓ | | |
| | cancel | ✓ | ✓ | | |
| **organization** | update | ✓ | ✓ | | |
| | delete | ✓ | | | |

---

## 3. Database Layer

### 3.1 Tables Added by Admin Plugin

Adds fields to the **`user`** table:

| Field | Type | Description |
|-------|------|-------------|
| role | string | User's app-level role (e.g., "admin", "backoffice", "member", "viewer") |
| banned | boolean | Whether the user is banned |
| banReason | string (optional) | Reason for the ban |
| banExpires | date (optional) | When the ban expires |

Adds to **`session`** table:

| Field | Type | Description |
|-------|------|-------------|
| impersonatedBy | string | ID of the admin impersonating this session |

### 3.2 Tables Added by Organization Plugin

**`organization`** table:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Primary key |
| name | string | Organization name |
| slug | string | URL-friendly identifier |
| logo | string (optional) | Logo URL |
| metadata | string (optional) | JSON metadata |
| createdAt | date | Creation timestamp |

**`member`** table:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Primary key |
| userId | string | Foreign key to user |
| organizationId | string | Foreign key to organization |
| role | string | Member's role in this org |
| createdAt | date | When member was added |

**`invitation`** table:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Primary key |
| email | string | Invitee email |
| organizationId | string | Target organization |
| role | string | Role to assign on accept |
| status | string | pending, accepted, rejected, canceled |
| expiresAt | date | Invitation expiry |

### 3.3 Running Migrations

Run the Better Auth CLI to generate/migrate:

```bash
# Auto-migrate (recommended for development)
npx @better-auth/cli migrate

# Or generate schema files for manual migration
npx @better-auth/cli generate
```

---

## 4. Permissions Definition

Create a shared permissions package that both server and clients can import.

### 4.1 File Structure

```
packages/auth/src/permissions/
├── index.ts          # Re-exports everything
├── app.ts            # App-level (backoffice) permissions
└── organization.ts   # Organization-level (platform) permissions
```

### 4.2 App-Level Permissions (Backoffice)

```typescript
// packages/auth/src/permissions/app.ts

import { createAccessControl } from "better-auth/plugins/access";
import { 
  defaultStatements, 
  adminAc 
} from "better-auth/plugins/admin/access";

/**
 * App-level statement (backoffice operations)
 * These permissions are global and not scoped to any organization
 */
const appStatement = {
  ...defaultStatements,
  flow: [
    "create",
    "read",
    "read:all",
    "update",
    "update:all",
    "delete",
    "delete:all",
    "restore",
    "restore:all",
  ],
  backoffice: ["access", "analytics", "audit-logs"],
} as const;

export const appAc = createAccessControl(appStatement);

/**
 * App-Level Roles
 */
export const appRoles = {
  /**
   * Admin - Full system access
   * For lead developers and system administrators
   */
  admin: appAc.newRole({
    ...adminAc.statements,
    flow: [
      "create",
      "read",
      "read:all",
      "update",
      "update:all",
      "delete",
      "delete:all",
      "restore",
      "restore:all",
    ],
    backoffice: ["access", "analytics", "audit-logs"],
  }),

  /**
   * Backoffice - Standard backoffice operator
   * Can view/edit all flows and access analytics, but no user management
   */
  backoffice: appAc.newRole({
    user: ["list"],
    flow: ["read:all", "update:all", "delete:all"],
    backoffice: ["access", "analytics"],
  }),

  /**
   * Member - Regular platform user
   * Standard flow operations, no backoffice access
   */
  member: appAc.newRole({
    flow: ["create", "read", "read:all", "update", "delete", "restore"],
  }),

  /**
   * Viewer - Read-only user
   * Can only view flows, no backoffice access
   */
  viewer: appAc.newRole({
    flow: ["read", "read:all"],
  }),
};

export type AppRole = keyof typeof appRoles;
```

### 4.3 Organization-Level Permissions (Platform)

```typescript
// packages/auth/src/permissions/organization.ts

import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  ownerAc,
  adminAc,
  memberAc,
} from "better-auth/plugins/organization/access";

/**
 * Organization-level statement (platform operations)
 * These permissions are scoped to a specific organization
 */
const orgStatement = {
  ...defaultStatements,

  // Core product
  flow: [
    "create",
    "read",
    "update",
    "delete",
    "publish",
    "unpublish",
    "duplicate",
    "export",
    "restore",
  ],
  template: ["create", "read", "update", "delete"],

  // Integrations & configuration
  integration: ["create", "read", "update", "delete", "test"],
  variable: ["create", "read", "update", "delete"],
  webhook: ["create", "read", "update", "delete", "test"],

  // Organization management
  billing: ["read", "update"],
  analytics: ["read", "export"],
  auditLog: ["read"],
} as const;

export const orgAc = createAccessControl(orgStatement);

/**
 * Organization Roles
 */
export const orgRoles = {
  /**
   * Owner - The subscriber who created/pays for the organization
   * Full control including billing and destructive actions
   */
  owner: orgAc.newRole({
    ...ownerAc.statements,
    flow: [
      "create",
      "read",
      "update",
      "delete",
      "publish",
      "unpublish",
      "duplicate",
      "export",
      "restore",
    ],
    template: ["create", "read", "update", "delete"],
    integration: ["create", "read", "update", "delete", "test"],
    variable: ["create", "read", "update", "delete"],
    webhook: ["create", "read", "update", "delete", "test"],
    billing: ["read", "update"],
    analytics: ["read", "export"],
    auditLog: ["read"],
  }),

  /**
   * Admin - Can manage everything except billing and org deletion
   * Typically team leads or senior members
   */
  admin: orgAc.newRole({
    ...adminAc.statements,
    flow: [
      "create",
      "read",
      "update",
      "delete",
      "publish",
      "unpublish",
      "duplicate",
      "export",
      "restore",
    ],
    template: ["create", "read", "update", "delete"],
    integration: ["create", "read", "update", "delete", "test"],
    variable: ["create", "read", "update", "delete"],
    webhook: ["create", "read", "update", "delete", "test"],
    billing: ["read"], // Can view but not modify
    analytics: ["read", "export"],
    auditLog: ["read"],
  }),

  /**
   * Editor - Can create and edit flows, limited configuration access
   * Standard team member building flows
   */
  editor: orgAc.newRole({
    ...memberAc.statements,
    flow: ["create", "read", "update", "duplicate", "export"],
    template: ["read"],
    integration: ["read", "test"],
    variable: ["read"],
    webhook: ["read"],
    analytics: ["read"],
  }),

  /**
   * Viewer - Read-only access to flows and resources
   * For stakeholders, clients, or reviewers
   */
  viewer: orgAc.newRole({
    flow: ["read"],
    template: ["read"],
    integration: ["read"],
    analytics: ["read"],
  }),
};

export type OrgRole = keyof typeof orgRoles;
```

### 4.4 Index File

```typescript
// packages/auth/src/permissions/index.ts

export { appAc, appRoles, type AppRole } from "./app";
export { orgAc, orgRoles, type OrgRole } from "./organization";
```

---

## 5. Better Auth Server Configuration

```typescript
// packages/auth/src/auth.ts

import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@your-org/db";
import { appAc, appRoles, orgAc, orgRoles } from "./permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }), // or your provider

  plugins: [
    // App-level RBAC (backoffice)
    admin({
      ac: appAc,
      roles: appRoles,
      defaultRole: "member", // New signups get "member" role
      // Optional: hardcode initial super-admins by userId
      adminUserIds: ["your-lead-dev-user-id-1", "your-lead-dev-user-id-2"],
    }),

    // Organization-level RBAC (platform)
    organization({
      ac: orgAc,
      roles: orgRoles,
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      membershipLimit: 50, // Max members per org
      organizationLimit: 5, // Max orgs per user
      invitationExpiresIn: 60 * 60 * 48, // 48 hours
      // Optional: send invitation emails
      sendInvitationEmail: async (data) => {
        // Integrate with your email service
        // data.email, data.organization, data.inviter, data.url
      },
    }),
  ],

  trustedOrigins: [
    "https://app.yourplatform.com", // Platform app
    "https://backoffice.yourplatform.com", // Backoffice app
    "http://localhost:3000", // Development
    "http://localhost:3001",
  ],
});

export type Auth = typeof auth;
```

---

## 6. Hono Server Integration

### 6.1 Basic Setup with Session Middleware

```typescript
// packages/server/src/index.ts

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { auth } from "@your-org/auth";

// Define context variables type
type Variables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const app = new Hono<{ Variables: Variables }>();

// CORS configuration for both apps
app.use(
  "/api/*",
  cors({
    origin: [
      "https://app.yourplatform.com",
      "https://backoffice.yourplatform.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    credentials: true,
  })
);

// Session middleware - populates user and session on all routes
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

// Mount Better Auth handler
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Example: Get current session
app.get("/api/session", (c) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ user, session });
});

serve(app, { port: 3000 });
```

### 6.2 Reusable Permission Middleware

```typescript
// packages/server/src/middleware/permissions.ts

import { Context, Next } from "hono";
import { auth } from "@your-org/auth";

type Variables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

/**
 * Middleware to require app-level permissions (backoffice)
 * Checks the user's global role
 */
export function requireAppPermission(permission: Record<string, string[]>) {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permission,
      },
    });

    if (!hasPermission.success) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await next();
  };
}

/**
 * Middleware to require organization-level permissions (platform)
 * Checks the user's role in their active organization
 */
export function requireOrgPermission(permission: Record<string, string[]>) {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const hasPermission = await auth.api.hasPermission({
      headers: c.req.raw.headers,
      body: {
        permission,
      },
    });

    if (!hasPermission.success) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await next();
  };
}

/**
 * Middleware to require backoffice access
 * Shorthand for checking backoffice:access permission
 */
export function requireBackofficeAccess() {
  return requireAppPermission({ backoffice: ["access"] });
}

/**
 * Middleware to require admin role
 * For sensitive operations like user management
 */
export function requireAdmin() {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user has admin role or is in adminUserIds
    if (user.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }

    await next();
  };
}
```

### 6.3 Route Examples

```typescript
// packages/server/src/routes/backoffice.ts

import { Hono } from "hono";
import { 
  requireBackofficeAccess, 
  requireAppPermission,
  requireAdmin 
} from "../middleware/permissions";

const backoffice = new Hono();

// All backoffice routes require backoffice:access
backoffice.use("/*", requireBackofficeAccess());

// Analytics dashboard
backoffice.get(
  "/analytics",
  requireAppPermission({ backoffice: ["analytics"] }),
  async (c) => {
    // Return analytics data
    return c.json({ analytics: {} });
  }
);

// Audit logs (admin only)
backoffice.get(
  "/audit-logs",
  requireAppPermission({ backoffice: ["audit-logs"] }),
  async (c) => {
    // Return audit logs
    return c.json({ logs: [] });
  }
);

// List all users
backoffice.get(
  "/users",
  requireAppPermission({ user: ["list"] }),
  async (c) => {
    // Return user list
    return c.json({ users: [] });
  }
);

// Ban user (admin only)
backoffice.post(
  "/users/:userId/ban",
  requireAdmin(),
  async (c) => {
    const userId = c.req.param("userId");
    // Ban user logic
    return c.json({ success: true });
  }
);

export { backoffice };
```

```typescript
// packages/server/src/routes/flows.ts

import { Hono } from "hono";
import { requireOrgPermission } from "../middleware/permissions";

const flows = new Hono();

// Create flow
flows.post(
  "/",
  requireOrgPermission({ flow: ["create"] }),
  async (c) => {
    // Create flow logic
    return c.json({ flow: {} });
  }
);

// Read flow
flows.get(
  "/:flowId",
  requireOrgPermission({ flow: ["read"] }),
  async (c) => {
    // Get flow logic
    return c.json({ flow: {} });
  }
);

// Update flow
flows.put(
  "/:flowId",
  requireOrgPermission({ flow: ["update"] }),
  async (c) => {
    // Update flow logic
    return c.json({ flow: {} });
  }
);

// Delete flow
flows.delete(
  "/:flowId",
  requireOrgPermission({ flow: ["delete"] }),
  async (c) => {
    // Delete flow logic
    return c.json({ success: true });
  }
);

// Publish flow (requires publish permission)
flows.post(
  "/:flowId/publish",
  requireOrgPermission({ flow: ["publish"] }),
  async (c) => {
    // Publish flow logic
    return c.json({ published: true });
  }
);

export { flows };
```

---

## 7. React Client Configuration

### 7.1 Backoffice Client

```typescript
// apps/backoffice/src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { appAc, appRoles } from "@your-org/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!, // e.g., "https://api.yourplatform.com"
  plugins: [
    adminClient({
      ac: appAc,
      roles: appRoles,
    }),
  ],
});

// Export typed hooks
export const { useSession, signIn, signOut } = authClient;
```

### 7.2 Platform Client

```typescript
// apps/platform/src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { orgAc, orgRoles } from "@your-org/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!, // e.g., "https://api.yourplatform.com"
  plugins: [
    organizationClient({
      ac: orgAc,
      roles: orgRoles,
    }),
  ],
});

// Export typed hooks
export const { useSession, signIn, signOut } = authClient;
```

### 7.3 Combined Client (if single app needs both)

```typescript
// apps/combined/src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { appAc, appRoles, orgAc, orgRoles } from "@your-org/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  plugins: [
    adminClient({
      ac: appAc,
      roles: appRoles,
    }),
    organizationClient({
      ac: orgAc,
      roles: orgRoles,
    }),
  ],
});
```

---

## 8. Server-Side Permission Checks

### 8.1 Checking App-Level Permissions

Use `auth.api.userHasPermission` for global/app-level checks:

```typescript
// Check by userId
const canAccessBackoffice = await auth.api.userHasPermission({
  body: {
    userId: user.id,
    permission: { backoffice: ["access"] },
  },
});

// Check by role directly (without user context)
const adminCanBan = await auth.api.userHasPermission({
  body: {
    role: "admin",
    permission: { user: ["delete"] },
  },
});

// Check multiple permissions at once
const hasFullAccess = await auth.api.userHasPermission({
  body: {
    userId: user.id,
    permission: {
      backoffice: ["access", "analytics"],
      user: ["read"],
    },
  },
});
```

### 8.2 Checking Organization-Level Permissions

Use `auth.api.hasPermission` for org-scoped checks:

```typescript
// Check permission in active organization (from session)
const canPublish = await auth.api.hasPermission({
  headers: request.headers, // Session contains active org
  body: {
    permission: { flow: ["publish"] },
  },
});

// Check multiple permissions
const canManageFlows = await auth.api.hasPermission({
  headers: request.headers,
  body: {
    permission: {
      flow: ["create", "update", "delete"],
    },
  },
});
```

---

## 9. Client-Side Permission Checks

### 9.1 Backoffice (App-Level)

```tsx
// Async check against server (verifies actual user permissions)
const { data: canBan } = await authClient.admin.hasPermission({
  permission: { user: ["delete"] },
});

// Sync check against role definition (no server call)
const adminCanBan = authClient.admin.checkRolePermission({
  role: "admin",
  permission: { user: ["delete"] },
}); // true

const backofficeCanBan = authClient.admin.checkRolePermission({
  role: "backoffice",
  permission: { user: ["delete"] },
}); // false
```

### 9.2 Platform (Organization-Level)

```tsx
// Async check against server (verifies user's role in active org)
const { data: canPublish } = await authClient.organization.hasPermission({
  permission: { flow: ["publish"] },
});

// Sync check against role definition
const editorCanPublish = authClient.organization.checkRolePermission({
  role: "editor",
  permission: { flow: ["publish"] },
}); // false

const adminCanPublish = authClient.organization.checkRolePermission({
  role: "admin",
  permission: { flow: ["publish"] },
}); // true
```

### 9.3 Permission-Based UI Components

```tsx
// components/PermissionGate.tsx

import { authClient } from "@/lib/auth-client";
import { ReactNode, useEffect, useState } from "react";

interface PermissionGateProps {
  permission: Record<string, string[]>;
  children: ReactNode;
  fallback?: ReactNode;
  type: "app" | "org";
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
  type,
}: PermissionGateProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      try {
        if (type === "app") {
          const result = await authClient.admin.hasPermission({ permission });
          setHasPermission(result.data?.success ?? false);
        } else {
          const result = await authClient.organization.hasPermission({ permission });
          setHasPermission(result.data?.success ?? false);
        }
      } catch {
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    }

    checkPermission();
  }, [permission, type]);

  if (loading) return null;
  if (!hasPermission) return <>{fallback}</>;
  return <>{children}</>;
}

// Usage
<PermissionGate type="org" permission={{ flow: ["publish"] }}>
  <PublishButton />
</PermissionGate>

<PermissionGate type="app" permission={{ backoffice: ["access"] }}>
  <BackofficeLink />
</PermissionGate>
```

---

## 10. Key Operations Reference

### 10.1 App-Level Operations (Admin Plugin)

| Operation | Method |
|-----------|--------|
| Set user's app role | `authClient.admin.setRole({ userId, role })` |
| Ban user | `authClient.admin.banUser({ userId, banReason, banExpiresIn })` |
| Unban user | `authClient.admin.unbanUser({ userId })` |
| Impersonate user | `authClient.admin.impersonateUser({ userId })` |
| Stop impersonating | `authClient.admin.stopImpersonating()` |
| List users | `authClient.admin.listUsers({ limit, offset })` |
| Create user | `authClient.admin.createUser({ email, password, name, role })` |
| Delete user | `authClient.admin.removeUser({ userId })` |
| Check permission (client) | `authClient.admin.hasPermission({ permission })` |
| Check permission (server) | `auth.api.userHasPermission({ body: { userId, permission } })` |

### 10.2 Organization-Level Operations (Organization Plugin)

| Operation | Method |
|-----------|--------|
| Create organization | `authClient.organization.create({ name, slug })` |
| Update organization | `authClient.organization.update({ organizationId, data })` |
| Delete organization | `authClient.organization.delete({ organizationId })` |
| Set active organization | `authClient.organization.setActive({ organizationId })` |
| Get active organization | `authClient.organization.getActive()` |
| List user's organizations | `authClient.organization.list()` |
| Invite member | `authClient.organization.inviteMember({ email, role })` |
| Accept invitation | `authClient.organization.acceptInvitation({ invitationId })` |
| Reject invitation | `authClient.organization.rejectInvitation({ invitationId })` |
| Cancel invitation | `authClient.organization.cancelInvitation({ invitationId })` |
| List members | `authClient.organization.listMembers({ organizationId })` |
| Update member role | `authClient.organization.updateMemberRole({ memberId, role })` |
| Remove member | `authClient.organization.removeMember({ memberIdOrEmail })` |
| Leave organization | `authClient.organization.leave({ organizationId })` |
| Check permission (client) | `authClient.organization.hasPermission({ permission })` |
| Check permission (server) | `auth.api.hasPermission({ headers, body: { permission } })` |

---

## 11. Important Considerations

### 11.1 Dual Role System

Users can have **BOTH** an app-level role AND organization memberships:

- A user with app role `admin` can also be an `editor` in Organization A and an `owner` in Organization B
- App-level permissions are checked via `userHasPermission`
- Org-level permissions are checked via `hasPermission` (uses active org from session)

### 11.2 Multiple Roles

Both systems support multiple roles per user (stored as comma-separated strings):

```typescript
// A user can have multiple app roles
await authClient.admin.setRole({ userId, role: "admin,backoffice" });

// A member can have multiple org roles
await authClient.organization.updateMemberRole({ memberId, role: ["admin", "editor"] });
```

### 11.3 Backoffice Access Control

Gate your entire backoffice app at the root layout:

```tsx
// apps/backoffice/src/app/layout.tsx

export default async function BackofficeLayout({ children }) {
  const session = await auth.api.getSession({ headers: headers() });
  
  if (!session) {
    redirect("/login");
  }

  const hasAccess = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: { backoffice: ["access"] },
    },
  });

  if (!hasAccess.success) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
```

### 11.4 Organization Context

Organization permissions are checked against the user's **active organization**:

```typescript
// User must set active org before org-level checks work
await authClient.organization.setActive({ organizationId: "org_123" });

// Now hasPermission checks against org_123
const canEdit = await authClient.organization.hasPermission({
  permission: { flow: ["update"] },
});
```

### 11.5 Dynamic Roles (Optional)

If you need runtime-created roles per organization:

```typescript
// auth.ts
organization({
  ac: orgAc,
  roles: orgRoles,
  dynamicAccessControl: {
    enabled: true,
  },
}),
```

This adds an `organizationRole` table and allows creating custom roles at runtime:

```typescript
await authClient.organization.createRole({
  role: "custom-reviewer",
  permission: {
    flow: ["read"],
    analytics: ["read"],
  },
});
```

### 11.6 Default Role Assignment

- New users get the `defaultRole` from the admin plugin (default: `"user"`)
- Organization creators get the `creatorRole` from the organization plugin (default: `"owner"`)

```typescript
admin({
  defaultRole: "member", // New signups become "member"
}),

organization({
  creatorRole: "owner", // Org creators become "owner"
}),
```

---

## Summary

This two-level RBAC system provides:

1. **App-level control** via the Admin plugin for your internal team (backoffice)
2. **Organization-level control** via the Organization plugin for your customers (platform)

Both systems are independent but can coexist on the same user, giving you fine-grained control over who can do what, where.

SMARTLY USE YOUR TOOLS, AGENTS, AND MCPs - you have a lot of power to use and a lot of information to learn. don't reinvent the wheel.