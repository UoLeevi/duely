// see: https://stripe.com/docs/api/checkout/sessions/object

import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import gql from 'graphql-tag';
import stripe from '../../../stripe';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';
import { withStripeAccountProperty } from '../../util';

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
      customer: StripeCustomer
      customer_email: String
      line_items(
        starting_after_id: String
        ending_before_id: String
        limit: Int
        offset: Int
      ): [LineItem!]!
      livemode: Boolean
      locale: String
      mode: String
      payment_method_types: [String]
      payment_status: String
      submit_type: String
      success_url: String
    }

    type LineItem {
      id: ID!
      amount_subtotal: Int!
      amount_total: Int!
      currency: String!
      description: String!
      price: String
      quantity: Int
    }
  `,
  resolvers: {
    StripeCheckoutSession: {
      id_ext: (source) => source.id,
      async customer(source, args, context, info) {
        if (source.customer == null) return null;
        if (typeof source.customer === 'object') return source.customer;

        const stripe_env = source.livemode ? 'live' : 'test';

        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const fields = Object.keys(Object.values(resolveTree.fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.customer };

        const customer = await stripe[stripe_env].customers.retrieve(source.customer, {
          stripeAccount: source.stripeAccount
        });
        return withStripeAccountProperty(customer, source);
      },
      async line_items(
          source,
          { starting_after_id, ending_before_id, ...args },
          context,
          info
        ) {
          if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");
  
          const stripe_env = source.livemode ? 'live' : 'test';
  
          try {
            if (starting_after_id) {
              args.starting_after = starting_after_id;
            }
  
            if (ending_before_id) {
              args.ending_before = ending_before_id;
            }
  
            // see: https://stripe.com/docs/api/checkout/sessions/line_items
            const list = await stripe[stripe_env].checkout.sessions.listLineItems(source.id, args, {
              stripeAccount: source.stripe_id_ext
            });
            return list.data?.map((item) => ({
              stripeAccount: source.stripe_id_ext,
              ...item
            }));
          } catch (error: any) {
            throw new Error(error.message);
          }
      }
    }
  }
};
