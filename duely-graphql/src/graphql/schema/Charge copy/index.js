// see: https://stripe.com/docs/api/charges/object

export const Charge = {
  typeDef: `
    type Charge {
      id: ID!
      id_ext: ID!
      alternate_statement_descriptors?: Charge.AlternateStatementDescriptors;
      amount: Int!
      amount_capturable: Int
      amount_received: Int
      application_fee_amount: Int
      authorization_code: String
      balance_transaction: BalanceTransaction
      billing_details: Charge.BillingDetails;
      calculated_statement_descriptor: String
      captured: Boolean
      created: Date
      currency: string;
      customer: string | Stripe.Customer | DeletedCustomer | null;
      description: String
      destination: string | Stripe.Account | null;
      dispute: string | Stripe.Dispute | null;
      disputed: Boolean
      failure_code: String
      failure_message: String
      fraud_details: Charge.FraudDetails | null;
      invoice: string | Stripe.Invoice | null;
      level3?: Charge.Level3;
      on_behalf_of: string | Stripe.Account | null;
      order: string | Stripe.Order | null;
      outcome: Charge.Outcome | null;
      paid: Boolean
      payment_intent: string | Stripe.PaymentIntent | null;
      payment_method: String
      payment_method_details: Charge.PaymentMethodDetails | null;
      receipt_email: String
      receipt_number: String
      receipt_url: String
      refunded: Boolean
      refunds: ApiList<Stripe.Refund>;
      review: string | Stripe.Review | null;
      shipping: Charge.Shipping | null;
      source: Stripe.CustomerSource | null;
      source_transfer: string | Stripe.Transfer | null;
      statement_descriptor: String
      statement_descriptor_suffix: String
      status: String
      transfer?: string | Stripe.Transfer;
      transfer_data: Charge.TransferData | null;
      transfer_group: String
    }

    type BalanceTransactionFeeDetails {
      amount: Int!
      application: String
      currency: String!
      description: String
      type: String!
    }
  `,
  resolvers: {
    PaymentIntent: {
      id_ext: source => source.id,
      created: source => new Date(source.created * 1000),
      available_on: source => new Date(source.created * 1000)
    }
  }
};
