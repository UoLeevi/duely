import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  scalar Date

  interface Node {
    uuid: ID!
    name: String!
  }

  interface Connection {
    edges: [Edge!]!
  }

  interface Edge {
    cursor: String
    node: Node!
  }

  type Account implements Node {
    uuid: ID!
    name: String!
    email: String!
    verified: Date 
    created: Date!
  }

  type Seller implements Node {
    uuid: ID!
    name: String!
    created: Date!
  }

  type Subdomain implements Node {
    uuid: ID!
    name: String!
    host: String!
    seller: Seller!
    theme: Theme!
    created: Date!
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

  type Session implements Node {
    uuid: ID!
    name: String!
    account: Account!
    jwt: String
    created: Date!
  }

  type Query {
    subdomain(host: String!): Subdomain
    me: Account
  }

  type Mutation {
    signUp(email: String!, name: String!, password: String!): Account
    verifyEmailAddress(email: String!, verificationCode: String!): Account
    logIn(email: String!, password: String!): Session
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
