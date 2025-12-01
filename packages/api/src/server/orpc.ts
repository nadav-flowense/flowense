import { implement, os } from '@orpc/server';
import type { AuthInstance } from '@repo/auth/server';
import type { DatabaseInstance } from '@repo/db/client';
import { appContract } from '../contracts';
import {
  hasBackofficeAccess,
  isAdmin,
  type AppRole,
  type Permission,
} from './middleware/rbac';

/**
 * Extended user type with role from admin plugin
 */
type UserWithRole = {
  id: string;
  name: string;
  email: string;
  role?: AppRole;
  [key: string]: unknown;
};

/**
 * Extended session type with role-aware user
 */
type SessionWithRole = {
  session: {
    id: string;
    userId: string;
    [key: string]: unknown;
  };
  user: UserWithRole;
};

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
  session: SessionWithRole | null;
}> => {
  const session = await auth.api.getSession({
    headers,
  });
  return {
    db,
    auth,
    headers,
    session: session as SessionWithRole | null,
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
 * Procedure that requires backoffice access
 * Checks user.role for 'admin' or 'backoffice' values
 */
export const backofficeProcedure = protectedProcedure.use(
  ({ context, next, errors }) => {
    if (!hasBackofficeAccess(context.session.user.role)) {
      throw errors.FORBIDDEN({
        message: 'Backoffice access required',
      });
    }
    return next({ context });
  },
);

/**
 * Procedure that requires admin role
 * Checks user.role directly for 'admin' value
 */
export const adminProcedure = protectedProcedure.use(
  ({ context, next, errors }) => {
    if (!isAdmin(context.session.user.role)) {
      throw errors.FORBIDDEN({
        message: 'Admin role required',
      });
    }
    return next({ context });
  },
);

/**
 * Factory to create a procedure that requires organization-level permission (platform)
 *
 * Note: This is a placeholder that currently just requires authentication.
 * Organization-level permissions will be checked by Better Auth's organization plugin
 * at runtime based on the user's active organization membership and role.
 *
 * @param _permission - The required permission (e.g., { flow: ['create'] })
 * @returns A procedure that requires authentication (permission check happens at runtime)
 *
 * @example
 * const createFlowRoute = createOrgPermissionProcedure({ flow: ['create'] })
 *   .handler(async ({ context, input }) => { ... });
 */
export const createOrgPermissionProcedure = (_permission: Permission) =>
  protectedProcedure;
