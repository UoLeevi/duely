import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { createResource, updateResource } from '@duely/db';

const resource = {
  name: 'integration config',
  table_name: 'integration_config'
} as const;

export const IntegrationConfig: GqlTypeDefinition = {
  typeDef: gql`
    type IntegrationConfig implements Node {
      id: ID!
      name: String!
      agency: Agency!
      credential: Credential
      integration_type: IntegrationType!
      data: Json!
    }

    input IntegrationConfigFilter {
      name: String
      agency_id: ID
      integration_type_id: ID
    }

    extend type Query {
      integration_config(id: ID!): IntegrationConfig
      integration_configs(filter: IntegrationConfigFilter!): [IntegrationConfig!]
    }

    extend type Mutation {
      create_integration_config(
        agency_id: ID!
        credential_id: ID
        integration_type_id: ID!
        name: String!
        data: Json!
      ): IntegrationConfigMutationResult!
      update_integration_config(
        integration_config_id: ID!
        credential_id: ID
        name: String
        data: Json
      ): IntegrationConfigMutationResult!
    }

    type IntegrationConfigMutationResult implements MutationResult {
      success: Boolean!
      message: String
      integration_config: IntegrationConfig
    }
  `,
  resolvers: {
    IntegrationConfig: {
      ...createResolverForReferencedResource({ name: 'agency' }),
      ...createResolverForReferencedResource({ name: 'credential' }),
      ...createResolverForReferencedResource({ name: 'integration_type', resource_name: 'integration type' }),
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_integration_config(obj, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // create integration config resource
          const integration_config = await createResource(context, resource.name, args);

          // success
          return {
            success: true,
            integration_config,
            type: 'IntegrationConfigMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'IntegrationConfigMutationResult'
          };
        }
      },
      async update_integration_config(obj, { integration_config_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // update integration config resource
          const integration_config = await updateResource(context, resource.name, integration_config_id, args);

          // success
          return {
            success: true,
            integration_config,
            type: 'IntegrationConfigMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'IntegrationConfigMutationResult'
          };
        }
      }
    }
  }
};
