import { withConnection } from '../../../db';
import { createResolverForReferencedResource } from '../../util';

export const AgencySettings = {
  typeDef: `
    type AgencySettings {
      id: ID!
      thank_you_page_setting: AgencyThankYouPageSetting
    }

    type AgencyThankYouPageSetting {
      id: ID!
      url: String!
    }

    extend type Mutation {
      create_agency_thank_you_page_setting(agency_id: ID!, url: String!): AgencyThankYouPageSettingMutationResult!
      update_agency_thank_you_page_setting(setting_id: ID!, url: String!): AgencyThankYouPageSettingMutationResult!
      delete_agency_thank_you_page_setting(setting_id: ID!): AgencyThankYouPageSettingMutationResult!
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
      ...createResolverForReferencedResource({ name: 'thank_you_page_setting', resource_name: 'agency thank you page setting', reverse: true, column_name: 'agency_id' }),
    },
    Mutation: {
      async create_agency_thank_you_page_setting(obj, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        let url;

        try {
          // validate and normalize url
          url = new URL(args.url);
        } catch (error) {
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
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource }) => {
              // create resource
              const setting = await createResource('agency thank you page setting', args);

              // success
              return {
                success: true,
                setting,
                type: 'AgencyThankYouPageSettingMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }
      },
      async update_agency_thank_you_page_setting(obj, { setting_id, ...args }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        let url;

        try {
          // validate and normalize url
          url = new URL(args.url);
        } catch (error) {
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
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // update resource
              const setting = await updateResource(setting_id, args);

              // success
              return {
                success: true,
                setting,
                type: 'AgencyThankYouPageSettingMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'AgencyThankYouPageSettingMutationResult'
          };
        }
      },
      async delete_agency_thank_you_page_setting(obj, { setting_id }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ deleteResource }) => {
              // delete resource
              const setting = await deleteResource(setting_id);

              // success
              return {
                success: true,
                setting,
                type: 'AgencyThankYouPageSettingMutationResult'
              };
            });
          });
        } catch (error) {
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
