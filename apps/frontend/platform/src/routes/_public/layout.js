import { jsx as _jsx } from "react/jsx-runtime";
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { authClient } from '@/clients/authClient';
import Spinner from '@/routes/-components/common/spinner';
export const Route = createFileRoute('/_public')({
    component: Layout,
});
function Layout() {
    const { data: session, isPending } = authClient.useSession();
    if (isPending) {
        return _jsx(Spinner, {});
    }
    if (!session?.user) {
        return _jsx(Outlet, {});
    }
    return _jsx(Navigate, { to: "/" });
}
