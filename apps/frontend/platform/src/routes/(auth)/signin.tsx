import { createFileRoute, Link } from '@tanstack/react-router';
import { appConfig } from '@repo/config/app';
import LoginCredentialsForm from '@/routes/(auth)/-components/login-form';

export const Route = createFileRoute('/(auth)/signin')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2 md:p-6 flex flex-col items-center">
      <div className="border p-4 md:p-8 w-full max-w-md rounded-lg bg-elevated">
        <LoginCredentialsForm />
        <div className="mt-4 text-center">
          {"Don't have an account? "}
          <Link to={appConfig.authRoutes.signup} className="underline">
            Register
          </Link>
          !
        </div>
      </div>
    </div>
  );
}
