import { useRouter } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@repo/ui/components/button';

function DefaultError({ error, reset }: Readonly<ErrorComponentProps>) {
  const router = useRouter();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <div className="text-destructive text-6xl">!</div>
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.history.back()}>
          Go Back
        </Button>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}

export default DefaultError;
