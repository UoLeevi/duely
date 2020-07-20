import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function endVisit(obj, args, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT operation_.end_visit_()');
        return {
          success: true,
          type: 'EndVisitResult'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          type: 'EndVisitResult'
        };
      }
    });
  });
};
