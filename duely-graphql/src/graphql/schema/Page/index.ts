import gql from 'graphql-tag';
import { URL } from 'url';
import { updateResource, withSession } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll
} from '../../util';

const resource = {
  name: 'page'
} as const;

export const Page: GqlTypeDefinition = {
  typeDef: gql`
    type Page {
      id: ID!
      url_path: String!
      agency: Agency!
      product: Product
      definition: PageDefinition!
      access: AccessLevel!
      blocks: [PageBlock!]!
    }

    input PageFilter {
      url_path: String
      agency_id: ID
      product_id: ID
      page_definition_id: ID
    }

    extend type Query {
      page(id: ID!): Page
      page_by_url(url: String!): Page
      pages(filter: PageFilter!, token: String, desc: Boolean, order_by: String, limit: Int, after_id: ID): [Page!]
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
      ...createResolverForReferencedResource({ name: 'product' }),
      ...createResolverForReferencedResource({
        name: 'definition',
        resource_name: 'page definition',
        column_name: 'page_definition_id'
      }),
      ...createResolverForReferencedResourceAll({
        name: 'blocks',
        resource_name: 'page block',
        column_name: 'page_id'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource),
      async page_by_url(source, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        let url;

        try {
          url = new URL(args.url);
          if (url == null) throw new Error('URL is invalid');
        } catch (error: any) {
          throw new Error(error.message);
        }

        const domain = url.hostname.toLowerCase();
        const path = url.pathname.toLowerCase();
        let subdomain_name: string | null = null;

        if (domain.endsWith('.duely.app')) {
          subdomain_name = domain.slice(0, -'.duely.app'.length);
        } else {
          // TODO: check from database
          throw new Error('Not implemented.');
        }

        try {
          return await withSession(context, async ({ queryResource }) => {
            const subdomain = await queryResource('subdomain', { name: subdomain_name! });
            if (!subdomain) return null;
            const agency = await queryResource('agency', { subdomain_id: subdomain.id });
            if (!agency) return null;
            return await queryResource('page', { agency_id: agency.id, url_path: path });
          });
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    Mutation: {
      async update_page(obj, { page_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          // update page resource
          const page = await updateResource(context, 'page', page_id, args);

          // success
          return {
            success: true,
            page,
            type: 'PageMutationResult'
          };
        } catch (error: any) {
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
