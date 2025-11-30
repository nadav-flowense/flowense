import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter as createTanstackRouter } from '@tanstack/react-router';
import { queryClient } from '@/clients/queryClient';
import { env } from '@/env';
import { routeTree } from '@/routeTree.gen';
import Spinner from '@/routes/-components/common/spinner';
export function createRouter() {
    const router = createTanstackRouter({
        routeTree,
        basepath: env.PUBLIC_BASE_PATH,
        scrollRestoration: true,
        defaultPreload: 'intent',
        defaultPendingComponent: () => _jsx(Spinner, {}),
        Wrap: function WrapComponent({ children }) {
            return (_jsx(QueryClientProvider, { client: queryClient, children: children }));
        },
    });
    return router;
}
