import { pool } from '../../db';

export default {
  typeDef: `
    type InviteUserResult implements MutationResult {
      success: Boolean!
      message: String
      invite: Invite
    }
  `,
  InviteUserResult: {
    Invite: {
      async invite(result, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_user_invite_($1::uuid)', [result.inviteUuid]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows[0];
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          client.release();
        }
      }
    }
  }
};
