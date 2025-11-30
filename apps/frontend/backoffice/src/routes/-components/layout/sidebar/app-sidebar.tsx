import { ExitIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonLabel,
  SidebarMenuItem,
  useSidebar,
} from '@repo/ui/components/sidebar';
import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronUp, FileText, GitBranch, Home, type LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { AuthSession } from '@/clients/authClient';
import { authClient } from '@/clients/authClient';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

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
    title: 'Diagrams',
    href: '/diagrams',
    icon: GitBranch,
  },
];

interface AppSidebarProps {
  session: NonNullable<AuthSession>;
}

export function AppSidebar({ session }: Readonly<AppSidebarProps>) {
  const { isIconMode } = useSidebar();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center px-4">
        {isIconMode ? (
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="size-4" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">RT Stack</span>
              <span className="truncate text-xs text-muted-foreground">
                Application
              </span>
            </div>
          </div>
        )}
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
                      <Link to={item.href}>
                        <item.icon className="size-4 shrink-0" />
                        <SidebarMenuButtonLabel>
                          {item.title}
                        </SidebarMenuButtonLabel>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu user={session.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

function UserMenu({
  user,
}: Readonly<{
  user: typeof authClient.$Infer.Session.user;
}>) {
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
        <div className="flex flex-col p-2 max-w-full break-words whitespace-break-spaces">
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
            await authClient.signOut();
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
