import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'integration type'
} as const;

export const IntegrationType: GqlTypeDefinition = {
  typeDef: gql`
    type IntegrationType implements Node {
      id: ID!
      name: String!
      form: Form!
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
      ...createResolverForReferencedResource({ name: 'form' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
