# TanStack Router File-Based Routing Conventions

This document explains the file and directory naming conventions used by TanStack Router's file-based routing system. Understanding these patterns is essential for navigating and extending the codebase.

## Quick Reference

| Syntax | Name | Purpose | Creates URL Segment? |
|--------|------|---------|---------------------|
| `__root.tsx` | Root Layout | Top-level layout wrapping all routes | No |
| `index.tsx` | Index Route | Default route for a directory | No (uses parent path) |
| `layout.tsx` | Layout Route | Shared layout for sibling routes | No |
| `$param` | Dynamic Segment | URL parameter (e.g., `/users/$userId`) | Yes (dynamic) |
| `_prefix` | Pathless Layout | Layout without URL segment | No |
| `(group)` | Route Group | Logical grouping without URL segment | No |
| `-prefix` | Ignored | Excluded from routing entirely | N/A |
| `$.tsx` | Splat/Catch-all | Matches any remaining path segments | Yes (wildcard) |

---

## Detailed Explanations

### 1. Root Layout (`__root.tsx`)

The root layout is the top-most component in your route tree. Every route in your app is rendered as a child of this component.

```
routes/
└── __root.tsx    # Wraps ALL routes
```

**Use for:**
- Global providers (theme, auth context)
- Persistent UI (global nav, footer)
- Global error boundaries
- HTML `<head>` management

```tsx
// __root.tsx
export const Route = createRootRoute({
  component: () => (
    <div>
      <GlobalNav />
      <Outlet /> {/* Child routes render here */}
    </div>
  ),
})
```

---

### 2. Index Routes (`index.tsx`)

Index routes render when the parent path is matched exactly. They don't add a segment to the URL.

```
routes/
├── users/
│   ├── index.tsx     # Matches /users
│   └── settings.tsx  # Matches /users/settings
```

**URL mappings:**
- `/users` → `users/index.tsx`
- `/users/settings` → `users/settings.tsx`

---

### 3. Layout Routes (`layout.tsx`)

Layout routes wrap sibling routes without adding a URL segment. They're useful for shared UI within a directory.

```
routes/
├── dashboard/
│   ├── layout.tsx    # Wraps all dashboard routes
│   ├── index.tsx     # /dashboard
│   ├── analytics.tsx # /dashboard/analytics
│   └── settings.tsx  # /dashboard/settings
```

```tsx
// dashboard/layout.tsx
export const Route = createFileRoute('/dashboard')({
  component: () => (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <Outlet /> {/* index, analytics, or settings */}
    </div>
  ),
})
```

---

### 4. Dynamic Segments (`$param`)

Prefix a file or folder name with `$` to create a dynamic URL parameter.

```
routes/
├── users/
│   ├── $userId/
│   │   ├── index.tsx    # /users/123
│   │   └── posts.tsx    # /users/123/posts
│   └── index.tsx        # /users
```

**Accessing parameters:**

```tsx
// users/$userId/index.tsx
export const Route = createFileRoute('/users/$userId/')({
  component: () => {
    const { userId } = Route.useParams()
    return <div>User ID: {userId}</div>
  },
})
```

---

### 5. Pathless Layout Routes (`_prefix`)

Underscore-prefixed directories create **layout routes without URL segments**. The layout wraps child routes but doesn't appear in the URL.

```
routes/
├── _authenticated/
│   ├── layout.tsx      # Layout with auth check
│   ├── dashboard.tsx   # /dashboard (NOT /_authenticated/dashboard)
│   └── settings.tsx    # /settings
├── _public/
│   ├── layout.tsx      # Public layout
│   ├── login.tsx       # /login
│   └── register.tsx    # /register
```

**Use for:**
- Auth-protected route groups
- Different layouts for different sections
- Shared data loading/validation

```tsx
// _authenticated/layout.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ),
})
```

---

### 6. Route Groups (`(group)`)

Parentheses create **logical groupings** without affecting the URL. Similar to pathless layouts but primarily for organization.

```
routes/
├── (app)/
│   ├── layout.tsx      # App shell layout
│   ├── flows/
│   │   └── index.tsx   # /flows (NOT /(app)/flows)
│   └── settings.tsx    # /settings
├── (auth)/
│   ├── layout.tsx      # Auth pages layout
│   ├── signin.tsx      # /signin
│   └── signup.tsx      # /signup
├── (marketing)/
│   ├── about.tsx       # /about
│   └── pricing.tsx     # /pricing
```

**Difference from `_pathless`:**
- `(group)` - Primarily organizational, groups related routes
- `_pathless` - Emphasizes the layout/wrapper aspect

Both achieve similar results; use whichever conveys intent better.

---

