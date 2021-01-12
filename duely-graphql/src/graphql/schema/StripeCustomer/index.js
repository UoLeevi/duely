// see: https://stripe.com/docs/api/customers/object

import gql from 'graphql-tag';

export const StripeCustomer = {
  typeDef: gql`
    type StripeCustomer {
      id: ID!
      id_ext: ID!
      address: Address
      balance: Int
      created: DateTime
      currency: String
      delinquent: Boolean
      description: String
      email: String
      invoice_prefix: String
      name: String
      next_invoice_sequence: Int
      phone: String
      preferred_locales: [String]
    }
  `,
  resolvers: {
    StripeCustomer: {
      id_ext: (source) => source.id,
      created: (source) => new Date(source.created * 1000)
    }
  }
};
