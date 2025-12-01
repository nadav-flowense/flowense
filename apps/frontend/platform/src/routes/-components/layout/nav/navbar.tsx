import { appConfig } from '@repo/config/app';
import { Link } from '@tanstack/react-router';
import type { AuthSession } from '@/clients/authClient';
import NavContainer from '@/routes/-components/layout/nav/nav-container';
import UserAvatar from '@/routes/-components/layout/nav/user-avatar';
import { flowsLinkOptions } from '@/routes/(app)/flows/-validations/flows-link-options';

const activeClassName = 'underline decoration-2 opacity-70';

export function Navbar({ session }: Readonly<{ session: AuthSession }>) {
  return (
    <NavContainer>
      <div className="flex gap-x-4">
        <Link
          to="/"
          activeProps={{ className: activeClassName }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>
        {session?.user ? (
          <Link
            {...flowsLinkOptions}
            activeProps={{ className: activeClassName }}
          >
            Flows
          </Link>
        ) : null}
      </div>
      {session?.user ? (
        <UserAvatar user={session.user} />
      ) : (
        <div className="flex gap-x-2 justify-between">
          <Link
            to={appConfig.authRoutes.signin}
            activeProps={{ className: activeClassName }}
            activeOptions={{ exact: true }}
          >
            Sign in
          </Link>
          <span>|</span>
          <Link
            to={appConfig.authRoutes.signup}
            activeProps={{ className: activeClassName }}
            activeOptions={{ exact: true }}
          >
            Sign up
          </Link>
        </div>
      )}
    </NavContainer>
  );
}
