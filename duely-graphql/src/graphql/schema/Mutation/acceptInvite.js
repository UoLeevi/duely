import { withConnection } from '../../../db';

export default async function acceptInvite(obj, { inviteUuid }, context, info) {
  if (!context.jwt)
    throw new Error('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT uuid_ FROM operation_.accept_user_invite_($1::uuid)', [inviteUuid]);

        // success
        return {
          success: true,
          invite: res.rows[0],
          type: 'AcceptInviteResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'AcceptInviteResult'
        };
      }
    });
  });
};
