import { createFileRoute, Link } from '@tanstack/react-router';
import { appConfig } from '@repo/config/app';
import RegisterCredentialsForm from '@/routes/(auth)/-components/register-form';

export const Route = createFileRoute('/(auth)/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2 md:p-6 flex flex-col items-center">
      <div className="border p-4 md:p-8 w-full max-w-md rounded-lg bg-elevated">
        <RegisterCredentialsForm />
        <div className="mt-4 text-center">
          Already have an account?{' '}
          <Link to={appConfig.authRoutes.signin} className="underline">
            Sign in
          </Link>
          !
        </div>
      </div>
    </div>
  );
}
