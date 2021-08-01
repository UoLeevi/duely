import { createResource, Resources, updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'integration'
} as const;

export const Integration: GqlTypeDefinition<Resources['integration']> = {
  typeDef: gql`
    type Integration {
      id: ID!
      data: Json!
      agency: Agency!
      credential: Credential
      product: Product
      integration_type: IntegrationType!
      integration_config: IntegrationConfig
    }

    input IntegrationFilter {
      agency_id: ID
      integration_type_id: ID
      integration_config_id: ID
      product_id: ID
    }

    extend type Query {
      integration(id: ID!): Integration
      integrations(
        filter: IntegrationFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Integration!]
      count_integrations(filter: IntegrationFilter!, token: String): Int!
    }

    extend type Mutation {
      create_integration(
        agency_id: ID!
        credential_id: ID
        product_id: ID
        integration_type_id: ID!
        integration_config_id: ID
        data: Json!
      ): IntegrationMutationResult!
      update_integration(
        integration_id: ID!
        credential_id: ID
        data: Json
      ): IntegrationMutationResult!
    }

    type IntegrationMutationResult implements MutationResult {
      success: Boolean!
      message: String
      integration: Integration
    }
  `,
  resolvers: {
    Integration: {
      ...createResolverForReferencedResource({ name: 'agency' }),
      ...createResolverForReferencedResource({ name: 'credential' }),
      ...createResolverForReferencedResource({ name: 'product' }),
      ...createResolverForReferencedResource({
        name: 'integration_type',
        resource_name: 'integration type'
      }),
      ...createResolverForReferencedResource({
        name: 'integration_config',
        resource_name: 'integration config'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_integration(obj, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          // create integration resource
          const integration = await createResource(context, resource.name, args);

          // success
          return {
            success: true,
            integration,
            type: 'IntegrationMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'IntegrationMutationResult'
          };
        }
      },
      async update_integration(obj, { integration_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          // update integration resource
          const integration = await updateResource(context, resource.name, integration_id, args);

          // success
          return {
            success: true,
            integration,
            type: 'IntegrationMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'IntegrationMutationResult'
          };
        }
      }
    }
  }
};
