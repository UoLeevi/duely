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
import { Resources, withSession } from '@duely/db';
import {
  calculateTransactionFee,
  getTransactionFeePercentForSubscriptions
} from '../SubscriptionPlan';

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

    extend type Mutation {
      create_stripe_checkout_session(
        price_id: ID!
        livemode: Boolean!
        allow_promotion_codes: Boolean
        coupon_id: ID
        promotion_code_id: ID
        success_url: String
        cancel_url: String
      ): CreateStripeCheckoutSessionResult!
    }

    type CreateStripeCheckoutSessionResult implements MutationResult {
      success: Boolean!
      message: String
      checkout_session_id: String
      checkout_session_url: String
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

        // see: https://stripe.com/docs/api/checkout/sessions/line_items
        const list = await stripe
          .get(source.stripe_account)
          .checkout.sessions.listLineItems(source.id, args);

        return withStripeAccountProperty(list.data, source.stripe_account);
      }
    },
    SessionAfterExpirationRecovery: {
      expires_at: (source: Stripe.Checkout.Session.AfterExpiration.Recovery) =>
        timestampToDate(source.expires_at)
    },
    LineItem: {
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'price',
        object: 'price',
        expand: ['product'],
        role: 'owner'
      })
    },
    Mutation: {
      async create_stripe_checkout_session(
        obj,
        {
          price_id,
          livemode,
          success_url,
          cancel_url,
          allow_promotion_codes,
          promotion_code_id,
          coupon_id
        },
        context,
        info
      ) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource }) => {
            // get resources
            const price = await queryResource('price', price_id);
            const product = await queryResource('product', price.product_id);
            const stripe_account = await queryResource('stripe account', {
              agency_id: product.agency_id,
              livemode
            });
            const agency = await queryResource('agency', product.agency_id);
            const subdomain = await queryResource('subdomain', agency.subdomain_id);
            const product_settings = await queryResource('product settings', {
              product_id: product.id
            });
            const agency_settings = await queryResource('agency settings', {
              agency_id: product.agency_id
            });

            success_url =
              success_url ||
              product_settings?.checkout_success_url ||
              agency_settings?.checkout_success_url ||
              `https://${subdomain.name}.duely.app/orders/thank-you`;

            cancel_url =
              cancel_url ||
              product_settings?.checkout_cancel_url ||
              agency_settings?.checkout_cancel_url ||
              context.referer ||
              `https://${subdomain.name}.duely.app`;

            try {
              // validate and normalize url
              const success_url_obj = new URL(success_url);
              success_url_obj.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}');
              success_url = success_url_obj.href.replace('%7B', '{').replace('%7D', '}');

              // validate and normalize url
              const cancel_url_obj = new URL(cancel_url);
              cancel_url_obj.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}');
              cancel_url = cancel_url_obj.href.replace('%7B', '{').replace('%7D', '}');
            } catch (error: any) {
              return {
                // error
                success: false,
                message: error.message,
                type: 'CreateStripeCheckoutSessionResult'
              };
            }

            // create stripe checkout session
            // see: https://stripe.com/docs/connect/creating-a-payments-page
            // see: https://stripe.com/docs/payments/checkout/custom-success-page
            // see: https://stripe.com/docs/api/checkout/sessions/create
            const stripe_checkout_session_args: Stripe.Checkout.SessionCreateParams = {
              mode: price.type === 'recurring' ? 'subscription' : 'payment',
              payment_method_types: ['card'],
              line_items: [
                {
                  price: price.id,
                  quantity: 1
                }
              ],
              after_expiration: {
                recovery: { enabled: true, allow_promotion_codes }
              },
              success_url,
              cancel_url
            };

            if (price.type === 'recurring') {
              const application_fee_percent = await getTransactionFeePercentForSubscriptions(
                agency.subscription_plan_id
              );

              stripe_checkout_session_args.subscription_data = {
                application_fee_percent
              };
            } else {
              const application_fee_amount = await calculateTransactionFee(
                agency.subscription_plan_id,
                price.unit_amount,
                price.currency
              );

              stripe_checkout_session_args.payment_intent_data = {
                application_fee_amount
              };
            }

            if (coupon_id) {
              stripe_checkout_session_args.discounts = [
                {
                  coupon: coupon_id
                }
              ];
            } else if (promotion_code_id) {
              stripe_checkout_session_args.discounts = [
                {
                  promotion_code: promotion_code_id
                }
              ];
            } else if (allow_promotion_codes) {
              stripe_checkout_session_args.allow_promotion_codes = true;
            }

            const checkout_session = await stripe
              .get(stripe_account)
              .checkout.sessions.create(stripe_checkout_session_args);

            // success
            return {
              success: true,
              checkout_session_id: checkout_session.id,
              checkout_session_url: checkout_session.url,
              type: 'CreateStripeCheckoutSessionResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CreateStripeCheckoutSessionResult'
          };
        }
      }
    }
  }
};
