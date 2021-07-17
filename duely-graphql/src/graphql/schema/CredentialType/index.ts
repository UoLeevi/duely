import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'credential type',
  table_name: 'credential_type'
} as const;

export const CredentialType: GqlTypeDefinition = {
  typeDef: gql`
    type CredentialType implements Node {
      id: ID!
      name: String!
      fields: [FormField!]
    }

    input CredentialTypeFilter {
      name: String
      form_id: ID
    }

    extend type Query {
      credential_type(id: ID!): CredentialType
      credential_types(filter: CredentialTypeFilter!, token: String, desc: Boolean, order_by: String, limit: Number, after_id: ID): [CredentialType!]
    }
  `,
  resolvers: {
    CredentialType: {
      ...createResolverForReferencedResourceAll({
        name: 'fields',
        resource_name: 'form field',
        column_name: 'form_id',
        reverse_column_name: 'form_id'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
