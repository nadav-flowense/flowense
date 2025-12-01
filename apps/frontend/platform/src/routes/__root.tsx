import { SidebarInset, SidebarProvider, Toaster } from '@repo/ui';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import React from 'react';
import { authClient } from '@/clients/authClient';
import type { RouterContext } from '@/router';
import { AppSidebar } from '@/routes/-components/layout/sidebar/app-sidebar';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

// https://tanstack.com/router/v1/docs/framework/react/devtools
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import('@tanstack/react-router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

function RootComponent() {
  const { data: session, isPending } = authClient.useSession();

  // Show loading state while checking auth
  if (isPending) {
    return null;
  }

  // Signed-in users get the sidebar layout
  if (session?.user) {
    return (
      <SidebarProvider>
        <AppSidebar session={session} />
        <SidebarInset>
          <div className="flex-1 p-4">
            <Outlet />
          </div>
        </SidebarInset>
        <Toaster />
        <React.Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </React.Suspense>
      </SidebarProvider>
    );
  }

  // Non-authenticated users get a simple layout without sidebar
  return (
    <>
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Toaster />
      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </React.Suspense>
    </>
  );
}
