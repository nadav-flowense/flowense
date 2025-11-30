import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDownIcon, ArrowUpIcon, MagnifyingGlassIcon, TrashIcon, } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger, } from '@repo/ui/components/tooltip';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, stripSearchParams, useNavigate, } from '@tanstack/react-router';
import * as v from 'valibot';
import { apiClient } from '@/clients/apiClient';
import { queryClient } from '@/clients/queryClient';
import CreateFlowButton from '@/routes/_protected/flows/-components/create-flow';
import DeleteFlowButton from '@/routes/_protected/flows/-components/delete-flow';
import { flowsSearchDefaults, flowsSearchSchema, } from '@/routes/_protected/flows/-validations/flows-link-options';
export const Route = createFileRoute('/_protected/flows/')({
    loader: () => queryClient.ensureQueryData(apiClient.flows.all.queryOptions()),
    component: RouteComponent,
    validateSearch: (input) => v.parse(flowsSearchSchema, input),
    search: {
        middlewares: [stripSearchParams(flowsSearchDefaults)],
    },
    errorComponent: ({ error }) => {
        return (_jsx("div", { className: "flex flex-col items-center w-full gap-y-3", children: _jsx("div", { children: error.message }) }));
    },
});
function FlowItem({ flow, disabled, }) {
    return (_jsxs(Link, { to: "/flows/$flowid", params: { flowid: flow.id }, className: "border border-gray-500 bg-elevated p-4 w-full flex items-center justify-between gap-3 rounded-xl hover:brightness-90", disabled: disabled, children: [_jsxs("div", { className: "flex flex-col gap-y-1", children: [_jsx("div", { className: "text-lg font-bold line-clamp-3 wrap-anywhere", children: flow.title }), _jsx("div", { className: "italic text-sm", children: new Date(flow.createdAt).toLocaleString() })] }), _jsx(DeleteFlowButton, { flowId: flow.id, children: _jsx(TrashIcon, {}) })] }));
}
function RouteComponent() {
    const { data: flows, isPending } = useQuery(apiClient.flows.all.queryOptions());
    const navigate = useNavigate({ from: Route.fullPath });
    const search = Route.useSearch();
    const updateFilters = (name, value) => {
        navigate({ search: (prev) => ({ ...prev, [name]: value }) });
    };
    /**
     * You could memoize flows, although if you use the react 19 compiler
     * (which RT-stack will in the future), it won't be necessary.
     */
    const lowercaseSearch = search.searchString.toLowerCase();
    const filteredFlow = flows
        ?.filter((p) => p.title.toLowerCase().includes(lowercaseSearch))
        ?.sort((a, b) => search.sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return (_jsxs("div", { className: "flex flex-col p-1.5 md:p-4 w-full max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl", children: "Flows" }), _jsx(CreateFlowButton, {})] }), _jsx("hr", { className: "mt-4 border-b-2 border-gray-400" }), _jsxs("div", { className: "mt-4 flex justify-end items-center relative gap-x-2", children: [_jsx(TooltipProvider, { children: _jsxs(Tooltip, { delayDuration: 0, children: [_jsx(TooltipTrigger, { asChild: true, onClick: (e) => e.preventDefault(), children: _jsx(Button, { variant: "link", className: "w-12 border border-input hover:brightness-150", onClick: () => updateFilters('sortDirection', search.sortDirection === 'asc' ? 'desc' : 'asc'), children: search.sortDirection === 'asc' ? (_jsx(ArrowUpIcon, {})) : (_jsx(ArrowDownIcon, {})) }) }), _jsxs(TooltipContent, { side: "top", align: "center", sideOffset: 4, onPointerDownOutside: (e) => e.preventDefault(), className: "bg-neutral-500 fill-neutral-500 duration-0", children: [_jsxs("span", { children: ["Sort by created date (", search.sortDirection, ")"] }), _jsx(TooltipArrow, { width: 15, height: 10, className: "duration-0" })] })] }) }), _jsxs("div", { className: "relative sm:max-w-64 w-full", children: [_jsx(Input, { value: search.searchString, onChange: (e) => updateFilters('searchString', e.target.value), placeholder: "Search by title...", className: "w-full pr-10 placeholder:italic peer" }), _jsx(MagnifyingGlassIcon, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-input peer-focus:text-foreground transition-colors" })] })] }), _jsx("div", { className: "flex gap-x-3 gap-y-3 flex-wrap my-4 md:my-6", children: filteredFlow?.length
                    ? filteredFlow.map((p) => (_jsx(FlowItem, { flow: p, disabled: isPending }, p.id)))
                    : 'There are no flows available.' })] }));
}
