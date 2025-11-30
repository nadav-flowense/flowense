import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FormFieldInfo({ field }) {
    return (_jsxs("div", { className: "mt-2", children: [field.state.meta.isTouched && field.state.meta.errors.length ? (_jsx("em", { className: "text-red-500", children: field.state.meta.errors.map((e) => e.message).join(', ') })) : null, field.state.meta.isValidating ? 'Validating...' : null] }));
}
