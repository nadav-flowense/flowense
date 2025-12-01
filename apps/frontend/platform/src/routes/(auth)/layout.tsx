import { appConfig } from '@repo/config/app';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { authClient } from '@/clients/authClient';

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    // If user is authenticated, redirect to onboarding (which handles org check)
    if (session?.user) {
      throw redirect({ to: appConfig.authRoutes.onboarding });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Outlet />
    </div>
  );
}
