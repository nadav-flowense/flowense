import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link } from '@tanstack/react-router';
import LoginCredentialsForm from '@/routes/_public/-components/login-form';
export const Route = createFileRoute('/_public/login')({
    component: RouteComponent,
});
function RouteComponent() {
    return (_jsx("div", { className: "p-2 md:p-6 flex flex-col items-center", children: _jsxs("div", { className: "border p-4 md:p-8 w-full max-w-md rounded-lg bg-elevated", children: [_jsx(LoginCredentialsForm, {}), _jsxs("div", { className: "mt-4 text-center", children: ["Don't have an account? ", _jsx(Link, { to: "/register", className: "underline", children: "Register" }), "!"] })] }) }));
}
