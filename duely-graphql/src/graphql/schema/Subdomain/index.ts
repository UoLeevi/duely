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

export const Subdomain: GqlTypeDefinition = {
  typeDef: gql`
    type Subdomain implements Node {
      id: ID!
      name: String!
      agency: Agency!
      memberships(filter: MembershipFilter): [Membership!]!
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
