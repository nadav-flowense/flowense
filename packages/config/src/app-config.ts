export const appConfig = {
  authRoutes: {
    signin: '/signin',
    signup: '/signup',
    onboarding: '/onboarding',
  },
  appRoutes: {
    dashboard: '/',
    organizations: '/organizations',
    flows: '/flows',
  },
} as const;

export type AppConfig = typeof appConfig;
