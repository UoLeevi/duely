import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './_resolvers';

const typeDefs = `
  type User implements Node {
    uuid: ID!
    name: String!
    emailAddress: String!
    agenciesConnection: UserAgenciesConnection
  }

  type UserAgenciesConnection implements Connection {
    edges: [UserAgenciesEdge!]!
  }

  type UserAgenciesEdge implements Edge {
    cursor: String!
    node: Agency!
  }

  type Theme implements Node {
    uuid: ID!
    name: String!
    colorPrimary: String!
    colorSecondary: String!
    colorAccent: String!
    colorError: String!
    colorInfo: String!
    colorSuccess: String!
    colorWarning: String!
    created: Date!
  }

  type Token implements Node {
    uuid: ID!
    name: String!
    user: User!
    jwt: String!
  }

  type CreateAgencyResult implements MutationResult {
    success: Boolean!
    message: String
    agency: Agency
  }

  type DeleteAgencyResult implements MutationResult {
    success: Boolean!
    message: String
  }

`;

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
