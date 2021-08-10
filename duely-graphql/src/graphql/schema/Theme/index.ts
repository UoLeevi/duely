import gql from 'graphql-tag';
import { Resources, updateResource, withSession } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import { DuelyGraphQLError } from '../../errors';
import { validateAndReadDataUrlAsBuffer } from '../Image';
import Stripe from 'stripe';
import stripe from '@duely/stripe';

const resource = {
  name: 'theme'
} as const;

export const Theme: GqlTypeDefinition<Resources['theme']> = {
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
        offset: Int
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
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, updateResource }) => {
            // update theme resource
            const theme = await updateResource('theme', theme_id, args);

            if (args.image_logo_id) {
              const image_logo = await queryResource('image', args.image_logo_id);
              // validate and read logo image
              const [image_buffer, validationError] = validateAndReadDataUrlAsBuffer(
                image_logo.data
              );

              if (validationError) throw new Error(validationError);

              const agency = await queryResource('agency', theme.agency_id);
              const stripe_envs = agency.livemode
                ? (['test', 'live'] as const)
                : (['test'] as const);

              for (const stripe_env of stripe_envs) {
                const stripe_account = await queryResource('stripe account', {
                  agency_id: agency.id,
                  livemode: stripe_env === 'live'
                });

                // upload logo image to stripe
                const logo_upload = await stripe[stripe_env].files.create({
                  file: {
                    data: image_buffer,
                    name: image_logo.name,
                    type: 'application/octet-stream'
                  },
                  purpose: 'business_logo'
                });

                // update stripe account branding settings
                const account = await stripe[stripe_env].accounts.update(
                  stripe_account.stripe_id_ext,
                  {
                    settings: {
                      branding: {
                        logo: logo_upload.id
                      }
                    }
                  }
                );
              }
            }

            // success
            return {
              success: true,
              theme,
              type: 'UpdateThemeResult'
            };
          });
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
