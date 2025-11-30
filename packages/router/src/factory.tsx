import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import {
  createRouter as createTanstackRouter,
  type AnyRoute,
  type ErrorRouteComponent,
  type NotFoundRouteComponent,
  type RouterHistory,
} from '@tanstack/react-router';
import type { ComponentType, ReactNode } from 'react';
import { createRouterContext } from './context';

export interface RouterFactoryOptions {
  routeTree: AnyRoute;
  queryClient: QueryClient;
  basepath?: string;
  defaultPendingComponent?: ComponentType;
  defaultErrorComponent?: ErrorRouteComponent;
  defaultNotFoundComponent?: NotFoundRouteComponent;
  history?: RouterHistory;
}

export function createRouterFactory({
  routeTree,
  queryClient,
  basepath,
  defaultPendingComponent: PendingComponent,
  defaultErrorComponent,
  defaultNotFoundComponent,
  history,
}: RouterFactoryOptions) {
  const router = createTanstackRouter({
    routeTree,
    basepath,
    history,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPendingComponent: PendingComponent
      ? () => <PendingComponent />
      : undefined,
    defaultErrorComponent,
    defaultNotFoundComponent,
    context: createRouterContext(queryClient),
    Wrap: function WrapComponent({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouterFactory>;
  }
}
