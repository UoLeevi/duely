// see: https://stripe.com/docs/api/checkout/sessions/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

// TODO: define rest of fields
/* 
    type StripeCheckoutSession {
      id: ID!
      id_ext: ID!
      allow_promotion_codes: Boolean
      amount_subtotal: Int
      amount_total: Int
      billing_address_collection: String
      cancel_url: String
      client_reference_id: String
      currency: String
      customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;
      customer_details: Session.CustomerDetails | null;
      customer_email: String
      line_items?: ApiList<Stripe.LineItem>;
      livemode: Boolean
      locale: Session.Locale | null;
      metadata: Stripe.Metadata | null;
      mode: Session.Mode;
      payment_intent: string | Stripe.PaymentIntent | null;
      payment_method_types: [String]
      payment_status: String
      setup_intent: string | Stripe.SetupIntent | null;
      shipping: Session.Shipping | null;
      shipping_address_collection: Session.ShippingAddressCollection | null;
      submit_type: Session.SubmitType | null;
      subscription: string | Stripe.Subscription | null;
      success_url: String
      total_details: Session.TotalDetails | null;
    }
*/

export const StripeCheckoutSession: GqlTypeDefinition = {
  typeDef: gql`
    type StripeCheckoutSession {
      id: ID!
      id_ext: ID!
      allow_promotion_codes: Boolean
      amount_subtotal: Int
      amount_total: Int
      billing_address_collection: String
      cancel_url: String
      client_reference_id: String
      currency: String
      customer_email: String
      livemode: Boolean
      locale: String
      mode: String
      payment_method_types: [String]
      payment_status: String
      submit_type: String
      success_url: String
    }
  `,
  resolvers: {
    StripeCheckoutSession: {
      id_ext: (source) => source.id
    }
  }
};
