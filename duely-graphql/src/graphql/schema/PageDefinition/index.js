import gql from 'graphql-tag';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';

const resource = {
  name: 'page definition',
  table_name: 'page_definition'
};

export const PageDefinition = {
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

        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource('page definition', { url_path: args.url_path });
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }
  }
};
