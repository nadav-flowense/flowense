import { Pencil1Icon } from '@radix-ui/react-icons';
import { appConfig } from '@repo/config/app';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@repo/ui';
import { CreateOrganizationForm } from '@repo/ui/components/organization';
import { createFileRoute, Navigate, useRouter } from '@tanstack/react-router';
import { authClient, organizationQueryOptions } from '@/clients/authClient';
import { queryClient } from '@/clients/queryClient';

export const Route = createFileRoute('/(app)/onboarding')({
  component: RouteComponent,
  pendingComponent: OnboardingSkeleton,
  loader: async ({ context }) => {
    const [sessionResult, organizations] = await Promise.all([
      authClient.getSession(),
      context.queryClient.ensureQueryData(organizationQueryOptions.list()),
    ]);

    return { session: sessionResult.data, organizations };
  },
});

function RouteComponent() {
  const { session, organizations } = Route.useLoaderData();
  const router = useRouter();

  // If user already has an organization, redirect to flows
  if (organizations.length > 0) {
    return <Navigate to={appConfig.appRoutes.flows} />;
  }

  const handleCreateOrganization = async (data: {
    name: string;
    slug: string;
  }) => {
    await authClient.organization.create({
      name: data.name,
      slug: data.slug,
    });

    // Invalidate organization list cache
    await queryClient.invalidateQueries({
      queryKey: ['organizations', 'list'],
    });

    // Refresh the router to re-run the loader
    await router.invalidate();
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="relative w-full max-w-xs sm:max-w-sm">
        <CardHeader className="border-none bg-transparent shadow-none">
          <div className="flex flex-col items-center text-center">
            <Pencil1Icon className="size-10 mb-2" />
            <CardTitle className="font-semibold text-xl">
              Create your organization
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {session?.user?.name ? `Welcome, ${session.user.name}! ` : ''}
              Create your organization to get started.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CreateOrganizationForm onSubmit={handleCreateOrganization} />
        </CardContent>
      </Card>
    </div>
  );
}

function OnboardingSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="relative w-full max-w-xs sm:max-w-sm">
        <CardHeader className="border-none bg-transparent shadow-none">
          <div className="flex flex-col items-center gap-2 text-center">
            <Skeleton className="size-10 rounded-md" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
