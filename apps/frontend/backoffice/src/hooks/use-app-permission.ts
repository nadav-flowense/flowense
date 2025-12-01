import type { Permission } from '@repo/ui/hooks/use-permission';
import { useQueries, useQuery } from '@tanstack/react-query';
import { permissionQueryOptions } from '@/clients/authClient';

/**
 * Hook to check app-level permissions in the backoffice
 * Uses Better Auth's admin plugin for permission checks
 *
 * @param permission - The permission to check (e.g., { backoffice: ['access'] })
 * @returns Object with hasPermission, isLoading, and error
 *
 * @example
 * const { hasPermission, isLoading } = useAppPermission({ backoffice: ['analytics'] });
 *
 * if (isLoading) return <Spinner />;
 * if (!hasPermission) return <AccessDenied />;
 */
export function useAppPermission(permission: Permission) {
  const { data, isLoading, error } = useQuery(
    permissionQueryOptions.appPermission(permission),
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
 * const results = useAppPermissions({
 *   canAccess: { backoffice: ['access'] },
 *   canViewAnalytics: { backoffice: ['analytics'] },
 * });
 *
 * if (results.canAccess.hasPermission) { ... }
 */
export function useAppPermissions<T extends Record<string, Permission>>(
  permissions: T,
): Record<keyof T, { hasPermission: boolean; isLoading: boolean }> {
  const entries = Object.entries(permissions);

  const queries = useQueries({
    queries: entries.map(([, permission]) =>
      permissionQueryOptions.appPermission(permission),
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
