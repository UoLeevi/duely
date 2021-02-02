import gql from 'graphql-tag';
import { queryResource } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';

const resource = {
  name: 'page definition',
  table_name: 'page_definition'
};

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
      page_definitions(filter: PageDefinitionFilter!): [PageDefinition!]
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
        if (!context.jwt) throw new Error('Unauthorized');
        return await queryResource(context, 'page definition', { url_path: args.url_path });
      }
    }
  }
};
