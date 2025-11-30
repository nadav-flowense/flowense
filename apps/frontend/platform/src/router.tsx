import { createRouterFactory } from '@repo/router';
import { queryClient } from '@/clients/queryClient';
import { env } from '@/env';
import { routeTree } from '@/routeTree.gen';
import DefaultError from '@/routes/-components/common/default-error';
import DefaultNotFound from '@/routes/-components/common/default-not-found';
import Spinner from '@/routes/-components/common/spinner';

export type { RouterContext } from '@repo/router';

export function createRouter() {
  return createRouterFactory({
    routeTree,
    queryClient,
    basepath: env.PUBLIC_BASE_PATH,
    defaultPendingComponent: Spinner,
    defaultErrorComponent: DefaultError,
    defaultNotFoundComponent: DefaultNotFound,
  });
}
