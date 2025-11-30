import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ExternalLinkIcon, Link2Icon, MoonIcon, SunIcon, } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTheme } from 'next-themes';
import urlJoin from 'url-join';
import { authClient } from '@/clients/authClient';
import { env } from '@/env';
import { flowsLinkOptions } from '@/routes/_protected/flows/-validations/flows-link-options';
export const Route = createFileRoute('/')({
    component: RouteComponent,
});
function RouteComponent() {
    const { data: session } = authClient.useSession();
    const { resolvedTheme, setTheme } = useTheme();
    return (_jsxs("div", { className: "mt-1", children: [session?.user && (_jsx(_Fragment, { children: _jsxs("div", { className: "flex flex-col mb-5 bg-elevated p-3 rounded-lg", children: [_jsxs("div", { children: ["Welcome, ", _jsx("span", { className: "font-bold", children: session.user.name }), "!"] }), _jsxs("div", { className: "mt-3 flex gap-x-1.5", children: ["Click", ' ', _jsxs(Link, { ...flowsLinkOptions, className: "flex items-center gap-x-1 text-blue-500 underline", children: ["here ", _jsx(Link2Icon, { className: "mt-0.5" })] }), ' ', "to view your flows."] }), _jsxs("div", { className: "mt-3", children: [_jsx("p", { children: "You can also interact with the OpenAPI specification using Scalar:" }), _jsxs("ul", { className: "mt-2 list-disc space-y-1 pl-6", children: [_jsx("li", { children: _jsxs("a", { href: urlJoin(env.PUBLIC_SERVER_URL, env.PUBLIC_SERVER_API_PATH), target: "_blank", className: "text-blue-500 underline inline-flex items-center gap-x-1 break-words", rel: "noreferrer", children: ["API", _jsx(ExternalLinkIcon, { className: "mt-0.5 h-4 w-4" })] }) }), _jsx("li", { children: _jsxs("a", { href: urlJoin(env.PUBLIC_SERVER_URL, env.PUBLIC_SERVER_API_PATH, 'auth', 'reference'), target: "_blank", className: "text-blue-500 underline inline-flex items-center gap-x-1 break-words", rel: "noreferrer", children: ["Auth", _jsx(ExternalLinkIcon, { className: "mt-0.5 h-4 w-4" })] }) })] })] })] }) })), _jsxs("div", { children: ["This is the live demo for", ' ', _jsx("a", { className: "text-blue-500 underline brightness-125", target: "_blank", href: "https://github.com/nktnet1/rt-stack", rel: "noreferrer", children: "RT Stack" }), "."] }), !session?.user && (_jsxs("div", { className: "mt-4", children: ["Please", ' ', _jsx(Link, { to: "/login", className: "underline font-bold", children: "log in" }), "."] })), _jsxs("div", { className: "mt-3 flex items-center gap-x-2", children: ["Toggle theme:", _jsx(Button, { className: "w-9 h-9 rounded-full border-2 border-gray-500", variant: "ghost", onClick: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'), children: resolvedTheme === 'dark' ? (_jsx(MoonIcon, { className: "text-yellow-300" })) : (_jsx(SunIcon, { className: "text-red-600" })) })] })] }));
}
