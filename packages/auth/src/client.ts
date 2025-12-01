import { adminClient, organizationClient } from 'better-auth/client/plugins';
import { createAuthClient as createBetterAuthClient } from 'better-auth/react';
import urlJoin from 'url-join';

import { appAc, appRoles, orgAc, orgRoles } from './permissions';

export interface AuthClientOptions {
  apiBaseUrl: string;
  apiBasePath: string;
}

export const createAuthClient = ({
  apiBaseUrl,
  apiBasePath,
}: AuthClientOptions) =>
  createBetterAuthClient({
    baseURL: urlJoin(apiBaseUrl, apiBasePath, 'auth'),
    plugins: [
      adminClient({
        ac: appAc,
        roles: appRoles,
      }),
      organizationClient({
        ac: orgAc,
        roles: orgRoles,
      }),
    ],
  });

// Re-export permissions for client-side use
export { appAc, appRoles, orgAc, orgRoles } from './permissions';
export type { AppRole, OrgRole } from './permissions';
