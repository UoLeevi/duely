import gql from 'graphql-tag';
import { createResource, deleteResource, Resources, updateResource } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'page block',
  table_name: 'page_block'
} as const;

export const PageBlock: GqlTypeDefinition<Resources['page block']> = {
  typeDef: gql`
    type PageBlock {
      id: ID!
      page: Page!
      definition: PageBlockDefinition!
      data: Json!
    }

    input PageBlockFilter {
      page_id: ID
      page_block_definition_id: ID
    }

    extend type Query {
      page_block(id: ID!): PageBlock
      page_blocks(
        filter: PageBlockFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [PageBlock!]
      count_page_blocks(filter: PageBlockFilter!, token: String): Int!
    }

    extend type Mutation {
      create_page_block(
        page_id: ID!
        page_block_definition_id: ID!
        data: Json!
        before_id: ID
        after_id: ID
      ): PageBlockMutationResult!
      update_page_block(
        page_block_id: ID!
        data: Json
        before_id: ID
        after_id: ID
      ): PageBlockMutationResult!
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
      ...createResolverForReferencedResource({
        name: 'definition',
        resource_name: 'page block definition',
        column_name: 'page_block_definition_id'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_page_block(obj, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          // create page block resource
          const page_block = await createResource(context, resource.name, args);

          // success
          return {
            success: true,
            page_block,
            type: 'PageBlockMutationResult'
          };
        } catch (error: any) {
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
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          // update page_block resource
          const page_block = await updateResource(context, 'page block', page_block_id, args);

          // success
          return {
            success: true,
            page_block,
            type: 'PageBlockMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PageBlockMutationResult'
          };
        }
      },
      async delete_page_block(obj, { page_block_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const page_block = await deleteResource(context, 'page block', page_block_id);

          // success
          return {
            success: true,
            page_block,
            type: 'PageBlockMutationResult'
          };
        } catch (error: any) {
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
