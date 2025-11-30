import { createAuthIntegration } from '@repo/auth/client-query';
import { env } from '@/env';

export const { authClient, authQueryOptions } = createAuthIntegration({
  apiBaseUrl: env.PUBLIC_SERVER_URL,
  apiBasePath: env.PUBLIC_SERVER_API_PATH,
});

export type { AuthSession } from '@repo/auth/client-query';
