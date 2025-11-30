import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExitIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage, } from '@repo/ui/components/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@repo/ui/components/dropdown-menu';
import { useTheme } from 'next-themes';
import { authClient } from '@/clients/authClient';
export default function UserAvatar({ user, }) {
    const { resolvedTheme, setTheme } = useTheme();
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Avatar, { className: "cursor-pointer w-8.5 h-8.5", children: [_jsx(AvatarImage, { referrerPolicy: "no-referrer", src: user.image ?? '' }), _jsx(AvatarFallback, { className: "text-sm", children: (user.name?.split(' ')[0]?.[0] || '') +
                                (user.name?.split(' ')[1]?.[0] || '') })] }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-40", children: [_jsxs("div", { className: "flex flex-col p-2 max-w-full break-words whitespace-break-spaces", children: [_jsx("span", { className: "text-sm font-bold line-clamp-2", children: user.name }), _jsx("span", { className: "text-xs italic mt-1 line-clamp-2", children: user.email })] }), _jsx("hr", { className: "mb-2" }), _jsxs(DropdownMenuItem, { className: "cursor-pointer", onClick: (e) => {
                            e.preventDefault();
                            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                        }, children: [resolvedTheme === 'dark' ? _jsx(MoonIcon, {}) : _jsx(SunIcon, {}), _jsx("span", { className: "ml-[5px] capitalize", children: "Theme" })] }), _jsxs(DropdownMenuItem, { onClick: async () => {
                            await authClient.signOut();
                        }, className: "cursor-pointer", children: [_jsx(ExitIcon, { className: "mr-[5px] w-5 ml-[0.5px]" }), "Logout"] })] })] }));
}
