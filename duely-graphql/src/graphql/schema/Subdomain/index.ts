import { Resources } from '@duely/db';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll
} from '../../util';

const resource = {
  table_name: 'subdomain',
  name: 'subdomain'
} as const;

export const Subdomain: GqlTypeDefinition<Resources['subdomain']> = {
  typeDef: gql`
    type Subdomain implements Node {
      id: ID!
      name: String!
      agency: Agency!
      memberships(
        filter: MembershipFilter
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Membership!]!
    }

    input SubdomainFilter {
      name: String
    }

    extend type Query {
      subdomain(id: ID!): Subdomain
      subdomains(
        filter: SubdomainFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Subdomain!]
      count_subdomains(filter: SubdomainFilter!, token: String): Int!
    }
  `,
  resolvers: {
    Subdomain: {
      ...createResolverForReferencedResource({
        name: 'agency',
        reverse: true,
        column_name: 'subdomain_id'
      }),
      ...createResolverForReferencedResourceAll({
        name: 'memberships',
        resource_name: 'membership',
        column_name: 'subdomain_id'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
