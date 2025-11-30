import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar';
import { Toaster } from '@repo/ui/components/sonner';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import React from 'react';
import { authClient } from '@/clients/authClient';
import Spinner from '@/routes/-components/common/spinner';
import { AppSidebar } from '@/routes/-components/layout/sidebar/app-sidebar';
export const Route = createRootRoute({
    component: RootComponent,
});
// https://tanstack.com/router/v1/docs/framework/react/devtools
const TanStackRouterDevtools = import.meta.env.PROD
    ? () => null
    : React.lazy(() => import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
    })));
function RootComponent() {
    const { data: session, isPending } = authClient.useSession();
    if (isPending) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center", children: _jsx(Spinner, {}) }));
    }
    // Signed-in users get the sidebar layout
    if (session?.user) {
        return (_jsxs(SidebarProvider, { children: [_jsx(AppSidebar, { session: session }), _jsx(SidebarInset, { children: _jsx("div", { className: "flex-1 p-4", children: _jsx(Outlet, {}) }) }), _jsx(Toaster, {}), _jsx(React.Suspense, { children: _jsx(TanStackRouterDevtools, { position: "bottom-right" }) })] }));
    }
    // Non-authenticated users get a simple layout without sidebar
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "min-h-screen", children: _jsx(Outlet, {}) }), _jsx(Toaster, {}), _jsx(React.Suspense, { children: _jsx(TanStackRouterDevtools, { position: "bottom-right" }) })] }));
}
