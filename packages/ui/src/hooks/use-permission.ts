/**
 * Permission types for use with permission hooks
 *
 * This file provides type definitions that apps can use when implementing
 * their own permission hooks. The actual hooks are implemented in each app
 * since they need access to app-specific authClient instances.
 */

/**
 * Permission definition type
 * Maps resource names to arrays of allowed actions
 *
 * @example
 * // App-level permission (backoffice)
 * { backoffice: ['access', 'analytics'] }
 *
 * @example
 * // Org-level permission (platform)
 * { flow: ['create', 'read'] }
 */
export type Permission = Record<string, string[]>;

/**
 * Result type for permission checks
 */
export interface PermissionCheckResult {
  /**
   * Whether the user has the required permission
   */
  hasPermission: boolean;
  /**
   * Whether the permission check is still loading
   */
  isLoading: boolean;
  /**
   * Any error that occurred during the permission check
   */
  error: Error | null;
}

/**
 * Props for components that check permissions
 */
export interface WithPermissionProps {
  /**
   * The permission required to access this component/feature
   */
  requiredPermission?: Permission;
}

/**
 * Function signature for permission check functions
 */
export type CheckPermissionFn = (permission: Permission) => Promise<boolean>;
