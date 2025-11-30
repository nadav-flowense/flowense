import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { appConfig } from '@repo/config/app';
import { type AuthSession, authQueryOptions } from '@/clients/authClient';

export const Route = createFileRoute('/(app)')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(authQueryOptions());

    if (!session?.user) {
      throw redirect({ to: appConfig.authRoutes.signin });
    }

    // Re-return session as non-null for type safety in child routes
    return { session: session as NonNullable<AuthSession> };
  },
  component: AppLayout,
});

function AppLayout() {
  return <Outlet />;
}
