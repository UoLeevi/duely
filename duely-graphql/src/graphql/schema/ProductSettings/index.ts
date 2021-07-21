import gql from 'graphql-tag';
import { URL } from 'url';
import { updateResource } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import { createDefaultQueryResolversForResource } from '../../util';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'product settings',
  table_name: 'product_settings',
  plural: 'products_settings'
} as const;

export const ProductSettings: GqlTypeDefinition = {
  typeDef: gql`
    type ProductSettings {
      id: ID!
      checkout_success_url: String
      checkout_cancel_url: String
    }

    input ProductSettingsFilter {
      product_id: ID
    }

    extend type Query {
      product_settings(id: ID!): ProductSettings
      products_settings(
        filter: ProductSettingsFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [ProductSettings!]
      count_products_settings(filter: ProductSettingsFilter!, token: String): Int!
    }

    extend type Mutation {
      update_product_settings(setting_id: ID!, url: String!): ProductSettingsMutationResult!
    }

    type ProductSettingsMutationResult implements MutationResult {
      success: Boolean!
      message: String
      setting: ProductSettings
    }
  `,
  resolvers: {
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async update_product_settings(obj, { setting_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        if (args.checkout_success_url) {
          let url;

          try {
            // validate and normalize url
            url = new URL(args.checkout_success_url);
          } catch (error: any) {
            return {
              // error
              success: false,
              message: error.message,
              type: 'ProductSettingsMutationResult'
            };
          }

          if (url.protocol !== 'https:') {
            return {
              // error
              success: false,
              message: 'URL should use https protocol.',
              type: 'ProductSettingsMutationResult'
            };
          }

          args.checkout_success_url = url.href;
        }

        if (args.checkout_cancel_url) {
          let url;

          try {
            // validate and normalize url
            url = new URL(args.checkout_cancel_url);
          } catch (error: any) {
            return {
              // error
              success: false,
              message: error.message,
              type: 'ProductSettingsMutationResult'
            };
          }

          if (url.protocol !== 'https:') {
            return {
              // error
              success: false,
              message: 'URL should use https protocol.',
              type: 'ProductSettingsMutationResult'
            };
          }

          args.checkout_cancel_url = url.href;
        }

        try {
          // update resource
          const setting = await updateResource(context, 'product settings', setting_id, args);

          // success
          return {
            success: true,
            setting,
            type: 'ProductSettingsMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductSettingsMutationResult'
          };
        }
      }
    }
  }
};
