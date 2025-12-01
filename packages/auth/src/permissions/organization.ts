/**
 * Organization-level (platform) permissions using Better Auth organization plugin
 * These permissions are scoped to a specific organization
 */

import { createAccessControl } from 'better-auth/plugins/access';
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from 'better-auth/plugins/organization/access';

/**
 * Organization-level statement (platform operations)
 * Extends default organization statements with custom resources
 */
const orgStatement = {
  ...defaultStatements,

  // Core product
  flow: [
    'create',
    'read',
    'update',
    'delete',
    'publish',
    'unpublish',
    'duplicate',
    'export',
    'restore',
  ],
  template: ['create', 'read', 'update', 'delete'],

  // Integrations & configuration
  integration: ['create', 'read', 'update', 'delete', 'test'],
  variable: ['create', 'read', 'update', 'delete'],
  webhook: ['create', 'read', 'update', 'delete', 'test'],

  // Organization management
  billing: ['read', 'update'],
  analytics: ['read', 'export'],
  auditLog: ['read'],
} as const;

export const orgAc = createAccessControl(orgStatement);

/**
 * Organization Roles
 */
export const orgRoles = {
  /**
   * Owner - The subscriber who created/pays for the organization
   * Full control including billing and destructive actions
   */
  owner: orgAc.newRole({
    ...ownerAc.statements,
    flow: [
      'create',
      'read',
      'update',
      'delete',
      'publish',
      'unpublish',
      'duplicate',
      'export',
      'restore',
    ],
    template: ['create', 'read', 'update', 'delete'],
    integration: ['create', 'read', 'update', 'delete', 'test'],
    variable: ['create', 'read', 'update', 'delete'],
    webhook: ['create', 'read', 'update', 'delete', 'test'],
    billing: ['read', 'update'],
    analytics: ['read', 'export'],
    auditLog: ['read'],
  }),

  /**
   * Admin - Can manage everything except billing and org deletion
   * Typically team leads or senior members
   */
  admin: orgAc.newRole({
    ...adminAc.statements,
    flow: [
      'create',
      'read',
      'update',
      'delete',
      'publish',
      'unpublish',
      'duplicate',
      'export',
      'restore',
    ],
    template: ['create', 'read', 'update', 'delete'],
    integration: ['create', 'read', 'update', 'delete', 'test'],
    variable: ['create', 'read', 'update', 'delete'],
    webhook: ['create', 'read', 'update', 'delete', 'test'],
    billing: ['read'], // Can view but not modify
    analytics: ['read', 'export'],
    auditLog: ['read'],
  }),

  /**
   * Editor - Can create and edit flows, limited configuration access
   * Standard team member building flows
   */
  editor: orgAc.newRole({
    ...memberAc.statements,
    flow: ['create', 'read', 'update', 'duplicate', 'export'],
    template: ['read'],
    integration: ['read', 'test'],
    variable: ['read'],
    webhook: ['read'],
    analytics: ['read'],
  }),

  /**
   * Viewer - Read-only access to flows and resources
   * For stakeholders, clients, or reviewers
   */
  viewer: orgAc.newRole({
    flow: ['read'],
    template: ['read'],
    integration: ['read'],
    analytics: ['read'],
  }),
};

export type OrgRole = keyof typeof orgRoles;
export type OrgStatement = typeof orgStatement;
