import gql from 'graphql-tag';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll
} from '../../util';

const resource = {
  name: 'page block definition',
  table_name: 'page_block_definition'
};

export const PageBlockDefinition = {
  typeDef: gql`
    type PageBlockDefinition implements Node {
      id: ID!
      name: String!
      page: PageDefinition!
      fields: [FormField!]!
    }

    input PageBlockDefinitionFilter {
      name: String
      page_definition_id: ID
    }

    extend type Query {
      page_block_definition(id: ID!): PageBlockDefinition
      page_block_definitions(filter: PageBlockDefinitionFilter!): [PageBlockDefinition!]
    }
  `,
  resolvers: {
    PageBlockDefinition: {
      ...createResolverForReferencedResource({ name: 'page', column_name: 'page_definition_id' }),
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
