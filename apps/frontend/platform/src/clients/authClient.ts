import { createAuthIntegration } from '@repo/auth/client-query';
import { env } from '@/env';

export const { authClient, authQueryOptions, organizationQueryOptions } =
  createAuthIntegration({
    apiBaseUrl: env.PUBLIC_SERVER_URL,
    apiBasePath: env.PUBLIC_SERVER_API_PATH,
  });

export type {
  AuthSession,
  Organization,
  FullOrganization,
} from '@repo/auth/client-query';
