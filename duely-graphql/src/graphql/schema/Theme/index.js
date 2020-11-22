import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../util';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';
import stripe from '../../../stripe';

const resource = {
  name: 'theme'
};

export const Theme = {
  typeDef: `
    type Theme implements Node {
      id: ID!
      agency: Agency!
      name: String!
      image_logo: Image
      image_hero: Image
      color_primary: String
      color_secondary: String
      color_accent: String
      color_background: String,
      color_surface: String
      color_error: String
      color_success: String
    }

    input ThemeFilter {
      name: String
      agency_id: String
    }

    extend type Query {
      theme(id: ID!): Theme
      themes(filter: ThemeFilter!): [Theme!]
    }

    extend type Mutation {
      update_theme(theme_id: ID!, image_logo_id: ID, image_hero_id: ID, color_primary: String, color_secondary: String, color_accent: String, color_background: String, color_surface: String, color_error: String, color_success: String): UpdateThemeResult!
    }

    type UpdateThemeResult implements MutationResult {
      success: Boolean!
      message: String
      theme: Theme
    }
  `,
  resolvers: {
    Theme: {
      ...createResolverForReferencedResource({ name: 'agency' }),
      ...createResolverForReferencedResource({ name: 'image_logo' }),
      ...createResolverForReferencedResource({ name: 'image_hero' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async update_theme(obj, { theme_id, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // update theme resource
              const theme = await updateResource(theme_id, args);

              // success
              return {
                success: true,
                theme,
                type: 'UpdateThemeResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'UpdateThemeResult'
          };
        }
      }
    }
  }
};
