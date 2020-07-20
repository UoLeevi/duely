import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function declineInvite(obj, { inviteUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT uuid_ FROM operation_.decline_user_invite_($1::uuid)', [inviteUuid]);

        // success
        return {
          success: true,
          invite: res.rows[0],
          type: 'DeclineInviteResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'DeclineInviteResult'
        };
      }
    });
  });
};
