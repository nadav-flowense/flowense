import type { Subscription } from '@repo/db/schema';
import { queryOptions } from '@tanstack/react-query';
import { type AuthClient, type AuthClientOptions, createAuthClient } from './client';

// Re-export types
export type { AuthClient } from './client';
export type { Subscription } from '@repo/db/schema';

export type AuthSession = AuthClient['$Infer']['Session'] | null;

export type Organization = NonNullable<
  Awaited<ReturnType<AuthClient['organization']['list']>>['data']
>[number];

export type FullOrganization = NonNullable<
  Awaited<ReturnType<AuthClient['organization']['getFullOrganization']>>['data']
>;

/**
 * Permission type for permission checks
 * Maps resource names to arrays of allowed actions
 */
export type Permission = Record<string, string[]>;

export const createAuthQueryOptions = (authClient: AuthClient) => () =>
  queryOptions({
    queryKey: ['auth', 'session'],
    queryFn: async (): Promise<AuthSession> => {
      const { data, error } = await authClient.getSession();
      if (error) {
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const createOrganizationQueryOptions = (authClient: AuthClient) => ({
  list: () =>
    queryOptions({
      queryKey: ['organizations', 'list'],
      queryFn: async (): Promise<Organization[]> => {
        const { data, error } = await authClient.organization.list();
        if (error) {
          throw error;
        }
        return data ?? [];
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),

  active: (organizationId: string | null | undefined) =>
    queryOptions({
      queryKey: ['organization', 'active', organizationId],
      queryFn: async (): Promise<FullOrganization | null> => {
        if (!organizationId) return null;
        const { data, error } =
          await authClient.organization.getFullOrganization();
        if (error) {
          throw error;
        }
        return data ?? null;
      },
      enabled: !!organizationId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
});

/**
 * Permission query options for checking user permissions
 * Provides both app-level (admin plugin) and org-level (organization plugin) checks
 */
export const createPermissionQueryOptions = (authClient: AuthClient) => ({
  /**
   * Check app-level permission (backoffice/admin)
   * Uses Better Auth's admin plugin hasPermission
   *
   * @param permission - The permission to check (e.g., { backoffice: ['access'] })
   * @returns Query options that resolve to boolean
   *
   * @example
   * const { data: canAccess } = useQuery(
   *   permissionQueryOptions.appPermission({ backoffice: ['access'] })
   * );
   */
  appPermission: (permission: Permission) =>
    queryOptions({
      queryKey: ['permissions', 'app', permission],
      queryFn: async (): Promise<boolean> => {
        try {
          const { data } = await authClient.admin.hasPermission({ permission });
          return data?.success ?? false;
        } catch {
          return false;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),

  /**
   * Check organization-level permission (platform)
   * Uses Better Auth's organization plugin hasPermission
   * Checks against the user's active organization
   *
   * @param permission - The permission to check (e.g., { flow: ['create'] })
   * @returns Query options that resolve to boolean
   *
   * @example
   * const { data: canCreate } = useQuery(
   *   permissionQueryOptions.orgPermission({ flow: ['create'] })
   * );
   */
  orgPermission: (permission: Permission) =>
    queryOptions({
      queryKey: ['permissions', 'org', permission],
      queryFn: async (): Promise<boolean> => {
        try {
          const { data } = await authClient.organization.hasPermission({
            permission,
          });
          return data?.success ?? false;
        } catch {
          return false;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
});

/**
 * Subscription query options for Stripe subscription management
 * Only available when Stripe is enabled in the client
 */
export const createSubscriptionQueryOptions = (authClient: AuthClient) => ({
  /**
   * List all subscriptions for a reference (user or organization)
   *
   * @param referenceId - Optional reference ID (defaults to current user)
   * @returns Query options that resolve to array of subscriptions
   */
  list: (referenceId?: string) =>
    queryOptions({
      queryKey: ['subscriptions', 'list', referenceId],
      queryFn: async (): Promise<Subscription[]> => {
        try {
          const { data, error } = await authClient.subscription.list({
            query: referenceId ? { referenceId } : undefined,
          });
          if (error) throw error;
          return (data ?? []) as Subscription[];
        } catch {
          return [];
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),

  /**
   * Get the active subscription for a reference
   *
   * @param referenceId - Optional reference ID (defaults to current user)
   * @returns Query options that resolve to the active subscription or null
   */
  active: (referenceId?: string) =>
    queryOptions({
      queryKey: ['subscriptions', 'active', referenceId],
      queryFn: async (): Promise<Subscription | null> => {
        try {
          const { data, error } = await authClient.subscription.list({
            query: referenceId ? { referenceId } : undefined,
          });
          if (error) throw error;
          const subscriptions = (data ?? []) as Subscription[];
          return (
            subscriptions.find(
              (sub) => sub.status === 'active' || sub.status === 'trialing',
            ) ?? null
          );
        } catch {
          return null;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
});

/**
 * Return type for createAuthIntegration
 * Explicit type declaration to avoid TypeScript portability issues
 */
export interface AuthIntegration {
  authClient: AuthClient;
  authQueryOptions: ReturnType<typeof createAuthQueryOptions>;
  organizationQueryOptions: ReturnType<typeof createOrganizationQueryOptions>;
  permissionQueryOptions: ReturnType<typeof createPermissionQueryOptions>;
  subscriptionQueryOptions: ReturnType<typeof createSubscriptionQueryOptions>;
}

export const createAuthIntegration = (options: AuthClientOptions): AuthIntegration => {
  const authClient = createAuthClient(options);
  const authQueryOptions = createAuthQueryOptions(authClient);
  const organizationQueryOptions = createOrganizationQueryOptions(authClient);
  const permissionQueryOptions = createPermissionQueryOptions(authClient);
  const subscriptionQueryOptions = createSubscriptionQueryOptions(authClient);

  return {
    authClient,
    authQueryOptions,
    organizationQueryOptions,
    permissionQueryOptions,
    subscriptionQueryOptions,
  };
};
