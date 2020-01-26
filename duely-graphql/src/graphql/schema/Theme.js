import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type Theme implements Node {
      uuid: ID!
      name: String!
      imageLogo: String!
      imageHero: String!
      colorPrimary: String!
      colorSecondary: String!
      colorAccent: String!
      colorBackground: String!
      colorSurface: String!
      colorError: String!
      colorSuccess: String!
      agency: Agency
    }
  `,
  resolvers: {
    Theme: {
      uuid: source => source.uuid_,
      name: source => source.name_,
      imageLogo: source => source.image_logo_,
      imageHero: source => source.image_hero_,
      colorPrimary: source => source.color_primary_,
      colorSecondary: source => source.color_secondary_,
      colorAccent: source => source.color_accent_,
      colorBackground: source => source.color_background_,
      colorSurface: source => source.color_surface_,
      colorError: source => source.color_error_,
      colorSuccess: source => source.color_success_,
      async agency(theme, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (theme.agency_uuid_ === null)
          return null;

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [theme.agency_uuid_]);
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
