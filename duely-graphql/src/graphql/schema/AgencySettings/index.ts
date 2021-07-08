import gql from 'graphql-tag';
import { URL } from 'url';
import { createResource, deleteResource, updateResource } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import { createResolverForReferencedResource } from '../../util';

export const AgencySettings: GqlTypeDefinition = {
  typeDef: gql`
    type AgencySettings {
      id: ID!
      thank_you_page_setting: AgencyThankYouPageSetting
    }

    type AgencyThankYouPageSetting {
      id: ID!
      url: String!
    }

    extend type Mutation {
      create_agency_thank_you_page_setting(
        agency_id: ID!
        url: String!
      ): AgencyThankYouPageSettingMutationResult!
      update_agency_thank_you_page_setting(
        setting_id: ID!
        url: String!
      ): AgencyThankYouPageSettingMutationResult!
      delete_agency_thank_you_page_setting(
        setting_id: ID!
      ): AgencyThankYouPageSettingMutationResult!
    }

    type AgencyThankYouPageSettingMutationResult implements MutationResult {
      success: Boolean!
      message: String
      setting: AgencyThankYouPageSetting
    }
  `,
  resolvers: {
    AgencySettings: {
      id: (source) => `set${source.agency_id}_x`,
      ...createResolverForReferencedResource({
        name: 'thank_you_page_setting',
        resource_name: 'agency thank you page setting',
        reverse: true,
        column_name: 'agency_id'
      })
    },
    Mutation: {
      async create_agency_thank_you_page_setting(obj, args, context) {
        if (!context.jwt) throw new Error('Unauthorized');

        let url;

        try {
          // validate and normalize url
          url = new URL(args.url);
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }

        if (url.protocol !== 'https:') {
          return {
            // error
            success: false,
            message: 'URL should use https protocol.',
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }

        args.url = url.href;

        try {
          // create resource
          const setting = await createResource(context, 'agency thank you page setting', args);

          // success
          return {
            success: true,
            setting,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }
      },
      async update_agency_thank_you_page_setting(obj, { setting_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        let url;

        try {
          // validate and normalize url
          url = new URL(args.url);
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }

        if (url.protocol !== 'https:') {
          return {
            // error
            success: false,
            message: 'URL should use https protocol.',
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }

        args.url = url.href;

        try {
          // update resource
          const setting = await updateResource(
            context,
            'agency thank you page setting',
            setting_id,
            args
          );

          // success
          return {
            success: true,
            setting,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }
      },
      async delete_agency_thank_you_page_setting(obj, { setting_id }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // delete resource
          const setting = await deleteResource(
            context,
            'agency thank you page setting',
            setting_id
          );

          // success
          return {
            success: true,
            setting,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }
      }
    }
  }
};
