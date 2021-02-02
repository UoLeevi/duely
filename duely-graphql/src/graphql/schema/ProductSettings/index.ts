import gql from 'graphql-tag';
import { URL } from 'url';
import { createResource, deleteResource, updateResource } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import { createResolverForReferencedResource } from '../../util';

export const ProductSettings: GqlTypeDefinition = {
  typeDef: gql`
    type ProductSettings {
      id: ID!
      thank_you_page_setting: ProductThankYouPageSetting
    }

    type ProductThankYouPageSetting {
      id: ID!
      url: String!
    }

    extend type Mutation {
      create_product_thank_you_page_setting(
        product_id: ID!
        url: String!
      ): ProductThankYouPageSettingMutationResult!
      update_product_thank_you_page_setting(
        setting_id: ID!
        url: String!
      ): ProductThankYouPageSettingMutationResult!
      delete_product_thank_you_page_setting(
        setting_id: ID!
      ): ProductThankYouPageSettingMutationResult!
    }

    type ProductThankYouPageSettingMutationResult implements MutationResult {
      success: Boolean!
      message: String
      setting: ProductThankYouPageSetting
    }
  `,
  resolvers: {
    ProductSettings: {
      id: (source) => `set${source.product_id}_x`,
      ...createResolverForReferencedResource({
        name: 'thank_you_page_setting',
        resource_name: 'product thank you page setting',
        reverse: true,
        column_name: 'product_id'
      })
    },
    Mutation: {
      async create_product_thank_you_page_setting(obj, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        let url;

        try {
          // validate and normalize url
          url = new URL(args.url);
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductThankYouPageSettingMutationResult'
          };
        }

        if (url.protocol !== 'https:') {
          return {
            // error
            success: false,
            message: 'URL should use https protocol.',
            type: 'ProductThankYouPageSettingMutationResult'
          };
        }

        args.url = url.href;

        try {
          // create resource
          const setting = await createResource(context, 'product thank you page setting', args);

          // success
          return {
            success: true,
            setting,
            type: 'ProductThankYouPageSettingMutationResult'
          };
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductThankYouPageSettingMutationResult'
          };
        }
      },
      async update_product_thank_you_page_setting(obj, { setting_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        let url;

        try {
          // validate and normalize url
          url = new URL(args.url);
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductThankYouPageSettingMutationResult'
          };
        }

        if (url.protocol !== 'https:') {
          return {
            // error
            success: false,
            message: 'URL should use https protocol.',
            type: 'ProductThankYouPageSettingMutationResult'
          };
        }

        args.url = url.href;

        try {
          // update resource
          const setting = await updateResource(context, setting_id, args);

          // success
          return {
            success: true,
            setting,
            type: 'ProductThankYouPageSettingMutationResult'
          };
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductThankYouPageSettingMutationResult'
          };
        }
      },
      async delete_product_thank_you_page_setting(obj, { setting_id }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // delete resource
          const setting = await deleteResource(context, setting_id);

          // success
          return {
            success: true,
            setting,
            type: 'ProductThankYouPageSettingMutationResult'
          };
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductThankYouPageSettingMutationResult'
          };
        }
      }
    }
  }
};
