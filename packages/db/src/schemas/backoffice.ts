import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { user } from './auth';

/**
 * Backoffice Authorized Email Table
 *
 * Controls who can access the backoffice admin panel.
 * Only pre-approved emails in this whitelist can sign up/sign in to backoffice.
 */
export const backofficeAuthorizedEmail = pgTable(
  'backoffice_authorized_email',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    role: text('role').notNull().default('backoffice'), // 'admin' | 'backoffice'
    invitedBy: text('invited_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    invitedAt: timestamp('invited_at', { withTimezone: true }).defaultNow(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    isOwner: boolean('is_owner').default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

/**
 * Backoffice Invitation Token Table
 *
 * Stores invitation tokens sent to authorized emails.
 * Users click the link with this token to set up their account.
 */
export const backofficeInvitationToken = pgTable('backoffice_invitation_token', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Valibot schemas for validation
export const BackofficeAuthorizedEmailSchema = createSelectSchema(
  backofficeAuthorizedEmail,
);

export const CreateBackofficeInviteSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  role: v.optional(v.picklist(['admin', 'backoffice']), 'backoffice'),
});

export const BackofficeInvitationTokenSchema = createSelectSchema(
  backofficeInvitationToken,
);
