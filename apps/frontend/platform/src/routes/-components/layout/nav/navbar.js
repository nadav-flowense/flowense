import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from '@tanstack/react-router';
import { flowsLinkOptions } from '@/routes/_protected/flows/-validations/flows-link-options';
import NavContainer from '@/routes/-components/layout/nav/nav-container';
import UserAvatar from '@/routes/-components/layout/nav/user-avatar';
const activeClassName = 'underline decoration-2 opacity-70';
export function Navbar({ session }) {
    return (_jsxs(NavContainer, { children: [_jsxs("div", { className: "flex gap-x-4", children: [_jsx(Link, { to: "/", activeProps: { className: activeClassName }, activeOptions: { exact: true }, children: "Home" }), session?.user ? (_jsx(Link, { ...flowsLinkOptions, activeProps: { className: activeClassName }, children: "Flows" })) : null] }), session?.user ? (_jsx(UserAvatar, { user: session.user })) : (_jsxs("div", { className: "flex gap-x-2 justify-between", children: [_jsx(Link, { to: "/login", activeProps: { className: activeClassName }, activeOptions: { exact: true }, children: "Login" }), _jsx("span", { children: "|" }), _jsx(Link, { to: "/register", activeProps: { className: activeClassName }, activeOptions: { exact: true }, children: "Register" })] }))] }));
}
