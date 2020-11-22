import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../util';
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
      ...createResolverForReferencedResource({ name: 'user' }),
      ...createResolverForReferencedResource({ name: 'subdomain' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
