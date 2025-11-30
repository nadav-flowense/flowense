import { jsx as _jsx } from "react/jsx-runtime";
import { GearIcon } from '@radix-ui/react-icons';
import { cn } from '@repo/ui/lib/utils';
function Spinner({ className }) {
    return (_jsx("div", { className: cn('inline-block animate-spin duration-500', className), children: _jsx(GearIcon, {}) }));
}
export default Spinner;
