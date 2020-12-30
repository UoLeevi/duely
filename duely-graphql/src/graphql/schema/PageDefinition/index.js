import { createDefaultQueryResolversForResource, createResolverForReferencedResourceAll } from '../../util';

const resource = {
  name: 'page definition',
  table_name: 'page_definition'
}

export const PageDefinition = {
  typeDef: `
    type PageDefinition implements Node {
      id: ID!
      name: String!
      blocks: [PageBlockDefinition!]!
    }

    input PageDefinitionFilter {
      name: String
    }

    extend type Query {
      page_definition(id: ID!): PageDefinition
      page_definitions(filter: PageDefinitionFilter!): [PageDefinition!]
    }
  `,
  resolvers: {
    PageDefinition: {
      ...createResolverForReferencedResourceAll({ name: 'blocks', resource_name: 'page block definition',  column_name: 'page_definition_id' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
