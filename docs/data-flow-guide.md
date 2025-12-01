# Data Flow Guide: Drizzle → oRPC → TanStack Query

This document explains how RT-Stack implements type-safe data flow from database schema to client queries, with Better Auth integration throughout the process.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (React)                                  │
│  ┌─────────────────┐    ┌──────────────────┐    ┌───────────────────────┐  │
│  │  TanStack Query │ ←→ │   oRPC Client    │ ←→ │   Better Auth Client  │  │
│  │  (Cache/State)  │    │  (Type-safe RPC) │    │   (Session/Auth)      │  │
│  └─────────────────┘    └──────────────────┘    └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                              HTTP (fetch)
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVER (Hono)                                   │
│  ┌─────────────────┐    ┌──────────────────┐    ┌───────────────────────┐  │
│  │   oRPC Server   │ ←→ │   Middleware     │ ←→ │   Better Auth Server  │  │
│  │   (Handlers)    │    │   (Auth Check)   │    │   (Session Extract)   │  │
│  └─────────────────┘    └──────────────────┘    └───────────────────────┘  │
│           │                                                                  │
│           ↓                                                                  │
│  ┌─────────────────┐    ┌──────────────────┐                               │
│  │   Drizzle ORM   │ ←→ │   PostgreSQL     │                               │
│  │   (Queries)     │    │   (Database)     │                               │
│  └─────────────────┘    └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| Database | **Drizzle ORM** | Type-safe schema & queries |
| Validation | **Valibot** | Runtime validation (shared client/server) |
| API Contract | **oRPC** | Type-safe API definitions |
| Server | **Hono** | Lightweight HTTP framework |
| Auth | **Better Auth** | Authentication & sessions |
| Client State | **TanStack Query** | Server state management & caching |
| Routing | **TanStack Router** | File-based routing with loaders |

---

## Step-by-Step: Adding a New Feature

Let's walk through adding a new "Tasks" feature to demonstrate the complete flow.

### Step 1: Define the Database Schema

Create or update the schema in `packages/db/src/schemas/`:

```typescript
// packages/db/src/schemas/tasks.ts
import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { user } from './auth';

// 1. Define the Drizzle table
export const task = pgTable('task', (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  completed: t.boolean().notNull().default(false),
  createdAt: t.timestamp({ mode: 'string', withTimezone: true }).notNull().defaultNow(),
  createdBy: t.text().references(() => user.id).notNull(),
}));

// 2. Create Valibot schemas for validation (shared with client!)
export const CreateTaskSchema = v.omit(
  createInsertSchema(task, {
    title: v.pipe(v.string(), v.minLength(1), v.maxLength(256)),
    description: v.optional(v.pipe(v.string(), v.maxLength(1000))),
  }),
  ['id', 'createdAt', 'createdBy', 'completed'],
);

export const UpdateTaskSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  title: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(256))),
  description: v.optional(v.pipe(v.string(), v.maxLength(1000))),
  completed: v.optional(v.boolean()),
});
```

Export from the schema index:

```typescript
// packages/db/src/schemas/index.ts
export * from './auth';
export * from './flows';
export * from './tasks';  // Add this
```

And from the main schema export:

```typescript
// packages/db/src/schema.ts
export * from './schemas/auth';
export * from './schemas/flows';
export * from './schemas/tasks';  // Add this
```

### Step 2: Run Database Migration

```bash
# Generate migration
pnpm db:generate

# Apply migration
pnpm db:migrate
```

### Step 3: Define the API Contract

Create a contract file in `packages/api/src/contracts/`:

