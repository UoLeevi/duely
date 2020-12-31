import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../util';

const resource = {
  name: 'page block',
  table_name: 'page_block'
}

export const PageBlock = {
  typeDef: `
    type PageBlock {
      id: ID!
      page: Page!
      definition: PageBlockDefinition!
      data: String!
    }

    input PageBlockFilter {
      page_id: ID
      page_block_definition_id: ID
    }

    extend type Query {
      page_block(id: ID!): PageBlock
      page_blocks(filter: PageBlockFilter!): [PageBlock!]
    }

    extend type Mutation {
      create_page_block(page_id: ID!, page_block_definition_id: ID!, data: String!, after_id: ID): PageBlockMutationResult!
      update_page_block(page_block_id: ID!, data: String, after_id: ID): PageBlockMutationResult!
      delete_page_block(page_block_id: ID!): PageBlockMutationResult!
    }

    type PageBlockMutationResult implements MutationResult {
      success: Boolean!
      message: String
      page_block: PageBlock
    }
  `,
  resolvers: {
    PageBlock: {
      ...createResolverForReferencedResource({ name: 'page' }),
      ...createResolverForReferencedResource({ name: 'definition', column_name: 'page_block_definition_id' }),
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_page_block(obj, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource }) => {
              // create page block resource
              const page_block = await createResource(resource.name, args);

              // success
              return {
                success: true,
                page_block,
                type: 'PageBlockMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PageBlockMutationResult'
          };
        }
      },
      async update_page_block(obj, { page_block_id, ...args }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // update page_block resource
              const page_block = await updateResource(page_block_id, args);

              // success
              return {
                success: true,
                page_block,
                type: 'PageBlockMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PageBlockMutationResult'
          };
        }
      },
      async delete_page_block(obj, { page_block_id }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');
  
        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ deleteResource }) => {
              const page_block = await deleteResource(page_block_id);
  
              // success
              return {
                success: true,
                page_block,
                type: 'PageBlockMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PageBlockMutationResult'
          };
        }
      }
    }
  }
};
