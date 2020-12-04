// see: https://stripe.com/docs/api/customers/object

export const StripeCustomer = {
  typeDef: `
    type StripeCustomer {
      id: ID!
      id_ext: ID!
      address: Address
      balance: Int
      created: Date
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
      id_ext: source => source.id,
      created: source => new Date(source.created * 1000)
    }
  }
};
