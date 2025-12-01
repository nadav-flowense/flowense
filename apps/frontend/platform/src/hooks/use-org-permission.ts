import type { Permission } from '@repo/ui/hooks/use-permission';
import { useQueries, useQuery } from '@tanstack/react-query';
import { permissionQueryOptions } from '@/clients/authClient';

/**
 * Hook to check organization-level permissions in the platform
 * Uses Better Auth's organization plugin for permission checks
 * Checks against the user's currently active organization
 *
 * @param permission - The permission to check (e.g., { flow: ['create'] })
 * @returns Object with hasPermission, isLoading, and error
 *
 * @example
 * const { hasPermission, isLoading } = useOrgPermission({ flow: ['create'] });
 *
 * if (isLoading) return <Spinner />;
 * if (!hasPermission) return <AccessDenied />;
 */
export function useOrgPermission(permission: Permission) {
  const { data, isLoading, error } = useQuery(
    permissionQueryOptions.orgPermission(permission),
  );

  return {
    hasPermission: data ?? false,
    isLoading,
    error: error ?? null,
  };
}

/**
 * Hook to check multiple permissions at once
 * Returns an object mapping permission keys to their results
 *
 * @param permissions - Object mapping keys to Permission objects
 * @returns Object with results for each permission key
 *
 * @example
 * const results = useOrgPermissions({
 *   canCreate: { flow: ['create'] },
 *   canDelete: { flow: ['delete'] },
 * });
 *
 * if (results.canCreate.hasPermission) { ... }
 */
export function useOrgPermissions<T extends Record<string, Permission>>(
  permissions: T,
): Record<keyof T, { hasPermission: boolean; isLoading: boolean }> {
  const entries = Object.entries(permissions);

  const queries = useQueries({
    queries: entries.map(([, permission]) =>
      permissionQueryOptions.orgPermission(permission),
    ),
  });

  const results = {} as Record<
    keyof T,
    { hasPermission: boolean; isLoading: boolean }
  >;

  entries.forEach(([key], index) => {
    const query = queries[index];
    results[key as keyof T] = {
      hasPermission: query?.data ?? false,
      isLoading: query?.isLoading ?? true,
    };
  });

  return results;
}
