import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../utils';
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
      default_price: Price
      service: Service!
    }

    input ServiceVariantFilter {
      name: String
      service_id: ID
    }

    extend type Query {
      service_variant(id: ID!): ServiceVariant
      service_variants(filter: ServiceVariantFilter!): [ServiceVariant!]
    }

    extend type Mutation {
      create_service_variant(service_id: ID!, name: String!, description: String, duration: String, status: String): ServiceVariantMutationResult!
      update_service_variant(service_variant_id: ID!, name: String, description: String, duration: String, default_price_id: ID, status: String): ServiceVariantMutationResult!
      delete_service_variant(service_variant_id: ID!): ServiceVariantMutationResult!
    }

    type ServiceVariantMutationResult implements MutationResult {
      success: Boolean!
      message: String
      service_variant: ServiceVariant
    }
  `,
  resolvers: {
    ServiceVariant: {
      ...createResolverForReferencedResource({ name: 'service' }),
      ...createResolverForReferencedResource({ name: 'default_price' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_service_variant(obj, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource }) => {
              const { status, name, description } = args;

              const stripe_product_args = {
                name,
                description,
                active: status === 'live'
              };

              // create product at stripe
              const stripe_product = await stripe.products.create(stripe_product_args);

              // create service variant resource
              const service_variant = await createResource('service variant', { ...args, stripe_id_ext: stripe_product.id });

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

              const { status, name, description } = service_variant;

              const stripe_product_args = {
                name,
                description,
                active: status === 'live'
              };

              // update product at stripe
              const stripe_product = await stripe.products.update(service_variant.stripe_id_ext, stripe_product_args);

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
      async delete_service_variant(obj, { service_variant_id }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ deleteResource }) => {
              const service_variant = await deleteResource(service_variant_id);
              
              if (service_variant == null) {
                return {
                  // error
                  success: false,
                  message: 'Service variant not found',
                  type: 'ServiceVariantMutationResult'
                };
              }

              // delete product from stripe
              const deleted = await stripe.products.del(service_variant.stripe_id_ext);

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
      }
    }
  }
};
