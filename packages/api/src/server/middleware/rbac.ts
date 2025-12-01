/**
 * RBAC (Role-Based Access Control) helpers for Better Auth
 *
 * Simple role-based checks for backoffice access control.
 * Organization-level permissions are handled by Better Auth's organization plugin
 * directly through session.activeOrganizationId and member roles.
 */

export type Permission = Record<string, string[]>;

/** Valid app-level roles from admin plugin */
export type AppRole = 'admin' | 'backoffice' | 'member';

/**
 * Check if a user role has access to backoffice
 * Admin and backoffice roles can access backoffice features
 */
export const hasBackofficeAccess = (role: string | undefined): boolean => {
  return role === 'admin' || role === 'backoffice';
};

/**
 * Check if a user role is admin
 */
export const isAdmin = (role: string | undefined): boolean => {
  return role === 'admin';
};
