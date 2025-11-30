import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@repo/ui/components/button';
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger, } from '@repo/ui/components/tooltip';
import { cn } from '@repo/ui/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/clients/apiClient';
import Spinner from '@/routes/-components/common/spinner';
export default function DeleteFlowButton({ children, className, flowId, }) {
    const { refetch } = useQuery(apiClient.flows.all.queryOptions());
    const deleteFlowMutation = useMutation(apiClient.flows.delete.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async () => {
            await refetch();
            toast.info('Flow deleted successfully.');
        },
    }));
    return (_jsx(TooltipProvider, { delayDuration: 0, children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { disabled: deleteFlowMutation.isPending, onClick: (e) => {
                            e.preventDefault();
                            deleteFlowMutation.mutate({ id: flowId });
                        }, variant: "destructive", className: cn('h-9 w-10', className), children: deleteFlowMutation.isPending ? _jsx(Spinner, {}) : children }) }), _jsxs(TooltipContent, { side: "left", align: "center", sideOffset: 4, className: "bg-neutral-500 fill-neutral-500 duration-0", children: [_jsx("span", { children: "Delete Flow" }), _jsx(TooltipArrow, { width: 15, height: 10, className: "duration-0" })] })] }) }));
}
