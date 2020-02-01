import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type Image implements Node {
      uuid: ID!
      name: String!
      data: String!
      color: String!
      agency: Agency
    }
  `,
  resolvers: {
    Theme: {
      uuid: source => source.uuid_,
      name: source => source.name_,
      data: source => source.data_,
      color: source => source.color_,
      async agency(image, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (image.agency_uuid_ === null)
          return null;

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [image.agency_uuid_]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows[0];
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          client.release();
        }
      }
    }
  }
};
