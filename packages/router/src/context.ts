import type { QueryClient } from '@tanstack/react-query';

export interface RouterContext {
  queryClient: QueryClient;
}

export const createRouterContext = (queryClient: QueryClient): RouterContext => ({
  queryClient,
});
