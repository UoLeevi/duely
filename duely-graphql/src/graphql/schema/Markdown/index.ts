import {
  createResource,
  queryResource,
  queryResourceAll,
  Resources,
  updateResource
} from '@duely/db';
import { createResolverForReferencedResource } from '../../util';
import md from '../../../markdown-it';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { DuelyGraphQLError } from '../../errors';
import axios from 'axios';
import { URL } from 'url';

const DUELY_GITHUB_REPO_API_URL = 'https://api.github.com/repos/UoLeevi/duely/contents/';

const resource = {
  name: 'markdown'
} as const;

export const Markdown: GqlTypeDefinition<Resources['markdown']> = {
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
        filter: MarkdownFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Markdown!]
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
      async markdown(source, args: { id: string }, context) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        if (args.id.startsWith('duely-files/')) {
          const filepath = args.id;

          const url = new URL(filepath, DUELY_GITHUB_REPO_API_URL);

          if (
            !url.href.startsWith(DUELY_GITHUB_REPO_API_URL + 'duely-files/') ||
            !url.href.endsWith('.md')
          ) {
            throw new DuelyGraphQLError('FORBIDDEN', 'Unauthorized');
          }

          const res = await axios.get(url.href, {
            responseType: 'text',
            headers: {
              Accept: 'application/vnd.github.v3.raw',
              Authorization: `token ${process.env.DUELY_GITHUB_TOKEN}`
            }
          });

          return {
            id: filepath,
            name: filepath,
            data: res.data,
            agency: null,
            access: 'public'
          };
        }

        return await queryResource(context, resource.name, args.id);
      },
      async markdowns(
        source,
        args: {
          filter?: Partial<Resources['markdown']>;
          token?: string;
          desc?: boolean;
          order_by?: string & keyof Resources['markdown'];
          limit?: number;
          offset?: number;
          before_id?: Resources['markdown']['id'];
          after_id?: Resources['markdown']['id'];
        },
        context
      ) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        return await queryResourceAll(
          context,
          resource.name,
          args.filter,
          args.token,
          args.desc,
          args.order_by,
          args.limit,
          args.offset,
          args.before_id,
          args.after_id
        );
      }
    },
    Mutation: {
      async create_markdown(obj, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

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
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

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
