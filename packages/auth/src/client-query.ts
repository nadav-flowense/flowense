import { queryOptions } from '@tanstack/react-query';
import { type AuthClientOptions, createAuthClient } from './client';

export type AuthClient = ReturnType<typeof createAuthClient>;

export type AuthSession = AuthClient['$Infer']['Session'] | null;

export type Organization = NonNullable<
  Awaited<ReturnType<AuthClient['organization']['list']>>['data']
>[number];

export type FullOrganization = NonNullable<
  Awaited<ReturnType<AuthClient['organization']['getFullOrganization']>>['data']
>;

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

export const createOrganizationQueryOptions = (authClient: AuthClient) => ({
  list: () =>
    queryOptions({
      queryKey: ['organizations', 'list'],
      queryFn: async (): Promise<Organization[]> => {
        const { data, error } = await authClient.organization.list();
        if (error) {
          throw error;
        }
        return data ?? [];
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),

  active: (organizationId: string | null | undefined) =>
    queryOptions({
      queryKey: ['organization', 'active', organizationId],
      queryFn: async (): Promise<FullOrganization | null> => {
        if (!organizationId) return null;
        const { data, error } =
          await authClient.organization.getFullOrganization();
        if (error) {
          throw error;
        }
        return data ?? null;
      },
      enabled: !!organizationId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
});

export const createAuthIntegration = (options: AuthClientOptions) => {
  const authClient = createAuthClient(options);
  const authQueryOptions = createAuthQueryOptions(authClient);
  const organizationQueryOptions = createOrganizationQueryOptions(authClient);

  return {
    authClient,
    authQueryOptions,
    organizationQueryOptions,
  };
};
