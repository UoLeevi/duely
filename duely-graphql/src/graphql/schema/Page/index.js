import { createDefaultQueryResolversForResource, createResolverForReferencedResource, createResolverForReferencedResourceAll } from '../../util';

const resource = {
  name: 'page'
}

export const Page = {
  typeDef: `
    type Page {
      id: ID!
      agency: Agency!
      service: Service
      definition: PageDefinition!
      access: AccessLevel!
      blocks: [PageBlock!]!
    }

    input PageFilter {
      agency_id: ID
      page_definition_id: ID
    }

    extend type Query {
      page(id: ID!): Page
      pages(filter: PageFilter!): [Page!]
    }

    extend type Mutation {
      update_page(page_id: ID!, access: AccessLevel): PageMutationResult!
    }

    type PageMutationResult implements MutationResult {
      success: Boolean!
      message: String
      page: Page
    }
  `,
  resolvers: {
    Page: {
      ...createResolverForReferencedResource({ name: 'agency' }),
      ...createResolverForReferencedResource({ name: 'service' }),
      ...createResolverForReferencedResource({ name: 'definition', column_name: 'page_definition_id' }),
      ...createResolverForReferencedResourceAll({ name: 'blocks', resource_name: 'page block',  column_name: 'page_id' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async update_page(obj, { page_id, ...args }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // update page resource
              const page = await updateResource(page_id, args);

              // success
              return {
                success: true,
                page,
                type: 'PageMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PageMutationResult'
          };
        }
      }
    }
  }
};
