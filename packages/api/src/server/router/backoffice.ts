import { and, eq, isNull } from '@repo/db';
import {
  backofficeAuthorizedEmail,
  backofficeInvitationToken,
  user,
} from '@repo/db/schema';
import { adminProcedure, publicProcedure } from '../orpc';

/**
 * Generate a secure random invitation token
 */
function generateInvitationToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

/**
 * Backoffice management router
 *
 * Admin-only routes for managing authorized emails and invitations.
 * Public routes for validating and accepting invitations.
 */
const backofficeRouter = {
  /**
   * List all authorized emails (admin only)
   */
  listAuthorizedEmails: adminProcedure.backoffice.listAuthorizedEmails.handler(
    async ({ context }) => {
      const authorized = await context.db
        .select({
          id: backofficeAuthorizedEmail.id,
          email: backofficeAuthorizedEmail.email,
          role: backofficeAuthorizedEmail.role,
          isOwner: backofficeAuthorizedEmail.isOwner,
          invitedAt: backofficeAuthorizedEmail.invitedAt,
          acceptedAt: backofficeAuthorizedEmail.acceptedAt,
          invitedBy: {
            id: user.id,
            name: user.name,
          },
        })
        .from(backofficeAuthorizedEmail)
        .leftJoin(user, eq(backofficeAuthorizedEmail.invitedBy, user.id));

      return authorized.map((row) => ({
        id: row.id,
        email: row.email,
        role: row.role as 'admin' | 'backoffice',
        isOwner: row.isOwner ?? false,
        invitedAt: row.invitedAt?.toISOString() ?? null,
        acceptedAt: row.acceptedAt?.toISOString() ?? null,
        invitedBy: row.invitedBy?.id ? row.invitedBy : null,
      }));
    },
  ),

  /**
   * Invite a new backoffice user (admin only)
   */
  inviteUser: adminProcedure.backoffice.inviteUser.handler(
    async ({ context, input, errors }) => {
      const email = input.email.toLowerCase();
      const role = input.role ?? 'backoffice';

      // Check if email already exists
      const existing = await context.db.query.backofficeAuthorizedEmail.findFirst({
        where: eq(backofficeAuthorizedEmail.email, email),
      });

      if (existing) {
        throw errors.ALREADY_EXISTS({
          data: { email },
        });
      }

      // Create authorized email entry
      const [authorized] = await context.db
        .insert(backofficeAuthorizedEmail)
        .values({
          email,
          role,
          invitedBy: context.session.user.id,
          invitedAt: new Date(),
        })
        .returning();

      if (!authorized) {
        throw new Error('Failed to create authorized email entry');
      }

      // Generate invitation token
      const token = generateInvitationToken();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

      await context.db.insert(backofficeInvitationToken).values({
        email,
        token,
        expiresAt,
      });

      // TODO: Send invitation email with token

      return {
        id: authorized.id,
        email: authorized.email,
        role: authorized.role,
        invitationToken: token,
      };
    },
  ),

  /**
   * Resend invitation email (admin only)
   */
  resendInvitation: adminProcedure.backoffice.resendInvitation.handler(
    async ({ context, input, errors }) => {
      const email = input.email.toLowerCase();

      // Check if email is authorized and hasn't accepted yet
      const authorized = await context.db.query.backofficeAuthorizedEmail.findFirst({
        where: and(
          eq(backofficeAuthorizedEmail.email, email),
          isNull(backofficeAuthorizedEmail.acceptedAt),
        ),
      });

      if (!authorized) {
        throw errors.INVITATION_NOT_FOUND({
          data: { message: 'No pending invitation found for this email' },
        });
      }

      // Invalidate old tokens by marking them as used
      await context.db
        .update(backofficeInvitationToken)
        .set({ usedAt: new Date() })
        .where(
          and(
            eq(backofficeInvitationToken.email, email),
            isNull(backofficeInvitationToken.usedAt),
          ),
        );

      // Generate new token
      const token = generateInvitationToken();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

      await context.db.insert(backofficeInvitationToken).values({
        email,
        token,
        expiresAt,
      });

      // TODO: Send invitation email with token

      return {
        success: true,
        invitationToken: token,
      };
    },
  ),

  /**
   * Remove an authorized email (admin only)
   */
  removeAuthorizedEmail: adminProcedure.backoffice.removeAuthorizedEmail.handler(
    async ({ context, input, errors }) => {
      const email = input.email.toLowerCase();

      // Check if email exists
      const authorized = await context.db.query.backofficeAuthorizedEmail.findFirst({
        where: eq(backofficeAuthorizedEmail.email, email),
      });

      if (!authorized) {
        throw errors.INVITATION_NOT_FOUND({
          data: { message: 'Email not found in authorized list' },
        });
      }

      // Cannot remove owners
      if (authorized.isOwner) {
        throw errors.NOT_AUTHORIZED({
          data: { message: 'Cannot remove owner from authorized list' },
        });
      }

      // Delete the authorized email
      await context.db
        .delete(backofficeAuthorizedEmail)
        .where(eq(backofficeAuthorizedEmail.email, email));

      // Also delete any pending invitation tokens
      await context.db
        .delete(backofficeInvitationToken)
        .where(eq(backofficeInvitationToken.email, email));

      return { success: true };
    },
  ),

  /**
   * Update role of an authorized email (admin only)
   */
  updateRole: adminProcedure.backoffice.updateRole.handler(
    async ({ context, input, errors }) => {
      const email = input.email.toLowerCase();

      // Check if email exists
      const authorized = await context.db.query.backofficeAuthorizedEmail.findFirst({
        where: eq(backofficeAuthorizedEmail.email, email),
      });

      if (!authorized) {
        throw errors.INVITATION_NOT_FOUND({
          data: { message: 'Email not found in authorized list' },
        });
      }

      // Cannot change owner roles
      if (authorized.isOwner) {
        throw errors.NOT_AUTHORIZED({
          data: { message: 'Cannot change role of owner' },
        });
      }

      // Update the role
      await context.db
        .update(backofficeAuthorizedEmail)
        .set({ role: input.role })
        .where(eq(backofficeAuthorizedEmail.email, email));

      // Also update user role if they've already signed up
      if (authorized.acceptedAt) {
        await context.db
          .update(user)
          .set({ role: input.role })
          .where(eq(user.email, email));
      }

      return { success: true };
    },
  ),

  /**
   * Validate an invitation token (public)
   */
  validateInvitation: publicProcedure.backoffice.validateInvitation.handler(
    async ({ context, input, errors }) => {
      const invitation = await context.db.query.backofficeInvitationToken.findFirst({
        where: and(
          eq(backofficeInvitationToken.token, input.token),
          isNull(backofficeInvitationToken.usedAt),
        ),
      });

      if (!invitation) {
        throw errors.INVITATION_NOT_FOUND({
          data: { message: 'Invitation not found or already used' },
        });
      }

      if (new Date() > invitation.expiresAt) {
        throw errors.INVITATION_EXPIRED({
          data: { message: 'Invitation has expired' },
        });
      }

      // Get authorized email info
      const authorized = await context.db.query.backofficeAuthorizedEmail.findFirst({
        where: eq(backofficeAuthorizedEmail.email, invitation.email),
      });

      if (!authorized) {
        throw errors.INVITATION_NOT_FOUND({
          data: { message: 'Email no longer authorized' },
        });
      }

      return {
        valid: true,
        email: invitation.email,
        role: authorized.role,
      };
    },
  ),

  /**
   * Mark invitation as used (public - called after successful sign-up)
   */
  markInvitationUsed: publicProcedure.backoffice.markInvitationUsed.handler(
    async ({ context, input, errors }) => {
      const invitation = await context.db.query.backofficeInvitationToken.findFirst({
        where: and(
          eq(backofficeInvitationToken.token, input.token),
          isNull(backofficeInvitationToken.usedAt),
        ),
      });

      if (!invitation) {
        throw errors.INVITATION_NOT_FOUND({
          data: { message: 'Invitation not found or already used' },
        });
      }

      if (new Date() > invitation.expiresAt) {
        throw errors.INVITATION_EXPIRED({
          data: { message: 'Invitation has expired' },
        });
      }

      // Mark token as used
      await context.db
        .update(backofficeInvitationToken)
        .set({ usedAt: new Date() })
        .where(eq(backofficeInvitationToken.token, input.token));

      return { success: true };
    },
  ),
};

export default backofficeRouter;
