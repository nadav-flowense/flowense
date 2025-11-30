import { createRouterFactory } from '@repo/router';
import { queryClient } from '@/clients/queryClient';
import { env } from '@/env';
import Spinner from '@/routes/-components/common/spinner';
import { routeTree } from '@/routeTree.gen';

export type { RouterContext } from '@repo/router';

export function createRouter() {
  return createRouterFactory({
    routeTree,
    queryClient,
    basepath: env.PUBLIC_BASE_PATH,
    defaultPendingComponent: Spinner,
  });
}
