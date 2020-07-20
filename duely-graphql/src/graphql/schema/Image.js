import { withConnection } from '../../db';
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
    Image: {
      uuid: source => source.uuid_,
      name: source => source.name_,
      data: source => source.data_,
      color: source => source.color_,
      async agency(image, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (image.agency_uuid_ === null)
          return null;

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [image.agency_uuid_]);
              return res.rows[0];
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
      }
    }
  }
};
