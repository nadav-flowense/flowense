import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { authQueryOptions } from '@/clients/authClient';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      authQueryOptions(),
    );
    if (!session?.user) {
      throw redirect({ to: '/' });
    }
  },
  component: Layout,
});

function Layout() {
  return <Outlet />;
}
