import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import type { InferOutput } from 'valibot';

/**
 * Subscription Plan Limits type
 * Stored as JSONB in the database
 * Using Record type to ensure compatibility with Stripe plugin
 */
export type PlanLimits = Record<string, number> & {
  flows: number; // -1 for unlimited
  members: number; // -1 for unlimited
  executions: number; // -1 for unlimited
};

/**
 * Subscription Plan Table
 * Stores plan configuration including limits, pricing, and features.
 * This is the source of truth for plan definitions in the system.
 */
export const subscriptionPlan = pgTable('subscription_plan', (t) => ({
  id: t.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: t.text().notNull().unique(), // 'free', 'starter', 'pro', 'enterprise'
  displayName: t.text('display_name').notNull(),
  description: t.text(),
  stripePriceId: t.text('stripe_price_id').notNull(),
  stripeAnnualPriceId: t.text('stripe_annual_price_id'),
  // Limits stored as JSONB for flexibility
  limits: t.jsonb().$type<PlanLimits>().notNull(),
  // Trial configuration
  trialDays: t.integer('trial_days').default(0),
  // Ordering for display
  sortOrder: t.integer('sort_order').default(0),
  // Feature flags as JSONB array
  features: t.jsonb().$type<string[]>(),
  isActive: t.boolean('is_active').default(true),
  createdAt: t
    .timestamp('created_at', { mode: 'string', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp('updated_at', { mode: 'string', withTimezone: true })
    .notNull()
    .defaultNow(),
}));

// Valibot schemas derived from drizzle - these are the source of truth for types
export const SubscriptionPlanSchema = createSelectSchema(subscriptionPlan);
export const InsertSubscriptionPlanSchema = createInsertSchema(subscriptionPlan);

// TypeScript types derived from valibot schemas
export type SubscriptionPlan = InferOutput<typeof SubscriptionPlanSchema>;
export type InsertSubscriptionPlan = InferOutput<typeof InsertSubscriptionPlanSchema>;
