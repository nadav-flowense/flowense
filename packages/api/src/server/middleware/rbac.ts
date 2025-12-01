/**
 * RBAC (Role-Based Access Control) helpers for Better Auth
 *
 * These functions wrap Better Auth's permission checking APIs for use in ORPC middleware.
 */

import type { AuthInstance } from '@repo/auth/server';

export type Permission = Record<string, string[]>;

/**
 * Check app-level (admin plugin) permissions
 * Used for global/backoffice permissions that are not scoped to an organization
 *
 * @param auth - The Better Auth instance
 * @param userId - The user ID to check permissions for
 * @param permission - The permission object (e.g., { backoffice: ['access'] })
 * @returns Whether the user has the required permission
 */
export const checkAppPermission = async (
  auth: AuthInstance,
  userId: string,
  permission: Permission,
): Promise<boolean> => {
  try {
    const result = await auth.api.userHasPermission({
      body: {
        userId,
        permission,
      },
    });
    return result.success ?? false;
  } catch (error) {
    console.error('Error checking app permission:', error);
    return false;
  }
};

/**
 * Check organization-level (organization plugin) permissions
 * Used for permissions scoped to the user's active organization
 *
 * @param auth - The Better Auth instance
 * @param headers - The request headers (contains session with active organization)
 * @param permission - The permission object (e.g., { flow: ['create'] })
 * @returns Whether the user has the required permission in their active organization
 */
export const checkOrgPermission = async (
  auth: AuthInstance,
  headers: Headers,
  permission: Permission,
): Promise<boolean> => {
  try {
    const result = await auth.api.hasPermission({
      headers,
      body: {
        permission,
      },
    });
    return result.success ?? false;
  } catch (error) {
    console.error('Error checking org permission:', error);
    return false;
  }
};
