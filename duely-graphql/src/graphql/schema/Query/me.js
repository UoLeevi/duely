import { withConnection } from '../../../db';

export default async function me(obj, args, context, info) {
  if (!context.jwt)
    throw new Error('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT * FROM operation_.query_active_subject_()');
        return res.rows ? res.rows[0] : null;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  });
};
