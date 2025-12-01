import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { appConfig } from '@repo/config/app';
import { authQueryOptions } from '@/clients/authClient';

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(authQueryOptions());

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
