import * as v from 'valibot';

const DEFAULT_SERVER_PORT = 3035;
const DEFAULT_SERVER_HOST = 'localhost';

const createPortSchema = ({ defaultPort }: { defaultPort: number }) =>
  v.pipe(
    v.optional(v.string(), `${defaultPort}`),
    v.transform((s) => parseInt(s, 10)),
    v.integer(),
    v.minValue(0),
    v.maxValue(65535),
  );

export const envSchema = v.object({
  SERVER_PORT: createPortSchema({ defaultPort: DEFAULT_SERVER_PORT }),
  SERVER_HOST: v.pipe(
    v.optional(v.string(), DEFAULT_SERVER_HOST),
    v.minLength(1),
  ),
  SERVER_AUTH_SECRET: v.pipe(v.string(), v.minLength(1)),
  SERVER_POSTGRES_URL: v.string(),

  // Backend URL, used to configure OpenAPI (Scalar)
  PUBLIC_SERVER_URL: v.pipe(v.string(), v.url()),
  PUBLIC_SERVER_API_PATH: v.optional(
    v.custom<`/${string}`>(
      (input) => typeof input === 'string' && input.startsWith('/'),
      'API Path must start with "/" if provided.',
    ),
    '/api',
  ),

  // Frontend URL, used to configure trusted origin (CORS)
  PUBLIC_PLATFORM_URL: v.pipe(v.string(), v.url()),
  PUBLIC_BACKOFFICE_URL: v.pipe(v.string(), v.url()),

  // Stripe configuration (optional - leave empty to disable Stripe integration)
  STRIPE_SECRET_KEY: v.optional(v.string()),
  STRIPE_WEBHOOK_SECRET: v.optional(v.string()),
  // Stripe Price IDs for subscription plans
  STRIPE_FREE_PRICE_ID: v.optional(v.string()),
  STRIPE_STARTER_PRICE_ID: v.optional(v.string()),
  STRIPE_STARTER_ANNUAL_PRICE_ID: v.optional(v.string()),
  STRIPE_PRO_PRICE_ID: v.optional(v.string()),
  STRIPE_PRO_ANNUAL_PRICE_ID: v.optional(v.string()),
  STRIPE_ENTERPRISE_PRICE_ID: v.optional(v.string()),
});

export const env = v.parse(envSchema, process.env);

/**
 * Get Stripe configuration from environment variables
 * Returns undefined if Stripe is not configured
 */
export function getStripeConfig() {
  if (
    !env.STRIPE_SECRET_KEY ||
    !env.STRIPE_WEBHOOK_SECRET ||
    !env.STRIPE_FREE_PRICE_ID ||
    !env.STRIPE_STARTER_PRICE_ID ||
    !env.STRIPE_PRO_PRICE_ID
  ) {
    return undefined;
  }

  return {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    prices: {
      free: env.STRIPE_FREE_PRICE_ID,
      starter: env.STRIPE_STARTER_PRICE_ID,
      starterAnnual: env.STRIPE_STARTER_ANNUAL_PRICE_ID,
      pro: env.STRIPE_PRO_PRICE_ID,
      proAnnual: env.STRIPE_PRO_ANNUAL_PRICE_ID,
      enterprise: env.STRIPE_ENTERPRISE_PRICE_ID,
    },
  };
}
