import { withConnection } from '../../../db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import stripe from '../../../stripe';

const resource = {
  name: 'price',
  table_name: 'price'
};

export const Price = {
  typeDef: `
    type Price implements Node {
      id: ID!
      name: String!
      status: String!
      type: String!
      unit_amount: Int!
      currency: String!
      recurring_interval: String
      recurring_interval_count: Int
      service_variant: ServiceVariant!
    }

    input PriceFilter {
      service_variant_id: ID
    }

    extend type Query {
      price(id: ID!): Price
      prices(filter: PriceFilter!): [Price!]
    }

    extend type Mutation {
      create_price(service_variant_id: ID!, unit_amount: Int!, currency: String!, recurring_interval: String, recurring_interval_count: Int, status: String): PriceMutationResult!
      update_price(price_id: ID!, status: String!): PriceMutationResult!
      delete_price(price_id: ID!): PriceMutationResult!
      create_stripe_checkout_session(price_id: ID!, success_url: String, cancel_url: String): CreateStripeCheckoutSessionResult!
    }

    type PriceMutationResult implements MutationResult {
      success: Boolean!
      message: String
      price: Price
    }
    
    type CreateStripeCheckoutSessionResult implements MutationResult {
      success: Boolean!
      message: String
      checkout_session_id: String
    }
  `,
  resolvers: {
    Price: {
      name(price) {
        let text = formatCurrency(price.unit_amount / 100, price.currency);

        if (price.type === 'recurring') {
          const count = price.recurring_interval_count;
          text +=
            count > 1
              ? ` every ${count} ${price.recurring_interval}s`
              : ` every ${price.recurring_interval}`;
        }

        return text;

        function formatCurrency(amount, currency, country_code) {
          currency = currency.toUpperCase();
          country_code = country_code ?? 'US';
          return new Intl.NumberFormat('en-' + country_code, {
            currency,
            style: 'currency'
          }).format(amount);
        }
      },
      ...createResolverForReferencedResource({ name: 'service_variant' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_price(obj, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ createResource, queryResource }) => {
              const service_variant = await queryResource(args.service_variant_id);
              const service = await queryResource(service_variant.service_id);
              const stripe_account = await queryResource('stripe account', {
                agency_id: service.agency_id
              });

              if (service_variant == null) {
                throw Error('Service variant not found');
              }

              const {
                status,
                unit_amount,
                currency,
                recurring_interval: interval,
                recurring_interval_count: interval_count
              } = args;

              const stripe_price_args = {
                unit_amount,
                currency,
                product: service_variant.stripe_id_ext,
                active: status === 'live'
              };

              if (interval) {
                stripe_price_args.recurring = {
                  interval,
                  interval_count: interval_count ?? 1
                };
              }

              // create price object at stripe
              const stripe_price = await stripe.prices.create(stripe_price_args, {
                stripeAccount: stripe_account.stripe_id_ext
              });

              // create price resource
              const price = await createResource('price', {
                ...args,
                stripe_id_ext: stripe_price.id
              });

              // success
              return {
                success: true,
                price,
                type: 'PriceMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PriceMutationResult'
          };
        }
      },
      async update_price(obj, { price_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ queryResource, updateResource }) => {
              // update price resource
              const price = await updateResource(price_id, args);
              const service_variant = await queryResource(price.service_variant_id);
              const service = await queryResource(service_variant.service_id);
              const stripe_account = await queryResource('stripe account', {
                agency_id: service.agency_id
              });

              const { status } = price;

              const stripe_price_args = {
                active: status === 'live'
              };

              // update price object at stripe
              const stripe_price = await stripe.prices.update(
                price.stripe_id_ext,
                stripe_price_args,
                { stripeAccount: stripe_account.stripe_id_ext }
              );

              // success
              return {
                success: true,
                price,
                type: 'PriceMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PriceMutationResult'
          };
        }
      },
      async delete_price(obj, { price_id }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ queryResource, deleteResource }) => {
              const price = await deleteResource(price_id);
              const service_variant = await queryResource(price.service_variant_id);
              const service = await queryResource(service_variant.service_id);
              const stripe_account = await queryResource('stripe account', {
                agency_id: service.agency_id
              });

              try {
                // try deactivate price at stripe
                await stripe.prices.update(
                  price.stripe_id_ext,
                  { active: false },
                  { stripeAccount: stripe_account.stripe_id_ext }
                );
              } catch {
                // ignore error
              }

              if (price == null) {
                return {
                  // error
                  success: false,
                  message: 'Price not found',
                  type: 'PriceMutationResult'
                };
              }

              // success
              return {
                success: true,
                price,
                type: 'PriceMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PriceMutationResult'
          };
        }
      },
      async create_stripe_checkout_session(
        obj,
        { price_id, success_url, cancel_url },
        context,
        info
      ) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ queryResource }) => {
              // get resources
              const price = await queryResource(price_id);
              const service_variant = await queryResource(price.service_variant_id);
              const service = await queryResource(service_variant.service_id);
              const stripe_account = await queryResource('stripe account', {
                agency_id: service.agency_id
              });
              const agency = await queryResource(service.agency_id);
              const subdomain = await queryResource(agency.subdomain_id);

              if (!success_url) {
                const service_thank_you_page_setting = await queryResource(
                  'service thank you page setting',
                  { service_id: service.id }
                );
                success_url = service_thank_you_page_setting?.url;
              }

              if (!success_url) {
                const agency_thank_you_page_setting = await queryResource(
                  'agency thank you page setting',
                  { agency_id: service.agency_id }
                );
                success_url = agency_thank_you_page_setting?.url;
              }

              if (!success_url) {
                success_url = `https://${subdomain.name}.duely.app/orders/thank-you`;
              }

              try {
                // validate and normalize url
                const url = new URL(success_url);
                url.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}');
                success_url = url.href.replace('%7B', '{').replace('%7D', '}');
              } catch (error) {
                return {
                  // error
                  success: false,
                  message: error.message,
                  type: 'CreateStripeCheckoutSessionResult'
                };
              }

              if (!cancel_url) {
                cancel_url = context.referer ?? `https://${subdomain.name}.duely.app`;
              }

              const application_fee_percent = 1;

              // create stripe checkout session
              // see: https://stripe.com/docs/connect/creating-a-payments-page
              // see: https://stripe.com/docs/payments/checkout/custom-success-page
              const stripe_checkout_session_args = {
                mode: price.type === 'recurring' ? 'subscription' : 'payment',
                payment_method_types: ['card'],
                line_items: [
                  {
                    price: price.stripe_id_ext,
                    quantity: 1
                  }
                ],
                success_url,
                cancel_url
              };

              if (price.type === 'recurring') {
                stripe_checkout_session_args.subscription_data = {
                  application_fee_percent
                };
              } else {
                stripe_checkout_session_args.payment_intent_data = {
                  application_fee_amount: Math.round(
                    (price.unit_amount * application_fee_percent) / 100
                  )
                };
              }

              const checkout_session = await stripe.checkout.sessions.create(
                stripe_checkout_session_args,
                { stripeAccount: stripe_account.stripe_id_ext }
              );

              // success
              return {
                success: true,
                checkout_session_id: checkout_session.id,
                type: 'CreateStripeCheckoutSessionResult'
              };
            });
          });
        } catch (error) {
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
