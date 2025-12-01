import {
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import type { RouterOutput } from '@repo/api/client';
import {
  Button,
  Input,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui';
import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  type SearchSchemaInput,
  stripSearchParams,
  useNavigate,
} from '@tanstack/react-router';
import * as v from 'valibot';
import { apiClient } from '@/clients/apiClient';
import { queryClient } from '@/clients/queryClient';
import CreateFlowButton from '@/routes/(app)/flows/-components/create-flow';
import DeleteFlowButton from '@/routes/(app)/flows/-components/delete-flow';
import {
  type FlowSearchSchema,
  flowsSearchDefaults,
  flowsSearchSchema,
} from '@/routes/(app)/flows/-validations/flows-link-options';

export const Route = createFileRoute('/(app)/flows/')({
  loader: () => queryClient.ensureQueryData(apiClient.flows.all.queryOptions()),
  component: RouteComponent,
  validateSearch: (input: SearchSchemaInput) =>
    v.parse(flowsSearchSchema, input),
  search: {
    middlewares: [stripSearchParams(flowsSearchDefaults)],
  },
  errorComponent: ({ error }) => {
    return (
      <div className="flex flex-col items-center w-full gap-y-3">
        <div>{error.message}</div>
      </div>
    );
  },
});

function FlowItem({
  flow,
  disabled,
}: Readonly<{
  flow: RouterOutput['flows']['all'][number];
  disabled: boolean;
}>) {
  return (
    <Link
      to="/flows/$flowid"
      params={{ flowid: flow.id }}
      className="border border-gray-500 bg-elevated p-4 w-full flex items-center justify-between gap-3 rounded-xl hover:brightness-90"
      disabled={disabled}
    >
      <div className="flex flex-col gap-y-1">
        <div className="text-lg font-bold line-clamp-3 wrap-anywhere">
          {flow.title}
        </div>
        <div className="italic text-sm">
          {new Date(flow.createdAt).toLocaleString()}
        </div>
      </div>

      <DeleteFlowButton flowId={flow.id}>
        <TrashIcon />
      </DeleteFlowButton>
    </Link>
  );
}

function RouteComponent() {
  const { data: flows, isPending } = useQuery(
    apiClient.flows.all.queryOptions(),
  );
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  const updateFilters = (name: keyof FlowSearchSchema, value: unknown) => {
    navigate({ search: (prev: FlowSearchSchema) => ({ ...prev, [name]: value }) });
  };

  /**
   * You could memoize flows, although if you use the react 19 compiler
   * (which RT-stack will in the future), it won't be necessary.
   */
  const lowercaseSearch = search.searchString.toLowerCase();
  const filteredFlow = flows
    ?.filter((p) => p.title.toLowerCase().includes(lowercaseSearch))
    ?.sort((a, b) =>
      search.sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  return (
    <div className="flex flex-col p-1.5 md:p-4 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Flows</h1>
        <CreateFlowButton />
      </div>
      <hr className="mt-4 border-b-2 border-gray-400" />

      <div className="mt-4 flex justify-end items-center relative gap-x-2">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button
                variant="link"
                className="w-12 border border-input hover:brightness-150"
                onClick={() =>
                  updateFilters(
                    'sortDirection',
                    search.sortDirection === 'asc' ? 'desc' : 'asc',
                  )
                }
              >
                {search.sortDirection === 'asc' ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              sideOffset={4}
              onPointerDownOutside={(e) => e.preventDefault()}
              className="bg-neutral-500 fill-neutral-500 duration-0"
            >
              <span>Sort by created date ({search.sortDirection})</span>
              <TooltipArrow width={15} height={10} className="duration-0" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="relative sm:max-w-64 w-full">
          <Input
            value={search.searchString}
            onChange={(e) => updateFilters('searchString', e.target.value)}
            placeholder="Search by title..."
            className="w-full pr-10 placeholder:italic peer"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-input peer-focus:text-foreground transition-colors" />
        </div>
      </div>

      <div className="flex gap-x-3 gap-y-3 flex-wrap my-4 md:my-6">
        {filteredFlow?.length
          ? filteredFlow.map((p) => (
              <FlowItem key={p.id} flow={p} disabled={isPending} />
            ))
          : 'There are no flows available.'}
      </div>
    </div>
  );
}