```typescript
// packages/api/src/contracts/tasks.ts
import { oc } from '@orpc/contract';
import { CreateTaskSchema, UpdateTaskSchema } from '@repo/db/schema';
import * as v from 'valibot';

const taskContract = oc
  .prefix('/tasks')
  .tag('task')
  .errors({
    TASK_NOT_FOUND: {
      status: 404,
      data: v.object({ taskId: v.string() }),
    },
  })
  .router({
    // GET /api/tasks - List all tasks for current user
    all: oc
      .route({ method: 'GET', path: '/', summary: 'List all tasks' })
      .output(
        v.array(
          v.object({
            id: v.string(),
            title: v.string(),
            completed: v.boolean(),
            createdAt: v.string(),
          }),
        ),
      ),

    // GET /api/tasks/{id} - Get single task
    one: oc
      .route({ method: 'GET', path: '/{id}', summary: 'Get a task' })
      .input(v.object({ id: v.pipe(v.string(), v.uuid()) }))
      .output(
        v.object({
          id: v.string(),
          title: v.string(),
          description: v.nullable(v.string()),
          completed: v.boolean(),
          createdAt: v.string(),
        }),
      ),

    // POST /api/tasks - Create task
    create: oc
      .route({ method: 'POST', path: '/', summary: 'Create a task' })
      .input(CreateTaskSchema)
      .output(v.object({ id: v.string() })),

    // PATCH /api/tasks/{id} - Update task
    update: oc
      .route({ method: 'PATCH', path: '/{id}', summary: 'Update a task' })
      .input(UpdateTaskSchema)
      .output(v.object({})),

    // DELETE /api/tasks/{id} - Delete task
    delete: oc
      .route({ method: 'DELETE', path: '/{id}', summary: 'Delete a task' })
      .input(v.object({ id: v.pipe(v.string(), v.uuid()) }))
      .output(v.object({})),
  });

export default taskContract;
```

Add to the main contract:

```typescript
// packages/api/src/contracts/index.ts
import { oc } from '@orpc/contract';
import flowContract from './flows';
import diagramContract from './diagrams';
import taskContract from './tasks';  // Add this

export const appContract = oc.router({
  flows: flowContract,
  diagrams: diagramContract,
  tasks: taskContract,  // Add this
});
```

### Step 4: Implement the Server Handlers

Create the router implementation:

```typescript
// packages/api/src/server/router/tasks.ts
import { desc, eq, and } from '@repo/db';
import { task } from '@repo/db/schema';
import { protectedProcedure } from '../orpc';

const tasksRouter = {
  // List all tasks for current user
  all: protectedProcedure.tasks.all.handler(({ context }) => {
    return context.db.query.task.findMany({
      columns: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
      },
      where: eq(task.createdBy, context.session.user.id),
      orderBy: desc(task.createdAt),
    });
  }),

  // Get single task
  one: protectedProcedure.tasks.one.handler(
    async ({ context, input, errors }) => {
      const [dbTask] = await context.db
        .select()
        .from(task)
        .where(
          and(
            eq(task.id, input.id),
            eq(task.createdBy, context.session.user.id),
          ),
        );

      if (!dbTask) {
        throw errors.TASK_NOT_FOUND({
          message: `Task not found: ${input.id}`,
          data: { taskId: input.id },
        });
      }

      return dbTask;
    },
  ),

  // Create task
  create: protectedProcedure.tasks.create.handler(
    async ({ context, input }) => {
      const [created] = await context.db
        .insert(task)
        .values({
          createdBy: context.session.user.id,
          ...input,
        })
        .returning({ id: task.id });

      return { id: created.id };
    },
  ),

  // Update task
  update: protectedProcedure.tasks.update.handler(
    async ({ context, input, errors }) => {
      const { id, ...updates } = input;

      const result = await context.db
        .update(task)
        .set(updates)
        .where(
          and(eq(task.id, id), eq(task.createdBy, context.session.user.id)),
        );

      if (result.rowCount === 0) {
        throw errors.TASK_NOT_FOUND({
          message: `Task not found: ${id}`,
          data: { taskId: id },
        });
      }

      return {};
    },
  ),

  // Delete task
  delete: protectedProcedure.tasks.delete.handler(
    async ({ context, input, errors }) => {
      const result = await context.db
        .delete(task)
        .where(
          and(
            eq(task.id, input.id),
            eq(task.createdBy, context.session.user.id),
          ),
        );

      if (result.rowCount === 0) {
        throw errors.TASK_NOT_FOUND({
          message: `Task not found: ${input.id}`,
          data: { taskId: input.id },
        });
      }

      return {};
    },
  ),
};

export default tasksRouter;
```

