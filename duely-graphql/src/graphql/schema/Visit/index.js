import { pool, withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export const Visit = {
  typeDef: `
    extend type Mutation {
      begin_visit: BeginVisitResult!
      end_visit: SimpleResult!
    }

    type BeginVisitResult implements MutationResult {
      success: Boolean!
      message: String
      jwt: String
    }
  `,
  resolvers: {
    Mutation: {
      async begin_visit(obj, args, context, info) {
        const client = await pool.connect();
        try {
          const res = await client.query('SELECT * FROM operation_.begin_visit_() jwt_');
          return {
            success: true,
            jwt: res.rows[0].jwt_,
            type: 'BeginVisitResult'
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
            type: 'BeginVisitResult'
          };
        }
        finally {
          client.release();
        }
      },
      async end_visit(obj, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ client }) => {
              const res = await client.query('SELECT operation_.end_visit_()');
              return {
                success: true,
                type: 'SimpleResult'
              };

            });
          });
        } catch (error) {
          return {
            success: false,
            message: error.message,
            type: 'SimpleResult'
          };
        }
      }
    }
  }
};