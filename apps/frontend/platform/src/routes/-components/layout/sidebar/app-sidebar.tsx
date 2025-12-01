import {
  AppSidebar as AppSidebarBase,
  type NavItem,
} from '@repo/ui/components/app-sidebar';
import { Link, useRouterState } from '@tanstack/react-router';
import { Building2, FileText, Home } from 'lucide-react';
import type { AuthSession } from '@/clients/authClient';
import { authClient } from '@/clients/authClient';

const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Flows',
    href: '/flows',
    icon: FileText,
  },
  {
    title: 'Organizations',
    href: '/organizations',
    icon: Building2,
  },
];

interface AppSidebarProps {
  session: NonNullable<AuthSession>;
}

export function AppSidebar({ session }: Readonly<AppSidebarProps>) {
  const routerState = useRouterState();

  return (
    <AppSidebarBase
      navItems={navItems}
      user={session.user}
      currentPath={routerState.location.pathname}
      onSignOut={() => authClient.signOut()}
      LinkComponent={Link}
    />
  );
}
