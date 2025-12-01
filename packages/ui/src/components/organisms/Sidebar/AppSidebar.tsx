'use client';

import { ExitIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { ChevronUp, type LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import type React from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { Permission } from '../../../hooks/use-permission';
import { Avatar, AvatarFallback, AvatarImage } from '../../atoms/Avatar';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '../../molecules/Dropdown';
import FlowenseWave from '../../atoms/Icon/FlowenseWave';
import FlowenseFullLogo from '../../atoms/Icon/FlowenseFull';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './SidebarPrimitives';

function SidebarLogo() {
  const { isIconMode } = useSidebar();

  if (isIconMode) {
    return (
      <div className="flex size-7 items-center justify-center">
        <FlowenseWave />
      </div>
    );
  }

  return (
    <div className="w-[90%] max-w-[150px] flex items-center justify-center">
      <FlowenseFullLogo />
    </div>
  );
}

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /**
   * Optional permission required to see this nav item
   * If not provided, the item is always visible
   */
  requiredPermission?: Permission;
}

/** @deprecated Use SidebarNavItem instead */
export type NavItem = SidebarNavItem;

export interface AppSidebarUser {
  name: string | null;
  email: string;
  image?: string | null | undefined;
}

/**
 * Result of a permission check for a nav item
 */
export interface NavItemPermissionResult {
  /** The href of the nav item */
  href: string;
  /** Whether the user has permission */
  hasPermission: boolean;
}

export interface AppSidebarProps {
  navItems: SidebarNavItem[];
  user: AppSidebarUser;
  currentPath: string;
  onSignOut: () => Promise<unknown>;
  LinkComponent: ComponentType<{ to: string; children: ReactNode }>;
  /**
   * Optional map of permission check results for nav items
   * Key is the nav item href, value is whether user has permission
   * Items without a requiredPermission or missing from this map are shown
   */
  permissionResults?: NavItemPermissionResult[];
}

export function AppSidebar({
  navItems,
  user,
  currentPath,
  onSignOut,
  LinkComponent,
  permissionResults,
}: Readonly<AppSidebarProps>) {
  const { isIconMode } = useSidebar();

  // Filter nav items based on permissions
  const visibleNavItems = navItems.filter((item) => {
    // If no permission required, always show
    if (!item.requiredPermission) {
      return true;
    }
    // If no permission results provided, show all items (graceful fallback)
    if (!permissionResults) {
      return true;
    }
    // Check if user has permission for this item
    const result = permissionResults.find((r) => r.href === item.href);
    // If no result found for this item, show it (graceful fallback)
    return result?.hasPermission ?? true;
  });

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center px-4 py-8">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <LinkComponent to={item.href}>
                        {isIconMode ? (
                          <item.icon className="size-5 shrink-0" />
                        ) : (
                          <span className="pl-[10%] truncate">
                            {item.title}
                          </span>
                        )}
                        {isActive && (
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-foreground h-full" />
                        )}
                      </LinkComponent>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu user={user} onSignOut={onSignOut} />
      </SidebarFooter>
    </Sidebar>
  );
}

interface UserMenuProps {
  user: AppSidebarUser;
  onSignOut: () => Promise<unknown>;
}

function UserMenu({ user, onSignOut }: Readonly<UserMenuProps>) {
  const { resolvedTheme, setTheme } = useTheme();
  const { isIconMode } = useSidebar();

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button
          type="button"
          className={`flex w-full items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer ${isIconMode ? 'justify-center' : ''}`}
        >
          <Avatar className="h-8 w-8 rounded-full shrink-0">
            <AvatarImage referrerPolicy="no-referrer" src={user.image ?? ''} />
            <AvatarFallback className="rounded-full text-xs">
              {(user.name?.split(' ')[0]?.[0] || '') +
                (user.name?.split(' ')[1]?.[0] || '')}
            </AvatarFallback>
          </Avatar>
          {!isIconMode && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          )}
          {!isIconMode && <ChevronUp className="size-4 shrink-0" />}
        </button>
      </DropdownTrigger>
      <DropdownContent
        className="w-56 rounded-lg"
        side={isIconMode ? 'right' : 'top'}
        align={isIconMode ? 'start' : 'end'}
        sideOffset={4}
      >
        <div className="flex flex-col p-2 max-w-full wrap-break-word whitespace-break-spaces">
          <span className="text-sm font-bold line-clamp-2">{user.name}</span>
          <span className="text-xs italic mt-1 line-clamp-2">{user.email}</span>
        </div>
        <hr className="mb-2" />
        <DropdownItem
          className="cursor-pointer"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
          }}
        >
          {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
          <span className="ml-[5px] capitalize">Theme</span>
        </DropdownItem>
        <DropdownItem
          onClick={async () => {
            await onSignOut();
          }}
          className="cursor-pointer"
        >
          <ExitIcon className="mr-[5px] w-5 ml-[0.5px]" />
          Logout
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
