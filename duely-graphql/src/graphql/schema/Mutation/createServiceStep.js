import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function createServiceStep(obj, { serviceUuid, name, type, previousServiceStepUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

    // create service step on database
    const res = await client.query('SELECT uuid_ FROM operation_.create_service_step_($1::uuid, $2::text, $3::text, $4::uuid)', [serviceUuid, name, type.toLowerCase(), previousServiceStepUuid]);
    const serviceStepUuid = res.rows[0].uuid_;

    // success
    return {
      success: true,
      serviceStepUuid,
      type: 'CreateServiceStepResult'
    };

  } catch (error) {
    return {
      // error
      success: false,
      message: error.message,
      type: 'CreateServiceStepResult'
    };
  }
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};