import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@/clients/authClient';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session?.user) {
      throw redirect({ to: '/' });
    }
  },
  component: Layout,
});

function Layout() {
  return <Outlet />;
}
