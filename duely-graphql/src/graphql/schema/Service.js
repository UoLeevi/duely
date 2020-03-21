import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

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
          throw new AuthenticationError('Unauthorized');

        if (service.image_logo_uuid_ === null)
          return null;

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_image_($1::uuid)', [service.image_logo_uuid_]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows.length === 1 ? res.rows[0] : null;
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          client.release();
        }
      },
      async imageHero(service, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (service.image_hero_uuid_ === null)
          return null;

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_image_($1::uuid)', [service.image_hero_uuid_]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows.length === 1 ? res.rows[0] : null;
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          client.release();
        }
      },
      async agency(service, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [service.agency_uuid_]);
          return res.rows[0];
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          await client.query('SELECT operation_.end_session_()');
          client.release();
        }
      },
      async steps(service, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_service_step_by_service_($1::uuid)', [service.uuid_]);
          return res.rows;
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          await client.query('SELECT operation_.end_session_()');
          client.release();
        }
      }
    }
  }
};
