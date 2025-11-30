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
  : React.lazy(() =>
      import('@tanstack/react-router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

function RootComponent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
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
