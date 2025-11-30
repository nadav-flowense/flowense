import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExitIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage, } from '@repo/ui/components/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@repo/ui/components/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuButtonLabel, SidebarMenuItem, useSidebar, } from '@repo/ui/components/sidebar';
import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronUp, FileText, Home } from 'lucide-react';
import { useTheme } from 'next-themes';
import { authClient } from '@/clients/authClient';
const navItems = [
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
];
export function AppSidebar({ session }) {
    const { isIconMode } = useSidebar();
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;
    return (_jsxs(Sidebar, { children: [_jsx(SidebarHeader, { className: "h-16 flex items-center justify-center px-4", children: isIconMode ? (_jsx("div", { className: "flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: _jsx(Home, { className: "size-4" }) })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: _jsx(Home, { className: "size-4" }) }), _jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [_jsx("span", { className: "truncate font-semibold", children: "RT Stack" }), _jsx("span", { className: "truncate text-xs text-muted-foreground", children: "Application" })] })] })) }), _jsx(SidebarContent, { children: _jsx(SidebarGroup, { children: _jsx(SidebarGroupContent, { children: _jsx(SidebarMenu, { children: navItems.map((item) => {
                                const isActive = item.href === '/'
                                    ? currentPath === '/'
                                    : currentPath.startsWith(item.href);
                                return (_jsx(SidebarMenuItem, { children: _jsx(SidebarMenuButton, { asChild: true, isActive: isActive, children: _jsxs(Link, { to: item.href, children: [_jsx(item.icon, { className: "size-4 shrink-0" }), _jsx(SidebarMenuButtonLabel, { children: item.title })] }) }) }, item.title));
                            }) }) }) }) }), _jsx(SidebarFooter, { children: _jsx(UserMenu, { user: session.user }) })] }));
}
function UserMenu({ user, }) {
    const { resolvedTheme, setTheme } = useTheme();
    const { isIconMode } = useSidebar();
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs("button", { type: "button", className: `flex w-full items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer ${isIconMode ? 'justify-center' : ''}`, children: [_jsxs(Avatar, { className: "h-8 w-8 rounded-full shrink-0", children: [_jsx(AvatarImage, { referrerPolicy: "no-referrer", src: user.image ?? '' }), _jsx(AvatarFallback, { className: "rounded-full text-xs", children: (user.name?.split(' ')[0]?.[0] || '') +
                                        (user.name?.split(' ')[1]?.[0] || '') })] }), !isIconMode && (_jsxs("div", { className: "flex-1 min-w-0 text-left", children: [_jsx("p", { className: "text-sm font-medium truncate", children: user.name }), _jsx("p", { className: "text-xs text-muted-foreground truncate", children: user.email })] })), !isIconMode && _jsx(ChevronUp, { className: "size-4 shrink-0" })] }) }), _jsxs(DropdownMenuContent, { className: "w-56 rounded-lg", side: isIconMode ? 'right' : 'top', align: isIconMode ? 'start' : 'end', sideOffset: 4, children: [_jsxs("div", { className: "flex flex-col p-2 max-w-full break-words whitespace-break-spaces", children: [_jsx("span", { className: "text-sm font-bold line-clamp-2", children: user.name }), _jsx("span", { className: "text-xs italic mt-1 line-clamp-2", children: user.email })] }), _jsx("hr", { className: "mb-2" }), _jsxs(DropdownMenuItem, { className: "cursor-pointer", onClick: (e) => {
                            e.preventDefault();
                            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                        }, children: [resolvedTheme === 'dark' ? _jsx(MoonIcon, {}) : _jsx(SunIcon, {}), _jsx("span", { className: "ml-[5px] capitalize", children: "Theme" })] }), _jsxs(DropdownMenuItem, { onClick: async () => {
                            await authClient.signOut();
                        }, className: "cursor-pointer", children: [_jsx(ExitIcon, { className: "mr-[5px] w-5 ml-[0.5px]" }), "Logout"] })] })] }));
}
