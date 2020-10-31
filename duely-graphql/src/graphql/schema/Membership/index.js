import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource } from '../../utils';
import { AuthenticationError } from 'apollo-server-core';

const resource = {
  name: 'membership'
};

export const Membership = {
  typeDef: `
    type Membership implements Node {
      id: ID!
      name: String!
      access: AccessLevel!
      user: User!
      subdomain: Subdomain!
    }

    input MembershipFilter {
      access: AccessLevel
      user_id: ID
      subdomain_id: ID
    }

    extend type Query {
      membership(id: ID!): Membership
      memberships(filter: MembershipFilter!): [Membership!]
    }
  `,
  resolvers: {
    Membership: {
      name() {
        return 'membership';
      },
      async user(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource(source.user_id);
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      },
      async subdomain(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource(source.subdomain_id);
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
