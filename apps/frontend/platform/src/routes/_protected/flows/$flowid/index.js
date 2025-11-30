import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeftIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger, } from '@repo/ui/components/tooltip';
import { createFileRoute, Link } from '@tanstack/react-router';
import { apiClient } from '@/clients/apiClient';
import { queryClient } from '@/clients/queryClient';
import { flowsLinkOptions } from '@/routes/_protected/flows/-validations/flows-link-options';
export const Route = createFileRoute('/_protected/flows/$flowid/')({
    loader: ({ params }) => queryClient.ensureQueryData(apiClient.flows.one.queryOptions({ input: { id: params.flowid } })),
    component: RouteComponent,
    errorComponent: ({ error, reset }) => {
        return (_jsxs("div", { className: "flex flex-col items-center w-full gap-y-3", children: [_jsx("div", { children: error.message }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { asChild: true, variant: "outline", className: "w-full", children: _jsxs(Link, { ...flowsLinkOptions, children: [_jsx(ArrowLeftIcon, {}), "Go Back"] }) }), _jsxs(Button, { variant: "secondary", onClick: () => {
                                // Reset the router error boundary
                                reset();
                            }, className: "w-full", children: ["Retry? ", _jsx(ReloadIcon, {})] })] })] }));
    },
});
function RouteComponent() {
    const flow = Route.useLoaderData();
    return (_jsxs("div", { className: "flex flex-col px-4 w-full max-w-6xl mx-auto wrap-break-word", children: [_jsxs("div", { className: "text-center p-5 rounded-2xl", children: [_jsx("h1", { className: "text-2xl md:text-4xl font-bold", children: flow.title }), _jsxs("h2", { className: "text-sm text-gray-500 mt-2", children: ["Created by ", _jsx("span", { className: "font-medium", children: flow.author.name })] }), _jsx("h2", { className: "text-sm text-gray-500 mt-1", children: new Date(flow.createdAt).toLocaleString() })] }), _jsx("hr", { className: "border border-gray-500 mt-3" }), _jsx(TooltipProvider, { delayDuration: 0, children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { asChild: true, variant: "link", className: "w-12 border border-gray-500 mt-4 md:mt-6 hover:brightness-150", children: _jsx(Link, { ...flowsLinkOptions, children: _jsx(ArrowLeftIcon, {}) }) }) }), _jsxs(TooltipContent, { side: "right", align: "center", sideOffset: 4, className: "bg-neutral-500 fill-neutral-500 duration-0", children: [_jsx("span", { children: "View all flows" }), _jsx(TooltipArrow, { width: 15, height: 10, className: "duration-0" })] })] }) }), _jsx("div", { className: "bg-elevated shadow rounded-2xl w-full min-h-96 border border-gray-500 p-6 my-4 md:my-6", children: _jsx("p", { className: "leading-relaxed whitespace-break-spaces", children: flow.content ?? 'No content available.' }) })] }));
}
