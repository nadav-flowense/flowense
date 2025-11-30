import { Link } from '@tanstack/react-router';
import { Button } from '@repo/ui/components/button';

function DefaultNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <div className="text-muted-foreground text-6xl font-bold">404</div>
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}

export default DefaultNotFound;
