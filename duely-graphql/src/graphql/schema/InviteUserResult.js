import { withConnection } from '../../db';

export default {
  typeDef: `
    type InviteUserResult implements MutationResult {
      success: Boolean!
      message: String
      invite: Invite
    }
  `,
  resolvers: {
    InviteUserResult: {
      async invite(result, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_user_invite_($1::uuid)', [result.inviteUuid]);
              return res.rows[0];
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      }
    }
  }
};
