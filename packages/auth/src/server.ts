import type { DatabaseInstance } from '@repo/db/client';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, openAPI, organization } from 'better-auth/plugins';
import urlJoin from 'url-join';

export interface AuthOptions {
  platformUrl: string;
  backofficeUrl: string;
  serverUrl: string;
  apiPath: `/${string}`;
  authSecret: string;
  db: DatabaseInstance;
}

export type AuthInstance = ReturnType<typeof createAuth>;

export const createAuth = ({
  platformUrl,
  backofficeUrl,
  serverUrl,
  apiPath,
  db,
  authSecret,
}: AuthOptions) => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    baseURL: urlJoin(serverUrl, apiPath, 'auth'),
    secret: authSecret,
    trustedOrigins: [platformUrl, backofficeUrl].map(
      (url) => new URL(url).origin,
    ),
    plugins: [openAPI(), admin(), organization()],
    onAPIError: {
      throw: true,
      onError: (error) => {
        console.error('auth onAPIError', error);
      },
      errorURL: '/signin',
    },
    user: {
      deleteUser: { enabled: true },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignIn: false,
      sendOnSignUp: false,
      requireEmailVerification: false,
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'email-password', 'github'],
      },
    },
  });
};
