import { useQueries } from '@tanstack/react-query';
import {
  AppSidebar as AppSidebarBase,
  type NavItem,
  type NavItemPermissionResult,
} from '@repo/ui/components/app-sidebar';
import { Link, useRouterState } from '@tanstack/react-router';
import { BookOpen, FileText, GitBranch, Home } from 'lucide-react';
import type { AuthSession } from '@/clients/authClient';
import { authClient, permissionQueryOptions } from '@/clients/authClient';

/**
 * Navigation items with optional permission requirements
 * Items without requiredPermission are always visible
 */
const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
    // No permission required - accessible to all authenticated users
  },
  {
    title: 'Flows',
    href: '/flows',
    icon: FileText,
    // Requires backoffice access permission
    requiredPermission: { backoffice: ['access'] },
  },
  {
    title: 'Diagrams',
    href: '/diagrams',
    icon: GitBranch,
    // Requires backoffice access permission
    requiredPermission: { backoffice: ['access'] },
  },
  {
    title: 'Documentation',
    href: '/docs',
    icon: BookOpen,
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
