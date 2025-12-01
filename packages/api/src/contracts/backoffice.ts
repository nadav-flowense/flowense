import { oc } from '@orpc/contract';
import * as v from 'valibot';

const backofficeErrors = {
  NOT_AUTHORIZED: {
    status: 403,
    data: v.object({
      message: v.string(),
    }),
  },
  ALREADY_EXISTS: {
    status: 409,
    data: v.object({
      email: v.string(),
    }),
  },
  INVITATION_NOT_FOUND: {
    status: 404,
    data: v.object({
      message: v.string(),
    }),
  },
  INVITATION_EXPIRED: {
    status: 410,
    data: v.object({
      message: v.string(),
    }),
  },
} as const;

/**
 * Backoffice management contract
 * For managing authorized emails and invitations to the backoffice
 */
const backofficeContract = oc
  .prefix('/backoffice')
  .tag('backoffice')
  .router({
    /**
     * List all authorized emails (admin only)
     */
    listAuthorizedEmails: oc
      .route({
        method: 'GET',
        path: '/authorized-emails',
        summary: 'List authorized emails',
        description:
          'Retrieve all emails authorized to access the backoffice. Requires admin role.',
      })
      .output(
        v.array(
          v.object({
            id: v.string(),
            email: v.string(),
            role: v.picklist(['admin', 'backoffice']),
            isOwner: v.boolean(),
            invitedAt: v.nullable(v.string()),
            acceptedAt: v.nullable(v.string()),
            invitedBy: v.nullable(
              v.object({
                id: v.string(),
                name: v.string(),
              }),
            ),
          }),
        ),
      ),

    /**
     * Invite a new backoffice user (admin only)
     */
    inviteUser: oc
      .route({
        method: 'POST',
        path: '/invite',
        summary: 'Invite a backoffice user',
        description:
          'Add an email to the authorized list and send an invitation. Requires admin role.',
      })
      .errors(backofficeErrors)
      .input(
        v.object({
          email: v.pipe(v.string(), v.email()),
          role: v.optional(v.picklist(['admin', 'backoffice']), 'backoffice'),
        }),
      )
      .output(
        v.object({
          id: v.string(),
          email: v.string(),
          role: v.string(),
          invitationToken: v.string(),
        }),
      ),

    /**
     * Resend invitation email (admin only)
     */
    resendInvitation: oc
      .route({
        method: 'POST',
        path: '/invite/{email}/resend',
        summary: 'Resend invitation',
        description:
          'Resend the invitation email to a pending authorized email. Requires admin role.',
      })
      .errors(backofficeErrors)
      .input(
        v.object({
          email: v.pipe(v.string(), v.email()),
        }),
      )
      .output(
        v.object({
          success: v.boolean(),
          invitationToken: v.string(),
        }),
      ),

    /**
     * Remove an authorized email (admin only)
     */
    removeAuthorizedEmail: oc
      .route({
        method: 'DELETE',
        path: '/authorized-emails/{email}',
        summary: 'Remove authorized email',
        description:
          'Remove an email from the authorized list. Cannot remove owners. Requires admin role.',
      })
      .errors(backofficeErrors)
      .input(
        v.object({
          email: v.pipe(v.string(), v.email()),
        }),
      )
      .output(v.object({ success: v.boolean() })),

    /**
     * Update role of an authorized email (admin only)
     */
    updateRole: oc
      .route({
        method: 'PATCH',
        path: '/authorized-emails/{email}/role',
        summary: 'Update user role',
        description:
          'Update the role of an authorized email. Cannot change owner roles. Requires admin role.',
      })
      .errors(backofficeErrors)
      .input(
        v.object({
          email: v.pipe(v.string(), v.email()),
          role: v.picklist(['admin', 'backoffice']),
        }),
      )
      .output(v.object({ success: v.boolean() })),

    /**
     * Validate an invitation token (public)
     */
    validateInvitation: oc
      .route({
        method: 'GET',
        path: '/invitation/{token}',
        summary: 'Validate invitation token',
        description:
          'Check if an invitation token is valid and return associated email and role.',
      })
      .errors(backofficeErrors)
      .input(
        v.object({
          token: v.string(),
        }),
      )
      .output(
        v.object({
          valid: v.boolean(),
          email: v.string(),
          role: v.string(),
        }),
      ),

    /**
     * Accept invitation and create account (public)
     * Note: Actual user creation happens through Better Auth sign-up
     * This endpoint marks the invitation as used
     */
    markInvitationUsed: oc
      .route({
        method: 'POST',
        path: '/invitation/{token}/accept',
        summary: 'Mark invitation as used',
        description:
          'Mark an invitation token as used after successful account creation.',
      })
      .errors(backofficeErrors)
      .input(
        v.object({
          token: v.string(),
        }),
      )
      .output(v.object({ success: v.boolean() })),
  });

export default backofficeContract;
