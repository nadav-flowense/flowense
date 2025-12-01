/**
 * App-level (backoffice) permissions using Better Auth admin plugin
 * These permissions are global and not scoped to any organization
 */

import { createAccessControl } from 'better-auth/plugins/access';
import {
  adminAc,
  defaultStatements,
} from 'better-auth/plugins/admin/access';

/**
 * App-level statement (backoffice operations)
 * Extends default admin statements with flow and backoffice resources
 */
const appStatement = {
  ...defaultStatements,
  flow: [
    'create',
    'read',
    'read:all',
    'update',
    'update:all',
    'delete',
    'delete:all',
    'restore',
    'restore:all',
  ],
  backoffice: ['access', 'analytics', 'audit-logs'],
} as const;

export const appAc = createAccessControl(appStatement);

/**
 * App-Level Roles
 */
export const appRoles = {
  /**
   * Admin - Full system access
   * For lead developers and system administrators
   */
  admin: appAc.newRole({
    ...adminAc.statements,
    flow: [
      'create',
      'read',
      'read:all',
      'update',
      'update:all',
      'delete',
      'delete:all',
      'restore',
      'restore:all',
    ],
    backoffice: ['access', 'analytics', 'audit-logs'],
  }),

  /**
   * Backoffice - Standard backoffice operator
   * Can view/edit all flows and access analytics, but no user management
   */
  backoffice: appAc.newRole({
    user: ['list'],
    flow: ['read:all', 'update:all', 'delete:all'],
    backoffice: ['access', 'analytics'],
  }),

  /**
   * Member - Regular platform user
   * Standard flow operations, no backoffice access
   */
  member: appAc.newRole({
    flow: ['create', 'read', 'read:all', 'update', 'delete', 'restore'],
  }),

  /**
   * Viewer - Read-only user
   * Can only view flows, no backoffice access
   */
  viewer: appAc.newRole({
    flow: ['read', 'read:all'],
  }),
};

export type AppRole = keyof typeof appRoles;
export type AppStatement = typeof appStatement;
