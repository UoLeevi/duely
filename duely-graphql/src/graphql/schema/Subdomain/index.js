import { createDefaultQueryResolversForResource, createResolverForReferencedResource, createResolverForReferencedResourceAll } from '../../utils';

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
      memberships: [Membership!]!
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
      ...createResolverForReferencedResource({ name: 'agency', reverse: true, column_name: 'subdomain_id' }),
      ...createResolverForReferencedResourceAll({ name: 'memberships', resource_name: 'membership', column_name: 'subdomain_id' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
