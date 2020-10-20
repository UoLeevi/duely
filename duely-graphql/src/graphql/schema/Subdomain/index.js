import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource } from '../../utils';
import { AuthenticationError } from 'apollo-server-core';

const resource = {
  table_name: 'subdomain',
  name: 'subdomain'
};

export const Subdomain = {
  typeDef: `
    type Subdomain implements Node {
      id: ID!
      name: String!
      agency: Agency!
    }

    input SubdomainFilter {
      name: String
    }

    extend type Query {
      subdomain(id: ID!): Subdomain
      subdomains(filter: SubdomainFilter!): [Subdomain!]
    }
  `,
  resolvers: {
    Subdomain: {
      async agency(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource('agency', { subdomain_id: source.id });
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