Add to the app router:

```typescript
// packages/api/src/server/router/index.ts
import diagramsRouter from './diagrams';
import flowRouter from './flow';
import tasksRouter from './tasks';  // Add this

export const appRouter = {
  diagrams: diagramsRouter,
  flows: flowRouter,
  tasks: tasksRouter,  // Add this
};
```

### Step 5: Use in Frontend Routes

Now you can use the API client in your routes:

```typescript
// apps/frontend/platform/src/routes/(app)/tasks/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/clients/apiClient';
import { queryClient } from '@/clients/queryClient';

export const Route = createFileRoute('/(app)/tasks/')({
  // Prefetch data on route load
  loader: () => queryClient.ensureQueryData(apiClient.tasks.all.queryOptions()),
  component: TasksPage,
});

function TasksPage() {
  // Access cached data from loader
  const { data: tasks, isPending } = useQuery(
    apiClient.tasks.all.queryOptions(),
  );

  // Mutation for toggling completion
  const updateMutation = useMutation(apiClient.tasks.update.mutationOptions());

  const handleToggle = async (id: string, completed: boolean) => {
    await updateMutation.mutateAsync(
      { id, completed: !completed },
      {
        onSuccess: () => {
          // Refetch the list after update
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
      },
    );
  };

  return (
    <div>
      <h1>Tasks</h1>
      {tasks?.map((task) => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggle(task.id, task.completed)}
            disabled={updateMutation.isPending}
          />
          <span>{task.title}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## Understanding the Existing Flows Example

The `flows` feature demonstrates all these patterns. Here's how the pieces connect:

### Schema (`packages/db/src/schemas/flows.ts`)

```typescript
export const flow = pgTable('flow', (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp({ mode: 'string', withTimezone: true }).notNull().defaultNow(),
  createdBy: t.text().references(() => user.id).notNull(),
}));

// Validation schema - used by both client forms AND server handlers
export const CreateFlowSchema = v.omit(
  createInsertSchema(flow, {
    title: v.pipe(v.string(), v.minLength(3), v.maxLength(256)),
    content: v.pipe(v.string(), v.minLength(5), v.maxLength(512)),
  }),
  ['id', 'createdAt', 'createdBy'],
);
```

### Contract (`packages/api/src/contracts/flows.ts`)

```typescript
const flowContract = oc
  .prefix('/flows')
  .tag('flow')
  .router({
    all: oc.route({ method: 'GET', path: '/' }).output(v.array(...)),
    one: oc.route({ method: 'GET', path: '/{id}' }).input(...).output(...),
    create: oc.route({ method: 'POST', path: '/' }).input(CreateFlowSchema).output(...),
    delete: oc.route({ method: 'DELETE', path: '/{id}' }).input(...).output(...),
  });
