import { ArrowLeftIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { createFileRoute, Link } from '@tanstack/react-router';
import { apiClient } from '@/clients/apiClient';
import { queryClient } from '@/clients/queryClient';
import { flowsLinkOptions } from '@/routes/(app)/flows/-validations/flows-link-options';

export const Route = createFileRoute('/(app)/flows/$flowid/')({
  loader: ({ params }) =>
    queryClient.ensureQueryData(
      apiClient.flows.one.queryOptions({ input: { id: params.flowid } }),
    ),
  component: RouteComponent,
  errorComponent: ({ error, reset }) => {
    return (
      <div className="flex flex-col items-center w-full gap-y-3">
        <div>{error.message}</div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link {...flowsLinkOptions}>
              <ArrowLeftIcon />
              Go Back
            </Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              // Reset the router error boundary
              reset();
            }}
            className="w-full"
          >
            Retry? <ReloadIcon />
          </Button>
        </div>
      </div>
    );
  },
});

function RouteComponent() {
  const flow = Route.useLoaderData();

  return (
    <div className="flex flex-col px-4 w-full max-w-6xl mx-auto wrap-break-word">
      <div className="text-center p-5 rounded-2xl">
        <h1 className="text-2xl md:text-4xl font-bold">{flow.title}</h1>
        <h2 className="text-sm text-gray-500 mt-2">
          Created by <span className="font-medium">{flow.author.name}</span>
        </h2>
        <h2 className="text-sm text-gray-500 mt-1">
          {new Date(flow.createdAt).toLocaleString()}
        </h2>
      </div>
      <hr className="border border-gray-500 mt-3" />

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant="link"
              className="w-12 border border-gray-500 mt-4 md:mt-6 hover:brightness-150"
            >
              <Link {...flowsLinkOptions}>
                <ArrowLeftIcon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            sideOffset={4}
            className="bg-neutral-500 fill-neutral-500 duration-0"
          >
            <span>View all flows</span>
            <TooltipArrow width={15} height={10} className="duration-0" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="bg-elevated shadow rounded-2xl w-full min-h-96 border border-gray-500 p-6 my-4 md:my-6">
        <p className="leading-relaxed whitespace-break-spaces">
          {flow.content ?? 'No content available.'}
        </p>
      </div>
    </div>
  );
}
