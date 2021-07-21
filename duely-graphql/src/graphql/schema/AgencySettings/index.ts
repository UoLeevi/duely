import gql from 'graphql-tag';
import { URL } from 'url';
import { updateResource } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import { createDefaultQueryResolversForResource } from '../../util';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'agency settings',
  table_name: 'agency_settings',
  plural: 'agencies_settings'
} as const;

export const AgencySettings: GqlTypeDefinition = {
  typeDef: gql`
    type AgencySettings {
      id: ID!
      checkout_success_url: String
      checkout_cancel_url: String
    }

    input AgencySettingsFilter {
      agency_id: ID
    }

    extend type Query {
      agency_settings(id: ID!): AgencySettings
      agencies_settings(
        filter: AgencySettingsFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [AgencySettings!]
      count_agencies_settings(filter: AgencySettingsFilter!, token: String): Int!
    }

    extend type Mutation {
      update_agency_settings(setting_id: ID!, url: String!): AgencySettingsMutationResult!
    }

    type AgencySettingsMutationResult implements MutationResult {
      success: Boolean!
      message: String
      setting: AgencySettings
    }
  `,
  resolvers: {
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async update_agency_settings(obj, { setting_id, ...args }, context, info) {
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
              type: 'AgencySettingsMutationResult'
            };
          }

          if (url.protocol !== 'https:') {
            return {
              // error
              success: false,
              message: 'URL should use https protocol.',
              type: 'AgencySettingsMutationResult'
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
              type: 'AgencySettingsMutationResult'
            };
          }

          if (url.protocol !== 'https:') {
            return {
              // error
              success: false,
              message: 'URL should use https protocol.',
              type: 'AgencySettingsMutationResult'
            };
          }

          args.checkout_cancel_url = url.href;
        }

        try {
          // update resource
          const setting = await updateResource(context, 'agency settings', setting_id, args);

          // success
          return {
            success: true,
            setting,
            type: 'AgencySettingsMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'AgencySettingsMutationResult'
          };
        }
      }
    }
  }
};
