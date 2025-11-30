import { queryOptions } from '@tanstack/react-query';
import { authClient } from './authClient';

export const authQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();
      if (error) {
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export type AuthSession = Awaited<
  ReturnType<typeof authQueryOptions>['queryFn']
>;
