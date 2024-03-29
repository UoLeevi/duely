import { Resources } from '@duely/db';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll
} from '../../util';

const resource = {
  name: 'page block definition',
  table_name: 'page_block_definition'
} as const;

export const PageBlockDefinition: GqlTypeDefinition<Resources['page block definition']> = {
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
      page_block_definitions(
        filter: PageBlockDefinitionFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [PageBlockDefinition!]
      count_page_block_definitions(filter: PageBlockDefinitionFilter!, token: String): Int!
    }
  `,
  resolvers: {
    PageBlockDefinition: {
      ...createResolverForReferencedResource({
        name: 'page',
        resource_name: 'page definition',
        column_name: 'page_definition_id'
      }),
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
