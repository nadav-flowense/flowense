import type * as React from 'react';

export interface PermissionGateProps {
  /**
   * Whether the user has the required permission
   */
  hasPermission: boolean;
  /**
   * Whether the permission check is still loading
   */
  isLoading?: boolean;
  /**
   * Content to render when permission is granted
   */
  children: React.ReactNode;
  /**
   * Content to render when permission is denied (default: null)
   */
  fallback?: React.ReactNode;
  /**
   * Content to render while loading (default: null)
   */
  loadingFallback?: React.ReactNode;
}

/**
 * PermissionGate - Conditional rendering based on permission state
 *
 * This is a "dumb" component that receives permission state from the parent.
 * The parent is responsible for checking permissions via hooks/queries.
 *
 * @example
 * ```tsx
 * // In backoffice (app-level permissions)
 * const { data: canAccess, isLoading } = useQuery(
 *   permissionQueryOptions.appPermission({ backoffice: ['analytics'] })
 * );
 *
 * <PermissionGate hasPermission={canAccess ?? false} isLoading={isLoading}>
 *   <AnalyticsDashboard />
 * </PermissionGate>
 * ```
 *
 * @example
 * ```tsx
 * // In platform (org-level permissions)
 * const { data: canCreate, isLoading } = useQuery(
 *   permissionQueryOptions.orgPermission({ flow: ['create'] })
 * );
 *
 * <PermissionGate
 *   hasPermission={canCreate ?? false}
 *   isLoading={isLoading}
 *   fallback={<p>You don't have permission to create flows</p>}
 * >
 *   <CreateFlowButton />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  hasPermission,
  isLoading = false,
  children,
  fallback = null,
  loadingFallback = null,
}: PermissionGateProps) {
  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
