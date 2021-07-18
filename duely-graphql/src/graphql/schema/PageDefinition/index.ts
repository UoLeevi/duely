import gql from 'graphql-tag';
import { queryResource } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'page definition',
  table_name: 'page_definition'
} as const;

export const PageDefinition: GqlTypeDefinition = {
  typeDef: gql`
    type PageDefinition implements Node {
      id: ID!
      name: String!
      url_path: String!
      blocks: [PageBlockDefinition!]!
    }

    input PageDefinitionFilter {
      name: String
      url_path: String
    }

    extend type Query {
      page_definition(id: ID!): PageDefinition
      page_definition_by_url_path(url_path: String!): PageDefinition
      page_definitions(
        filter: PageDefinitionFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        before_id: ID
        after_id: ID
      ): [PageDefinition!]
      count_page_definitions(filter: PageDefinitionFilter!, token: String): Int!
    }
  `,
  resolvers: {
    PageDefinition: {
      ...createResolverForReferencedResourceAll({
        name: 'blocks',
        resource_name: 'page block definition',
        column_name: 'page_definition_id'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource),
      async page_definition_by_url_path(source, args, context, info) {
        if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");
        return await queryResource(context, 'page definition', { url_path: args.url_path });
      }
    }
  }
};