```

### Handler (`packages/api/src/server/router/flow.ts`)

```typescript
const flowRouter = {
  all: protectedProcedure.flows.all.handler(({ context }) => {
    return context.db.query.flow.findMany({...});
  }),
  create: protectedProcedure.flows.create.handler(async ({ context, input }) => {
    await context.db.insert(flow).values({
      createdBy: context.session.user.id,  // Auth integration!
      ...input,
    });
    return {};
  }),
};
```

### Client Usage (`apps/frontend/platform/src/routes/(app)/flows/index.tsx`)

```typescript
export const Route = createFileRoute('/(app)/flows/')({
  loader: () => queryClient.ensureQueryData(apiClient.flows.all.queryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: flows } = useQuery(apiClient.flows.all.queryOptions());
  // ...render flows
}
```

---

## Authentication Flow

Better Auth is integrated at every layer:

### 1. Server Setup (`packages/auth/src/server.ts`)

```typescript
export const createAuth = ({ db, ... }) => {
  return betterAuth({
    database: drizzleAdapter(db, { provider: 'pg' }),
    plugins: [organization(), admin()],
    // ...
  });
};
```

### 2. Session Extraction (`packages/api/src/server/orpc.ts`)

```typescript
export const createORPCContext = async ({ auth, db, headers }) => {
  // Extract session from request headers (cookies)
  const session = await auth.api.getSession({ headers });
  return { db, session };
};
```

### 3. Protected Procedures

```typescript
// Public - no auth required
export const publicProcedure = base.$context<...>().use(timingMiddleware);

// Protected - requires valid session
export const protectedProcedure = publicProcedure.use(
  ({ context, next, errors }) => {
    if (!context.session?.user) {
      throw errors.UNAUTHORIZED({ message: 'Please log in!' });
    }
    return next({ context: { session: context.session } });
  },
);
```

### 4. Client Auth Queries (`packages/auth/src/client-query.ts`)

```typescript
export const createAuthQueryOptions = (authClient) => () =>
  queryOptions({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
```

### 5. Route-Level Auth Check (`apps/frontend/platform/src/routes/__root.tsx`)

```typescript
export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context }) => {
    context.queryClient.prefetchQuery(authQueryOptions());
  },
  component: RootComponent,
});

function RootComponent() {
  const { data: session } = useSuspenseQuery(authQueryOptions());
  // Show different UI based on auth state
}
```

---

## File Reference

| Purpose | Location |
|---------|----------|
| **Database Schemas** | `packages/db/src/schemas/*.ts` |
| **Schema Exports** | `packages/db/src/schema.ts` |
| **DB Client** | `packages/db/src/client.ts` |
| **API Contracts** | `packages/api/src/contracts/*.ts` |
| **Server Handlers** | `packages/api/src/server/router/*.ts` |
| **oRPC Setup** | `packages/api/src/server/orpc.ts` |
| **API Client Factory** | `packages/api/src/client/index.ts` |
| **Auth Server** | `packages/auth/src/server.ts` |
| **Auth Client** | `packages/auth/src/client.ts` |
| **Auth Queries** | `packages/auth/src/client-query.ts` |
| **Frontend Routes** | `apps/frontend/platform/src/routes/**/*.tsx` |
| **API Client Instance** | `apps/frontend/platform/src/clients/apiClient.ts` |
| **Query Client** | `apps/frontend/platform/src/clients/queryClient.ts` |

---

## Quick Checklist for New Features

- [ ] Define Drizzle table in `packages/db/src/schemas/`
- [ ] Create Valibot validation schemas (shared!)
- [ ] Export from `packages/db/src/schema.ts`
- [ ] Run `pnpm db:generate` and `pnpm db:migrate`
- [ ] Define oRPC contract in `packages/api/src/contracts/`
- [ ] Add to main contract in `packages/api/src/contracts/index.ts`
- [ ] Implement handlers in `packages/api/src/server/router/`
- [ ] Add to app router in `packages/api/src/server/router/index.ts`
- [ ] Use `protectedProcedure` for auth-required endpoints
- [ ] Use `publicProcedure` for public endpoints
- [ ] Create route files in `apps/frontend/platform/src/routes/`
- [ ] Use `apiClient.{resource}.{method}.queryOptions()` for queries
- [ ] Use `apiClient.{resource}.{method}.mutationOptions()` for mutations

---

## Tips

1. **Validation schemas are shared**: Define once in `@repo/db/schema`, use in both contract and client forms.

2. **Use loaders for critical data**: `ensureQueryData` in route loaders prevents waterfall requests.

3. **Access user ID from context**: In handlers, use `context.session.user.id` for the authenticated user.

4. **Invalidate queries after mutations**: Call `queryClient.invalidateQueries()` to refetch related data.

5. **Type inference is automatic**: The oRPC client infers all types from your contract definitions.
