import { withConnection } from '../../db';

export default {
  typeDef: `
    type Service implements Node {
      uuid: ID!
      name: String!
      status: String!
      description: String
      duration: String
      price: Int
      currency: String
      imageLogo: Image
      imageHero: Image
      agency: Agency!
      steps: [ServiceStep!]!
    }
  `,
  resolvers: {
    Service: {
      uuid: service => service.uuid_,
      name: service => service.name_,
      status: service => service.status_,
      description: service => service.description_,
      duration: service => service.duration_,
      price: service => service.price_,
      currency: service => service.currency_,
      async imageLogo(service, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        if (service.image_logo_uuid_ === null)
          return null;

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_image_($1::uuid)', [service.image_logo_uuid_]);
              return res.rows.length === 1 ? res.rows[0] : null;
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
      async imageHero(service, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        if (service.image_hero_uuid_ === null)
          return null;

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_image_($1::uuid)', [service.image_hero_uuid_]);
              return res.rows.length === 1 ? res.rows[0] : null;
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
      async agency(service, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [service.agency_uuid_]);
              return res.rows[0];
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
      async steps(service, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_service_step_by_service_($1::uuid)', [service.uuid_]);
              return res.rows;
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      }
    }
  }
};
