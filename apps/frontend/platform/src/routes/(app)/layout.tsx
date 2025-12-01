import { appConfig } from '@repo/config/app';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { type AuthSession, authClient } from '@/clients/authClient';

export const Route = createFileRoute('/(app)')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

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
