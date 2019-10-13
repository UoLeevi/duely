import pool from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function agency(obj, { uuid, subdomainName }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

    const res = !uuid && typeof subdomainName !== 'string'
      ? await client.query('SELECT * FROM operation_.query_agency_()')
      : uuid
        ? await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [uuid])
        : await client.query('SELECT * FROM operation_.query_agency_by_subdomain_name_($1::text)', [subdomainName])

    await client.query('SELECT operation_.end_session_()');
    return res.rows;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
  finally {
    client.release();
  }
};
