import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function agency(obj, { uuid, subdomainName }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  if (!uuid && typeof subdomainName !== 'string')
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = uuid
        ? await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [uuid])
        : await client.query('SELECT * FROM operation_.query_agency_by_subdomain_name_($1::text)', [subdomainName])

        return res.rows.length === 1 ? res.rows[0] : null;
      } catch (error) {
        throw new AuthenticationError(error.message);
      }
    });
  });
};
