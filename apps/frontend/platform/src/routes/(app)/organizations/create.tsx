import { ArrowLeftIcon } from '@radix-ui/react-icons';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { CreateOrganizationForm } from '@repo/ui/components/organization';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { authClient } from '@/clients/authClient';
import { queryClient } from '@/clients/queryClient';

export const Route = createFileRoute('/(app)/organizations/create')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const handleCreateOrganization = async (data: { name: string; slug: string }) => {
    await authClient.organization.create({
      name: data.name,
      slug: data.slug,
    });

    // Invalidate organization list cache
    await queryClient.invalidateQueries({ queryKey: ['organizations', 'list'] });

    // Navigate back to organizations list
    await router.navigate({ to: '/organizations' });
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8">
      <Link to="/organizations">
        <Button variant="ghost" size="sm" className="w-fit">
          <ArrowLeftIcon className="mr-1" />
          Back to Organizations
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create Organization</CardTitle>
          <CardDescription>
            Create a new organization to collaborate with your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrganizationForm onSubmit={handleCreateOrganization} />
        </CardContent>
      </Card>
    </div>
  );
}
