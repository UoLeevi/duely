import gql from 'graphql-tag';
import { updateResource } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';

const resource = {
  name: 'theme'
} as const;

export const Theme: GqlTypeDefinition = {
  typeDef: gql`
    type Theme implements Node {
      id: ID!
      agency: Agency!
      name: String!
      image_logo: Image
      image_hero: Image
      color_primary: String
      color_secondary: String
      color_accent: String
      color_background: String
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
      themes(
        filter: ThemeFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        before_id: ID
        after_id: ID
      ): [Theme!]
      count_themes(filter: ThemeFilter!, token: String): Int!
    }

    extend type Mutation {
      update_theme(
        theme_id: ID!
        image_logo_id: ID
        image_hero_id: ID
        color_primary: String
        color_secondary: String
        color_accent: String
        color_background: String
        color_surface: String
        color_error: String
        color_success: String
      ): UpdateThemeResult!
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
      ...createResolverForReferencedResource({ name: 'image_logo', resource_name: 'image' }),
      ...createResolverForReferencedResource({ name: 'image_hero', resource_name: 'image' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async update_theme(obj, { theme_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // update theme resource
          const theme = await updateResource(context, 'theme', theme_id, args);

          // success
          return {
            success: true,
            theme,
            type: 'UpdateThemeResult'
          };
        } catch (error: any) {
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
