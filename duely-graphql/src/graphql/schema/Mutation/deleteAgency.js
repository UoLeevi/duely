import pool from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function deleteAgency(obj, { agencyUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
    const res = await client.query('SELECT uuid_ FROM operation_.delete_agency_($1::uuid)', [agencyUuid]);
    await client.query('SELECT operation_.end_session_()');
    return {
      success: true,
      agencyUuid: res.rows[0].uuid_,
      type: 'DeleteAgencyResult'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      type: 'DeleteAgencyResult'
    };
  }
  finally {
    client.release();
  }
};