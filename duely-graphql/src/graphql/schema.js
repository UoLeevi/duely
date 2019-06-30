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
    sellersConnection: AccountSellersConnection
  }

  type AccountSellersConnection implements Connection {
    edges: [AccountSellersEdge!]!
  }

  type AccountSellersEdge implements Edge {
    cursor: String!
    node: Seller!
  }

  type Seller implements Node {
    uuid: ID!
    name: String!
    created: Date!
    subdomainsConnection: SellerSubdomainsConnection
  }

  type SellerSubdomainsConnection implements Connection {
    edges: [SellerSubdomainsEdge!]!
  }

  type SellerSubdomainsEdge implements Edge {
    cursor: String!
    node: Subdomain!
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
    createSeller(name: String!, subdomain: String!): CreateSellerResult
    deleteSeller(seller_uuid: ID): DeleteSellerResult
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

  type CreateSellerResult implements MutationResult {
    success: Boolean!
    message: String
    seller: Seller
  }

  type DeleteSellerResult implements MutationResult {
    success: Boolean!
    message: String
  }

`;

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
