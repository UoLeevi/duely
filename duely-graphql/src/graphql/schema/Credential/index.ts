import { createResource, updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'credential'
} as const;

export const Credential: GqlTypeDefinition = {
  typeDef: gql`
    type Credential implements Node {
      id: ID!
      name: String!
      data: Json!
      agency: Agency!
      type: String!
    }

    input CredentialFilter {
      name: String
      agency_id: ID
    }

    extend type Query {
      credential(id: ID!): Credential
      credentials(filter: CredentialFilter!): [Credential!]
    }

    extend type Mutation {
      create_credential(
        agency_id: ID
        name: String!
        data: Json!
        type: String!
      ): CredentialMutationResult!
      update_credential(credential_id: ID!, data: Json!): CredentialMutationResult!
    }

    type CredentialMutationResult implements MutationResult {
      success: Boolean!
      message: String
      credential: Credential
    }
  `,
  resolvers: {
    Credential: {
      ...createResolverForReferencedResource({ name: 'agency' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_credential(obj, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // create credential resource
          const credential = await createResource(context, resource.name, args);

          // success
          return {
            success: true,
            credential,
            type: 'CredentialMutationResult'
          };
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CredentialMutationResult'
          };
        }
      },
      async update_credential(obj, { credential_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // update credential resource
          const credential = await updateResource(context, credential_id, args);

          // success
          return {
            success: true,
            credential,
            type: 'CredentialMutationResult'
          };
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CredentialMutationResult'
          };
        }
      }
    }
  }
};
