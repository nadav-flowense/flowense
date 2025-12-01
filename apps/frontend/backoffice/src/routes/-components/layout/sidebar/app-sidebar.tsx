import {
  AppSidebar as AppSidebarBase,
  type NavItemPermissionResult,
  type SidebarNavItem,
} from '@repo/ui';
import { useQueries } from '@tanstack/react-query';
import { Link, useRouterState } from '@tanstack/react-router';
import { Building2, User, Users } from 'lucide-react';
import type { AuthSession } from '@/clients/authClient';
import { authClient, permissionQueryOptions } from '@/clients/authClient';

/**
 * Navigation items with optional permission requirements
 * Items without requiredPermission are always visible
 */
const navItems: SidebarNavItem[] = [
  {
    title: 'Accounts',
    href: '/',
    icon: Building2,
    // Requires backoffice access permission
    requiredPermission: { backoffice: ['access'] },
  },
  {
    title: 'Backoffice Users',
    href: '/users',
    icon: Users,
    // Requires backoffice admin permission
    requiredPermission: { backoffice: ['manage'] },
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
    // No permission required - accessible to all authenticated users
  },
];

interface AppSidebarProps {
  session: NonNullable<AuthSession>;
}

export function AppSidebar({ session }: Readonly<AppSidebarProps>) {
  const routerState = useRouterState();

  // Get all items that require permissions
  const itemsWithPermissions = navItems.filter(
    (item) => item.requiredPermission,
  );

  // Check permissions for all nav items that require them
  const permissionQueries = useQueries({
    queries: itemsWithPermissions.map((item) =>
      permissionQueryOptions.appPermission(item.requiredPermission!),
    ),
  });

  // Build permission results array
  const permissionResults: NavItemPermissionResult[] = itemsWithPermissions.map(
    (item, index) => ({
      href: item.href,
      hasPermission: permissionQueries[index]?.data ?? false,
    }),
  );

  return (
    <AppSidebarBase
      navItems={navItems}
      user={session.user}
      currentPath={routerState.location.pathname}
      onSignOut={() => authClient.signOut()}
      LinkComponent={Link}
      permissionResults={permissionResults}
    />
  );
}
