import { queryOptions } from '@tanstack/react-query';
import { type AuthClientOptions, createAuthClient } from './client';

export type AuthClient = ReturnType<typeof createAuthClient>;

export type AuthSession = AuthClient['$Infer']['Session'] | null;

export const createAuthQueryOptions = (authClient: AuthClient) => () =>
  queryOptions({
    queryKey: ['auth', 'session'],
    queryFn: async (): Promise<AuthSession> => {
      const { data, error } = await authClient.getSession();
      if (error) {
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const createAuthIntegration = (options: AuthClientOptions) => {
  const authClient = createAuthClient(options);
  const authQueryOptions = createAuthQueryOptions(authClient);

  return {
    authClient,
    authQueryOptions,
  };
};
