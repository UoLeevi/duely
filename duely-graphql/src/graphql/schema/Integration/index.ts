import { createResource, updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'integration'
} as const;

export const Integration: GqlTypeDefinition = {
  typeDef: gql`
    type Integration implements Node {
      id: ID!
      name: String!
      data: Json!
      agency: Agency!
      credential: Credential
    }

    input IntegrationFilter {
      name: String
      agency_id: ID
    }

    extend type Query {
      integration(id: ID!): Integration
      integrations(filter: IntegrationFilter!): [Integration!]
    }

    extend type Mutation {
      create_integration(
        agency_id: ID!
        credential_id: ID
        name: String!
        data: Json!
      ): IntegrationMutationResult!
      update_integration(
        integration_id: ID!
        credential_id: ID
        name: String
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
      ...createResolverForReferencedResource({ name: 'credential' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_integration(obj, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // create integration resource
          const integration = await createResource(context, resource.name, args);

          // success
          return {
            success: true,
            integration,
            type: 'IntegrationMutationResult'
          };
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'IntegrationMutationResult'
          };
        }
      },
      async update_integration(obj, { integration_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // update integration resource
          const integration = await updateResource(context, integration_id, args);

          // success
          return {
            success: true,
            integration,
            type: 'IntegrationMutationResult'
          };
        } catch (error) {
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
