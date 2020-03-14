import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function declineInvite(obj, { inviteUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
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
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};