### 7. Ignored Files/Directories (`-prefix`)

Hyphen-prefixed files and directories are **completely ignored** by the router. They won't generate routes.

```
routes/
├── (app)/
│   ├── flows/
│   │   ├── -components/        # Ignored - colocated components
│   │   │   ├── create-flow.tsx
│   │   │   └── delete-flow.tsx
│   │   ├── -validations/       # Ignored - colocated validations
│   │   │   └── flows-link-options.ts
│   │   ├── -hooks/             # Ignored - colocated hooks
│   │   │   └── use-flow-data.ts
│   │   └── index.tsx           # /flows route
├── -components/                # Global ignored components
│   └── layout/
│       └── navbar.tsx
```

**Use for:**
- Colocating components with routes
- Route-specific utilities, hooks, validations
- Test files
- Any non-route code you want near routes

---

### 8. Splat/Catch-all Routes (`$.tsx` or `$`)

A single `$` matches any remaining path segments. Useful for 404 pages or dynamic nested paths.

```
routes/
├── docs/
│   └── $.tsx           # /docs/*, /docs/foo/bar/baz
├── $.tsx               # Catch-all 404 for unmatched routes
```

```tsx
// docs/$.tsx
export const Route = createFileRoute('/docs/$')({
  component: () => {
    const { _splat } = Route.useParams()
    // _splat = "foo/bar/baz" for /docs/foo/bar/baz
    return <DocPage path={_splat} />
  },
})
```

---

## Project Structure Example

Here's how these conventions work together in a real app:

```
routes/
├── __root.tsx                    # Global layout, providers
├── index.tsx                     # / (home page)
├── -components/                  # Shared components (ignored)
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── sidebar.tsx
│   └── common/
│       └── spinner.tsx
│
├── (auth)/                       # Auth route group
│   ├── layout.tsx               # Auth pages layout (centered card)
│   ├── -components/             # Auth-specific components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── signin.tsx               # /signin
│   └── signup.tsx               # /signup
│
├── (app)/                        # Main app route group
│   ├── layout.tsx               # App shell (nav, sidebar)
│   ├── onboarding.tsx           # /onboarding
│   │
│   ├── organizations/
│   │   ├── index.tsx            # /organizations
│   │   └── create.tsx           # /organizations/create
│   │
│   └── flows/
│       ├── -components/         # Flow-specific components
│       │   ├── create-flow.tsx
│       │   └── delete-flow.tsx
│       ├── -validations/        # Flow-specific validations
│       │   └── flows-link-options.ts
│       ├── index.tsx            # /flows
│       └── $flowid/
│           └── index.tsx        # /flows/abc123
│
└── $.tsx                         # 404 catch-all
```

**Resulting URLs:**
| File | URL |
|------|-----|
| `index.tsx` | `/` |
| `(auth)/signin.tsx` | `/signin` |
| `(auth)/signup.tsx` | `/signup` |
| `(app)/onboarding.tsx` | `/onboarding` |
| `(app)/organizations/index.tsx` | `/organizations` |
| `(app)/organizations/create.tsx` | `/organizations/create` |
| `(app)/flows/index.tsx` | `/flows` |
| `(app)/flows/$flowid/index.tsx` | `/flows/:flowid` |

---

## Common Patterns

### Protected Routes Pattern

```
routes/
├── (public)/
│   ├── layout.tsx        # No auth required
│   ├── login.tsx
│   └── about.tsx
├── (protected)/
│   ├── layout.tsx        # Auth check in beforeLoad
│   ├── dashboard.tsx
│   └── settings.tsx
```

### Feature-Based Colocation

```
routes/
└── (app)/
    └── invoices/
        ├── -components/
        │   ├── invoice-table.tsx
        │   ├── invoice-form.tsx
        │   └── invoice-pdf.tsx
        ├── -hooks/
        │   └── use-invoice.ts
        ├── -utils/
        │   └── invoice-calculations.ts
        ├── index.tsx           # /invoices (list)
        ├── create.tsx          # /invoices/create
        └── $invoiceId/
            ├── index.tsx       # /invoices/:id (detail)
            └── edit.tsx        # /invoices/:id/edit
```

---

## Summary

| When you want to... | Use |
|---------------------|-----|
| Create the app-wide wrapper | `__root.tsx` |
| Handle the "default" page of a folder | `index.tsx` |
| Share layout among sibling routes | `layout.tsx` |
| Capture a URL parameter | `$paramName` |
| Group routes under a shared layout WITHOUT changing URL | `_layoutName/` or `(groupName)/` |
| Colocate non-route files with routes | `-folderName/` |
| Catch all remaining URL segments | `$.tsx` |
