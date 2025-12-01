import type { AuthClient, AuthIntegration } from '@repo/auth/client-query';
import { createAuthIntegration } from '@repo/auth/client-query';
import { env } from '@/env';

const integration: AuthIntegration = createAuthIntegration({
  apiBaseUrl: env.PUBLIC_SERVER_URL,
  apiBasePath: env.PUBLIC_SERVER_API_PATH,
  enableStripe: true, // Platform has Stripe enabled for subscriptions
});

export const authClient: AuthClient = integration.authClient;
export const authQueryOptions = integration.authQueryOptions;
export const organizationQueryOptions = integration.organizationQueryOptions;
export const permissionQueryOptions = integration.permissionQueryOptions;
export const subscriptionQueryOptions = integration.subscriptionQueryOptions;

export type {
  AuthSession,
  FullOrganization,
  Organization,
  Permission,
  Subscription,
} from '@repo/auth/client-query';
