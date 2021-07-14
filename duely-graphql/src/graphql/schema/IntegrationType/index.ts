import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'integration type',
  table_name: 'integration_type'
} as const;

export const IntegrationType: GqlTypeDefinition = {
  typeDef: gql`
    type IntegrationType implements Node {
      id: ID!
      name: String!
      automatic_order_management: Boolean!
      fields: [FormField!]
      config_fields: [FormField!]
      credential_type_id: ID
    }

    input IntegrationTypeFilter {
      name: String
      form_id: ID
    }

    extend type Query {
      integration_type(id: ID!): IntegrationType
      integration_types(filter: IntegrationTypeFilter!): [IntegrationType!]
    }
  `,
  resolvers: {
    IntegrationType: {
      ...createResolverForReferencedResourceAll({
        name: 'fields',
        resource_name: 'form field',
        column_name: 'form_id',
        reverse_column_name: 'form_id'
      }),
      ...createResolverForReferencedResourceAll({
        name: 'config_fields',
        resource_name: 'form field',
        column_name: 'form_id',
        reverse_column_name: 'config_form_id'
      }),
      ...createResolverForReferencedResource({
        name: 'credential type',
        column_name: 'credential_type_id'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
