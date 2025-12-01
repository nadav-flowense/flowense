import { appConfig } from '@repo/config/app';
import { Button } from '@repo/ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ShieldX } from 'lucide-react';

export const Route = createFileRoute('/(auth)/unauthorized')({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="rounded-full bg-destructive/10 p-4 mb-6">
          <ShieldX className="size-12 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>

        <p className="text-muted-foreground mb-6">
          You don't have permission to access this resource. This may be due to
          your role in the organization or the resource may not exist.
        </p>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/">Go to Home</Link>
          </Button>
          <Button asChild>
            <Link to={appConfig.authRoutes.signin}>Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
