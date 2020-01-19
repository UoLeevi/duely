import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function logOut(obj, args, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
    const res = await client.query('SELECT operation_.log_out_user_()');
    await client.query('SELECT operation_.end_session_()');
    return {
      success: true,
      type: 'LogOutResult'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      type: 'LogOutResult'
    };
  }
  finally {
    client.release();
  }
};