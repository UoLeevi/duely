import { withConnection } from '../../../db';
import { createResolverForReferencedResource } from '../../util';

export const ServiceSettings = {
  typeDef: `
    type ServiceSettings {
      id: ID!
      thank_you_page_setting: ServiceThankYouPageSetting
    }

    type ServiceThankYouPageSetting {
      id: ID!
      url: String!
    }

    extend type Mutation {
      create_service_thank_you_page_setting(service_id: ID!, url: String!): ServiceThankYouPageSettingMutationResult!
      update_service_thank_you_page_setting(setting_id: ID!, url: String!): ServiceThankYouPageSettingMutationResult!
      delete_service_thank_you_page_setting(setting_id: ID!): ServiceThankYouPageSettingMutationResult!
    }

    type ServiceThankYouPageSettingMutationResult implements MutationResult {
      success: Boolean!
      message: String
      setting: ServiceThankYouPageSetting
    }
  `,
  resolvers: {
    ServiceSettings: {
      id: (source) => `set${source.service_id}_x`,
      ...createResolverForReferencedResource({ name: 'thank_you_page_setting', resource_name: 'service thank you page setting', reverse: true, column_name: 'service_id' }),
    },
    Mutation: {
      async create_service_thank_you_page_setting(obj, args, context, info) {
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
            type: 'ServiceThankYouPageSettingMutationResult'
          };
        }

        if (url.protocol !== 'https:') {
          return {
            // error
            success: false,
            message: 'URL should use https protocol.',
            type: 'ServiceThankYouPageSettingMutationResult'
          };
        }

        args.url = url.href;

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource }) => {

              // create resource
              const setting = await createResource('service thank you page setting', args);

              // success
              return {
                success: true,
                setting,
                type: 'ServiceThankYouPageSettingMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceThankYouPageSettingMutationResult'
          };
        }
      },
      async update_service_thank_you_page_setting(obj, { setting_id, ...args }, context, info) {
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
            type: 'ServiceThankYouPageSettingMutationResult'
          };
        }

        if (url.protocol !== 'https:') {
          return {
            // error
            success: false,
            message: 'URL should use https protocol.',
            type: 'ServiceThankYouPageSettingMutationResult'
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
                type: 'ServiceThankYouPageSettingMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceThankYouPageSettingMutationResult'
          };
        }
      },
      async delete_service_thank_you_page_setting(obj, { setting_id }, context, info) {
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
                type: 'ServiceThankYouPageSettingMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceThankYouPageSettingMutationResult'
          };
        }
      }
    }
  }
};
