// see: https://stripe.com/docs/api/checkout/sessions/object

import gql from 'graphql-tag';
import stripe from '@duely/stripe';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';
import { timestampToDate } from '@duely/util';
import {
  createStripeRetrieveResolverForReferencedResource,
  withStripeAccountProperty
} from '../../util';
import Stripe from 'stripe';
import { Resources } from '@duely/db';

export const StripeCheckoutSession: GqlTypeDefinition<
  Stripe.Checkout.Session & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type StripeCheckoutSession {
      id: ID!
      after_expiration: SessionAfterExpiration
      allow_promotion_codes: Boolean
      amount_subtotal: Int
      amount_total: Int
      automatic_tax: SessionAutomaticTax
      billing_address_collection: String
      cancel_url: String
      client_reference_id: String
      consent: SessionConsent
      consent_collection: SessionConsentCollection
      currency: String
      customer: StripeCustomer
      customer_details: SessionCustomerDetails
      customer_email: String
      expires_at: DateTime
      line_items(starting_after: String, ending_before: String, limit: Int): [LineItem!]!
      livemode: Boolean
      locale: String
      # metadata: Stripe.Metadata | null;
      mode: String
      payment_intent: PaymentIntent
      payment_method_types: [String]
      payment_status: String
      phone_number_collection: SessionPhoneNumberCollection
      # setup_intent: string | Stripe.SetupIntent | null;
      shipping: Shipping
      shipping_address_collection: SessionShippingAddressCollection
      shipping_options: [SessionShippingOption!]!
      # shipping_rate: string | Stripe.ShippingRate | null;
      status: String
      submit_type: String
      subscription: StripeSubscription
      success_url: String!
      tax_id_collection: SessionTaxIdCollection
      total_details: SessionTotalDetails
      url: String
    }

    type SessionAfterExpiration {
      recovery: SessionAfterExpirationRecovery
    }

    type SessionAfterExpirationRecovery {
      allow_promotion_codes: Boolean
      expires_at: DateTime
      url: String
    }

    type SessionAutomaticTax {
      enabled: Boolean!
      status: String
    }

    type SessionConsent {
      promotions: String
    }

    type SessionConsentCollection {
      promotions: String
    }

    type SessionCustomerDetails {
      email: String
      phone: String
      tax_exempt: String
      tax_ids: [SessionCustomerDetailsTaxId]
    }

    type SessionCustomerDetailsTaxId {
      type: String!
      value: String
    }

    type SessionPhoneNumberCollection {
      enabled: Boolean
    }

    type SessionShipping {
      address: Address
      carrier: String
      name: String
      phone: String
      tracking_number: String
    }

    type SessionShippingAddressCollection {
      allowed_countries: [String!]!
    }

    type SessionShippingOption {
      shipping_amount: Int!
      # shipping_rate: string | Stripe.ShippingRate;
    }

    type SessionTaxIdCollection {
      enabled: Boolean
    }

    type SessionTotalDetails {
      amount_discount: Int!
      amount_shipping: Int
      amount_tax: Int!
      breakdown: SessionTotalDetailsBreakdown
    }

    type SessionTotalDetailsBreakdown {
      discounts: [SessionTotalDetailsBreakdownDiscount!]!
      taxes: [SessionTotalDetailsBreakdownTax!]!
    }

    type SessionTotalDetailsBreakdownDiscount {
      amount: Int!
      # discount: Stripe.Discount;
    }

    type SessionTotalDetailsBreakdownTax {
      amount: Int!
      # rate: Stripe.TaxRate;
    }

    type LineItem {
      id: ID!
      amount_subtotal: Int!
      amount_total: Int!
      currency: String!
      description: String!
      price: StripePrice
      quantity: Int
    }

    type StripePrice {
      id: String!
      id_ext: String!
      active: Boolean!
      billing_scheme: String!
      created: DateTime
      currency: String!
      livemode: Boolean!
      lookup_key: String
      nickname: String
      product: String
      recurring: StripePriceRecurring
      tax_behavior: String
      tiers: [StripePriceTier!]
      tiers_mode: String
      transform_quantity: StripePriceTransformQuantity
      type: String!
      unit_amount: Int
      unit_amount_decimal: String
    }

    type StripePriceRecurring {
      aggregate_usage: String
      interval: String!
      interval_count: Int!
      trial_period_days: Int
      usage_type: String
    }

    type StripePriceTier {
      flat_amount: Int
      flat_amount_decimal: String
      unit_amount: Int
      unit_amount_decimal: String
      up_to: Int
    }

    type StripePriceTransformQuantity {
      divide_by: Int
      round: String
    }
  `,
  resolvers: {
    StripeCheckoutSession: {
      expires_at: (source) => timestampToDate(source.expires_at),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        object: 'customer',
        role: 'owner'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'payment_intent',
        object: 'payment_intent',
        role: 'owner'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'subscription',
        object: 'subscription',
        role: 'owner'
      }),
      async line_items(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          // see: https://stripe.com/docs/api/checkout/sessions/line_items
          const list = await stripe
            .get(source.stripe_account)
            .checkout.sessions.listLineItems(source.id, args);

          return withStripeAccountProperty(list.data, source.stripe_account);
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    SessionAfterExpirationRecovery: {
      expires_at: (source: Stripe.Checkout.Session.AfterExpiration.Recovery) =>
        timestampToDate(source.expires_at)
    },
    StripePrice: {
      id_ext: (source) => source.id,
      created: (source: Stripe.Price) => timestampToDate(source.created)
    }
  }
};
