import { stripeClient } from '@better-auth/stripe/client';
import { adminClient, organizationClient } from 'better-auth/client/plugins';
import { createAuthClient as createBetterAuthClient } from 'better-auth/react';
import urlJoin from 'url-join';

import { appAc, appRoles, orgAc, orgRoles } from './permissions';

export interface AuthClientOptions {
  apiBaseUrl: string;
  apiBasePath: string;
  /**
   * Enable Stripe subscription management on the client
   * @default false
   */
  enableStripe?: boolean;
  /**
   * Headers to add to auth requests (e.g., x-app-type for backoffice)
   */
  headers?: Record<string, string>;
}

/**
 * Type inference helper - creates a client with all plugins for type extraction
 * This is never called at runtime, only used for type inference
 */
const _typeInferenceClient = createBetterAuthClient({
  plugins: [
    adminClient({
      ac: appAc,
      roles: appRoles,
    }),
    organizationClient({
      ac: orgAc,
      roles: orgRoles,
    }),
    stripeClient({
      subscription: true,
    }),
  ],
});

/**
 * Auth client type with all plugins - use this for type annotations
 */
export type AuthClient = typeof _typeInferenceClient;

export const createAuthClient = ({
  apiBaseUrl,
  apiBasePath,
  enableStripe = false,
  headers,
}: AuthClientOptions): AuthClient =>
  createBetterAuthClient({
    baseURL: urlJoin(apiBaseUrl, apiBasePath, 'auth'),
    fetchOptions: headers
      ? {
          headers,
        }
      : undefined,
    plugins: [
      adminClient({
        ac: appAc,
        roles: appRoles,
      }),
      organizationClient({
        ac: orgAc,
        roles: orgRoles,
      }),
      // Add Stripe client if enabled
      ...(enableStripe
        ? [
            stripeClient({
              subscription: true,
            }),
          ]
        : []),
    ],
  }) as AuthClient;

// Re-export permissions for client-side use
export { appAc, appRoles, orgAc, orgRoles } from './permissions';
export type { AppRole, OrgRole } from './permissions';
