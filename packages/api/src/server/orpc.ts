import { implement, os } from '@orpc/server';
import type { AuthInstance } from '@repo/auth/server';
import type { DatabaseInstance } from '@repo/db/client';
import { appContract } from '../contracts';
import {
  checkAppPermission,
  checkOrgPermission,
  type Permission,
} from './middleware/rbac';

/**
 * ORPC Context including auth instance and headers for permission checks
 */
export const createORPCContext = async ({
  auth,
  db,
  headers,
}: {
  auth: AuthInstance;
  db: DatabaseInstance;
  headers: Headers;
}): Promise<{
  db: DatabaseInstance;
  auth: AuthInstance;
  headers: Headers;
  session: AuthInstance['$Infer']['Session'] | null;
}> => {
  const session = await auth.api.getSession({
    headers,
  });
  return {
    db,
    auth,
    headers,
    session,
  };
};

const timingMiddleware = os.middleware(async ({ next, path }) => {
  const start = Date.now();
  let waitMsDisplay = '';
  if (process.env.NODE_ENV !== 'production') {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    waitMsDisplay = ` (artificial delay: ${waitMs}ms)`;
  }
  const result = await next();
  const end = Date.now();

  console.log(
    `\t[RPC] /${path.join('/')} executed after ${end - start}ms${waitMsDisplay}`,
  );
  return result;
});

const base = implement(appContract);

export const publicProcedure = base
  .$context<Awaited<ReturnType<typeof createORPCContext>>>()
  .use(timingMiddleware);

export const protectedProcedure = publicProcedure.use(
  ({ context, next, errors }) => {
    if (!context.session?.user) {
      throw errors.UNAUTHORIZED({
        message: 'Missing user session. Please log in!',
      });
    }
    return next({
      context: {
        session: { ...context.session },
      },
    });
  },
);

/**
 * Factory to create a procedure that requires app-level permission (backoffice)
 * Uses Better Auth's admin plugin for global/app-level permission checks
 *
 * @param permission - The required permission (e.g., { backoffice: ['access'] })
 * @returns A procedure that checks the permission before executing
 *
 * @example
 * const analyticsRoute = createAppPermissionProcedure({ backoffice: ['analytics'] })
 *   .handler(async ({ context }) => { ... });
 */
export const createAppPermissionProcedure = (permission: Permission) =>
  protectedProcedure.use(async ({ context, next, errors }) => {
    const hasPermission = await checkAppPermission(
      context.auth,
      context.session.user.id,
      permission,
    );

    if (!hasPermission) {
      throw errors.FORBIDDEN({
        message: `Missing required permission: ${JSON.stringify(permission)}`,
      });
    }

    return next({ context });
  });

/**
 * Factory to create a procedure that requires organization-level permission (platform)
 * Uses Better Auth's organization plugin for org-scoped permission checks
 *
 * @param permission - The required permission (e.g., { flow: ['create'] })
 * @returns A procedure that checks the permission in the user's active organization
 *
 * @example
 * const createFlowRoute = createOrgPermissionProcedure({ flow: ['create'] })
 *   .handler(async ({ context, input }) => { ... });
 */
export const createOrgPermissionProcedure = (permission: Permission) =>
  protectedProcedure.use(async ({ context, next, errors }) => {
    const hasPermission = await checkOrgPermission(
      context.auth,
      context.headers,
      permission,
    );

    if (!hasPermission) {
      throw errors.FORBIDDEN({
        message: `Missing required permission: ${JSON.stringify(permission)}`,
      });
    }

    return next({ context });
  });

/**
 * Procedure that requires backoffice access
 * Shorthand for createAppPermissionProcedure({ backoffice: ['access'] })
 */
export const backofficeProcedure = createAppPermissionProcedure({
  backoffice: ['access'],
});

/**
 * Procedure that requires admin role
 * Checks user.role directly for 'admin' value
 */
export const adminProcedure = protectedProcedure.use(
  ({ context, next, errors }) => {
    if (context.session.user.role !== 'admin') {
      throw errors.FORBIDDEN({
        message: 'Admin role required',
      });
    }
    return next({ context });
  },
);
