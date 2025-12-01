import { ExitIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { ChevronUp, type LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { ComponentType, ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import FlowenseIcon from './icons/FlowenseIcon';
import FlowenseLogo from './icons/FlowenseLogo';
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
} from './sidebar';

function SidebarLogo() {
  const { isIconMode } = useSidebar();

  if (isIconMode) {
    return (
      <div className="flex size-7 items-center justify-center">
        <FlowenseIcon />
      </div>
    );
  }

  return (
    <div className="w-[90%] max-w-[150px] flex items-center justify-center">
      <FlowenseLogo className="w-full h-auto" />
    </div>
  );
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface AppSidebarUser {
  name: string | null;
  email: string;
  image?: string | null | undefined;
}

export interface AppSidebarProps {
  navItems: NavItem[];
  user: AppSidebarUser;
  currentPath: string;
  onSignOut: () => Promise<unknown>;
  LinkComponent: ComponentType<{ to: string; children: ReactNode }>;
}

export function AppSidebar({
  navItems,
  user,
  currentPath,
  onSignOut,
  LinkComponent,
}: Readonly<AppSidebarProps>) {
  const { isIconMode } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center px-4 py-8">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent
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
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
          }}
        >
          {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
          <span className="ml-[5px] capitalize">Theme</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await onSignOut();
          }}
          className="cursor-pointer"
        >
          <ExitIcon className="mr-[5px] w-5 ml-[0.5px]" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
