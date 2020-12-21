import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../util';
import validator from 'validator';
import md from '../../../markdown-it';

const resource = {
  name: 'markdown'
};

export const Markdown = {
  typeDef: `
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
      markdowns(filter: MarkdownFilter!): [Markdown!]
    }

    extend type Mutation {
      create_markdown(agency_id: ID, name: String!, data: String!, access: AccessLevel): MarkdownMutationResult!
      update_markdown(markdown_id: ID!, name: String, data: String, access: AccessLevel): MarkdownMutationResult!
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
        if (!context.jwt)
          throw new Error('Unauthorized');

        try {
          // validate markdown
          md.render(args.data);
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'MarkdownMutationResult'
          };
        }

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource }) => {
              // create markdown resource
              const markdown = await createResource(resource.name, args);

              // success
              return {
                success: true,
                markdown,
                type: 'MarkdownMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'MarkdownMutationResult'
          };
        }
      },
      async update_markdown(obj, { markdown_id, ...args }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        if (args.data) {
          try {
            // validate markdown
            md.render(args.data);
          } catch (error) {
            return {
              // error
              success: false,
              message: error.message,
              type: 'MarkdownMutationResult'
            };
          }
        }

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // update markdown resource
              const markdown = await updateResource(markdown_id, args);

              // success
              return {
                success: true,
                markdown,
                type: 'MarkdownMutationResult'
              };
            });
          });
        } catch (error) {
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
