import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  scalar Date

  interface MutationResult {
    success: Boolean!
    message: String
  }

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
    signUp(email: String!, verificationCode: String!, name: String!, password: String!): SignUpResult
    startEmailAddressVerification(email: String!): StartEmailAddressVerificationResult
    logIn(email: String!, password: String!): LogInResult
  }

  type SignUpResult implements MutationResult {
    success: Boolean!
    message: String
    account: Account
  }

  type StartEmailAddressVerificationResult implements MutationResult {
    success: Boolean!
    message: String
  }

  type LogInResult implements MutationResult {
    success: Boolean!
    message: String
    session: Session
  }

`;

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
