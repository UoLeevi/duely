import { createResource, updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import md from '../../../markdown-it';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'markdown'
} as const;

export const Markdown: GqlTypeDefinition = {
  typeDef: gql`
    type Markdown implements Node {
      id: ID!
      name: String!
      data: String!
      agency: Agency
      access: AccessLevel!
    }

    input MarkdownFilter {
      name: String
      agency_id: ID
    }

    extend type Query {
      markdown(id: ID!): Markdown
      markdowns(
        filter: Markdown!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        before_id: ID
        after_id: ID
      ): [Markdown!]
      count_markdowns(filter: MarkdownFilter!, token: String): Int!
    }

    extend type Mutation {
      create_markdown(
        agency_id: ID
        name: String!
        data: String!
        access: AccessLevel
      ): MarkdownMutationResult!
      update_markdown(
        markdown_id: ID!
        name: String
        data: String
        access: AccessLevel
      ): MarkdownMutationResult!
    }

    type MarkdownMutationResult implements MutationResult {
      success: Boolean!
      message: String
      markdown: Markdown
    }
  `,
  resolvers: {
    Markdown: {
      ...createResolverForReferencedResource({ name: 'agency' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_markdown(obj, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // validate markdown
          md.render(args.data);
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'MarkdownMutationResult'
          };
        }

        try {
          // create markdown resource
          const markdown = await createResource(context, resource.name, args);

          // success
          return {
            success: true,
            markdown,
            type: 'MarkdownMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'MarkdownMutationResult'
          };
        }
      },
      async update_markdown(obj, { markdown_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        if (args.data) {
          try {
            // validate markdown
            md.render(args.data);
          } catch (error: any) {
            return {
              // error
              success: false,
              message: error.message,
              type: 'MarkdownMutationResult'
            };
          }
        }

        try {
          // update markdown resource
          const markdown = await updateResource(context, 'markdown', markdown_id, args);

          // success
          return {
            success: true,
            markdown,
            type: 'MarkdownMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'MarkdownMutationResult'
          };
        }
      }
    }
  }
};
