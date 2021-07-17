import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';

const resource = {
  name: 'membership'
} as const;

export const Membership: GqlTypeDefinition = {
  typeDef: gql`
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
      memberships(filter: MembershipFilter!, token: String, desc: Boolean, order_by: String, limit: Number, after_id: ID): [Membership!]
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
