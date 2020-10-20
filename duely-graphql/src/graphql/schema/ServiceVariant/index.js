import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource } from '../../utils';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';
import stripe from '../../../stripe';

const resource = {
  name: 'service variant',
  table_name: 'service_variant'
};

export const ServiceVariant = {
  typeDef: `
    type ServiceVariant implements Node {
      id: ID!
      name: String!
      status: String!
      description: String
      duration: String
      price: Int
      currency: String
      service: Service!
    }

    input ServiceVariantFilter {
      name: String
      service_id: ID
    }

    extend type Query {
      service_variant(id: ID!): ServiceVariant
      service_variants(filter: ServiceFilter!): [ServiceVariant!]
    }

    extend type Mutation {
      create_service_variant(service_id: ID!, name: String!, description: String, duration: String, price: Int, currency: String, status: String): ServiceVariantMutationResult!
      update_service_variant(service_variant_id: ID!, name: String, description: String, duration: String, price: Int, currency: String, status: String): ServiceVariantMutationResult!
      create_stripe_checkout_session(service_variant_id: ID!): CreateStripeCheckoutSessionResult!
    }

    type ServiceVariantMutationResult implements MutationResult {
      success: Boolean!
      message: String
      service_variant: ServiceVariant
    }

    type CreateStripeCheckoutSessionResult implements MutationResult {
      success: Boolean!
      message: String
      checkout_session_id: String
    }
  `,
  resolvers: {
    ServiceVariant: {
      async service(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource(source.service_id);
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_service_variant(obj, { service_id, name, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource }) => {
              // create service variant resource
              const service_variant = await createResource('service variant', { name, service_id, ...args });

              // success
              return {
                success: true,
                service_variant,
                type: 'ServiceVariantMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceVariantMutationResult'
          };
        }
      },
      async update_service_variant(obj, { service_variant_id, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // update service variant resource
              const service_variant = await updateResource(service_variant_id, args);

              // success
              return {
                success: true,
                service_variant,
                type: 'ServiceVariantMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceVariantMutationResult'
          };
        }
      },
      async create_stripe_checkout_session(obj, { service_variant_id }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              // get resources
              const service_variant = await queryResource(service_variant_id);
              const service = await queryResource(service_variant.service_id);
              const agency = await queryResource(service.agency_id);
              const stripe_account = await queryResource('stripe account', { agency_id: agency.id });

              // create stripe checkout session
              // see: https://stripe.com/docs/connect/creating-a-payments-page
              const checkout_session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                  name: service_variant.name ?? service.name,
                  amount: service_variant.price,
                  currency: service_variant.currency,
                  quantity: 1,
                }],
                payment_intent_data: {
                  application_fee_amount: Math.round(service_variant.price * 0.045),
                  transfer_data: {
                    destination: stripe_account.stripe_id_ext,
                  },
                },
                success_url: 'https://duely.app/success',
                cancel_url: 'https://duely.app/failure',
              });

              // success
              return {
                success: true,
                checkout_session_id: checkout_session.id,
                type: 'ServiceVariantMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceVariantMutationResult'
          };
        }
      }
    }
  }
};
