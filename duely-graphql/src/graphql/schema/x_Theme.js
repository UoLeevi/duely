import { withConnection } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type Theme implements Node {
      uuid: ID!
      name: String!
      imageLogo: Image
      imageHero: Image
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
      async imageLogo(theme, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (theme.image_logo_uuid_ === null)
          return null;

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_image_($1::uuid)', [theme.image_logo_uuid_]);
              return res.rows.length === 1 ? res.rows[0] : null;
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
      },
      async imageHero(theme, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (theme.image_hero_uuid_ === null)
          return null;

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_image_($1::uuid)', [theme.image_hero_uuid_]);
              return res.rows.length === 1 ? res.rows[0] : null;
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
      },
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

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [theme.agency_uuid_]);
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
