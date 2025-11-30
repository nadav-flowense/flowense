import { PlusIcon, CheckIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import {
  authClient,
  organizationQueryOptions,
  type Organization,
} from '@/clients/authClient';
import { queryClient } from '@/clients/queryClient';

export const Route = createFileRoute('/(app)/organizations/')({
  component: RouteComponent,
  pendingComponent: OrganizationsSkeleton,
  loader: async ({ context }) => {
    const [organizations, session] = await Promise.all([
      context.queryClient.ensureQueryData({
        ...organizationQueryOptions.list(),
        revalidateIfStale: true,
      }),
      authClient.getSession(),
    ]);

    return { organizations, activeOrgId: session.data?.session?.activeOrganizationId };
  },
});

function RouteComponent() {
  const { organizations, activeOrgId } = Route.useLoaderData();
  const router = useRouter();

  const handleSetActive = async (org: Organization) => {
    await authClient.organization.setActive({ organizationId: org.id });
    await queryClient.invalidateQueries({ queryKey: ['organizations'] });
    await router.invalidate();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">
            Your Organizations
          </h1>
          <p className="text-md text-muted-foreground">
            Manage your organizations and select an active one
          </p>
        </div>
        <Link to="/organizations/create">
          <Button size="sm">
            <PlusIcon className="mr-1" />
            Create Organization
          </Button>
        </Link>
      </div>

      {organizations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              You don't have any organizations yet.
            </p>
            <Link to="/organizations/create" className="mt-4 inline-block">
              <Button variant="outline">Create your first organization</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {organizations.map((org: Organization) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              isActive={org.id === activeOrgId}
              onSetActive={() => handleSetActive(org)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrganizationCard({
  organization,
  isActive,
  onSetActive,
}: {
  organization: Organization;
  isActive: boolean;
  onSetActive: () => void;
}) {
  return (
    <Card
      className={`transition-all duration-200 ${
        isActive ? 'border-primary/50 bg-primary/5' : 'hover:border-primary/20'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{organization.name}</CardTitle>
          {isActive && (
            <span className="flex items-center text-sm text-primary">
              <CheckIcon className="mr-1 h-4 w-4" />
              Active
            </span>
          )}
        </div>
        <CardDescription className="font-mono text-xs">
          {organization.slug}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Created {new Date(organization.createdAt).toLocaleDateString()}
          </span>
          {!isActive && (
            <Button variant="outline" size="sm" onClick={onSetActive}>
              Set Active
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OrganizationsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
