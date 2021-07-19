import { createResource, updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { DuelyGraphQLError } from '../../errors';

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
      credential_type: CredentialType!
    }

    input CredentialFilter {
      name: String
      agency_id: ID
      credential_type_id: ID
    }

    extend type Query {
      credential(id: ID!): Credential
      credentials(
        filter: CredentialFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Credential!]
      count_credentials(filter: CredentialFilter!, token: String): Int!
    }

    extend type Mutation {
      create_credential(
        agency_id: ID
        name: String!
        data: Json!
        credential_type_id: ID!
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
      ...createResolverForReferencedResource({ name: 'agency' }),
      ...createResolverForReferencedResource({
        name: 'credential_type',
        resource_name: 'credential type'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_credential(obj, args, context, info) {
        if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");

        try {
          // create credential resource
          const credential = await createResource(context, resource.name, args);

          // success
          return {
            success: true,
            credential,
            type: 'CredentialMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CredentialMutationResult'
          };
        }
      },
      async update_credential(obj, { credential_id, ...args }, context, info) {
        if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");

        try {
          // update credential resource
          const credential = await updateResource(context, 'credential', credential_id, args);

          // success
          return {
            success: true,
            credential,
            type: 'CredentialMutationResult'
          };
        } catch (error: any) {
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
