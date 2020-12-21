import { withConnection } from '../../../db';

export default async function service(obj, { uuid }, context, info) {
  if (!context.jwt)
    throw new Error('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT * FROM operation_.query_service_($1::uuid)', [uuid]);
        return res.rows.length === 1 ? res.rows[0] : null;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  });
};
