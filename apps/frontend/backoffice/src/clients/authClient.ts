import type { AuthClient, AuthIntegration } from '@repo/auth/client-query';
import { createAuthIntegration } from '@repo/auth/client-query';
import { env } from '@/env';

const integration: AuthIntegration = createAuthIntegration({
  apiBaseUrl: env.PUBLIC_SERVER_URL,
  apiBasePath: env.PUBLIC_SERVER_API_PATH,
  enableStripe: false, // Backoffice does not use Stripe
  // Identify backoffice requests for email whitelist check
  headers: {
    'x-app-type': 'backoffice',
  },
});

export const authClient: AuthClient = integration.authClient;
export const authQueryOptions = integration.authQueryOptions;
export const permissionQueryOptions = integration.permissionQueryOptions;

export type { AuthSession, Permission } from '@repo/auth/client-query';
