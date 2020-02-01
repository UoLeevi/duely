import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function createService(obj, { agencyUuid, name }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

    // create service on database
    const res = await client.query('SELECT uuid_ FROM operation_.create_service_($1::uuid, $2::text)', [agencyUuid, name]);
    const serviceUuid = res.rows[0].uuid_;

    // success
    return {
      success: true,
      serviceUuid,
      type: 'CreateServiceResult'
    };

  } catch (error) {
    return {
      // error
      success: false,
      message: error.message,
      type: 'CreateServiceResult'
    };
  }
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};