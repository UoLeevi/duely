// see: https://stripe.com/docs/api/charges/object

export const Charge = {
  typeDef: `
    type Charge {
      id: ID!
      id_ext: ID!
      amount: Int!
      amount_capturable: Int
      amount_received: Int
      application_fee_amount: Int
      authorization_code: String
      balance_transaction: BalanceTransaction
      billing_details: BillingDetails
      calculated_statement_descriptor: String
      captured: Boolean
      created: Date
      currency: String
      customer: StripeCustomer
      description: String
      disputed: Boolean
      failure_code: String
      failure_message: String
      fraud_details: FraudDetails
      invoice: String
      order: String
      outcome: Outcome
      paid: Boolean
      payment_intent: PaymentIntent
      payment_method: String
      receipt_email: String
      receipt_number: String
      receipt_url: String
      refunded: Boolean
      source_transfer: String
      statement_descriptor: String
      statement_descriptor_suffix: String
      status: String
      transfer: String
      transfer_group: String
    }

    type BillingDetails {
      address: Address
      email: String
      name: String
      phone: String
    }

    type FraudDetails {
      stripe_report: String
      user_report: String
    }

    type Outcome {
      network_status: String
      reason: String
      risk_level: String
      risk_score: Int
      rule: OutcomeRule
      seller_message: String
      type: String
    }

    type OutcomeRule {
      action: String
      id: String
      predicate: String
    }
  `,
  resolvers: {
    Charge: {
      id_ext: source => source.id,
      created: source => new Date(source.created * 1000)
    }
  }
};
