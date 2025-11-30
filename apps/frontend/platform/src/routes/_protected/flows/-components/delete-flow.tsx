import { Button } from '@repo/ui/components/button';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { cn } from '@repo/ui/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/clients/apiClient';
import Spinner from '@/routes/-components/common/spinner';

export default function DeleteFlowButton({
  children,
  className,
  flowId,
}: Readonly<{
  children: ReactNode;
  className?: string;
  flowId: string;
}>) {
  const { refetch } = useQuery(apiClient.flows.all.queryOptions());

  const deleteFlowMutation = useMutation(
    apiClient.flows.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        await refetch();
        toast.info('Flow deleted successfully.');
      },
    }),
  );
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={deleteFlowMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              deleteFlowMutation.mutate({ id: flowId });
            }}
            variant="destructive"
            className={cn('h-9 w-10', className)}
          >
            {deleteFlowMutation.isPending ? <Spinner /> : children}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          align="center"
          sideOffset={4}
          className="bg-neutral-500 fill-neutral-500 duration-0"
        >
          <span>Delete Flow</span>
          <TooltipArrow width={15} height={10} className="duration-0" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
