import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function deleteServiceStep(obj, { serviceStepUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
    const res = await client.query('SELECT uuid_ FROM operation_.delete_service_step_($1::uuid)', [serviceStepUuid]);

    // success
    return {
      success: true,
      serviceStepUuid: res.rows[0].uuid_,
      type: 'DeleteServiceStepResult'
    };

  } catch (error) {
    return {
      // error
      success: false,
      message: error.message,
      type: 'DeleteServiceStepResult'
    };
  }
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};