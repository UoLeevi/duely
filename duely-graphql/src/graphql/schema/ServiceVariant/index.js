import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource, createResolverForReferencedResourceAll } from '../../util';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';
import stripe from '../../../stripe';
import { validateAndReadDataUrlAsBuffer } from '../Image';

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
      prices(filter: PriceFilter): [Price!]
      image_logo: Image
      image_hero: Image
      markdown_description: Markdown
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
      create_service_variant(service_id: ID!, name: String!, description: String, duration: String, markdown_description_id: ID, image_logo: ImageInput, image_logo_id: ID, image_hero: ImageInput, status: String): ServiceVariantMutationResult!
      update_service_variant(service_variant_id: ID!, name: String, description: String, duration: String, default_price_id: ID, markdown_description_id: ID, image_logo: ImageInput, image_logo_id: ID, image_hero: ImageInput, status: String): ServiceVariantMutationResult!
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
      ...createResolverForReferencedResource({ name: 'default_price' }),
      ...createResolverForReferencedResourceAll({ name: 'prices', resource_name: 'price', column_name: 'service_variant_id' }),
      ...createResolverForReferencedResource({ name: 'image_logo' }),
      ...createResolverForReferencedResource({ name: 'image_hero' }),
      ...createResolverForReferencedResource({ name: 'markdown_description' }),
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_service_variant(obj, { image_logo, image_hero, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource, createResource }) => {
              const service = await queryResource(args.service_id);
              const stripe_account = await queryResource('stripe account', { agency_id: service.agency_id });

              if (image_logo) {
                // validate and read logo image
                const [, validationError] = validateAndReadDataUrlAsBuffer(image_logo.data);

                if (validationError) {
                  return {
                    success: false,
                    message: 'Logo image validation failed. ' + validationError,
                    type: 'ServiceMutationResult'
                  };
                }

                // create logo image
                const image = await createResource('image', { ...image_logo, agency_id: service.agency_id, access: 'public' });
                args.image_logo_id = image.id;
              }

              if (image_hero) {
                // validate and read hero image
                const [, validationError] = validateAndReadDataUrlAsBuffer(image_hero.data);

                if (validationError) {
                  return {
                    success: false,
                    message: 'Hero image validation failed. ' + validationError,
                    type: 'ServiceMutationResult'
                  };
                }

                // create hero image
                const image = await createResource('image', { ...image_hero, agency_id: service.agency_id, access: 'public' });
                args.image_hero_id = image.id;
              }

              const { status, name, description } = args;

              const stripe_product_args = {
                name,
                description,
                active: status === 'live'
              };

              // create product at stripe
              const stripe_product = await stripe.products.create(
                stripe_product_args,
                { stripeAccount: stripe_account.stripe_id_ext });

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
      async update_service_variant(obj, { service_variant_id, image_logo, image_hero, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource, createResource, updateResource }) => {

              const { service_id } = await queryResource(service_variant_id);
              const service = await queryResource(service_id);
              const stripe_account = await queryResource('stripe account', { agency_id: service.agency_id });

              if (image_logo) {
                // validate and read logo image
                const [, validationError] = validateAndReadDataUrlAsBuffer(image_logo.data);

                if (validationError) {
                  return {
                    success: false,
                    message: 'Logo image validation failed. ' + validationError,
                    type: 'ServiceMutationResult'
                  };
                }

                // create logo image
                const image = await createResource('image', { ...image_logo, agency_id: service.agency_id, access: 'public' });
                args.image_logo_id = image.id;
              }

              if (image_hero) {
                // validate and read hero image
                const [, validationError] = validateAndReadDataUrlAsBuffer(image_hero.data);

                if (validationError) {
                  return {
                    success: false,
                    message: 'Hero image validation failed. ' + validationError,
                    type: 'ServiceMutationResult'
                  };
                }

                // create hero image
                const image = await createResource('image', { ...image_hero, agency_id: service.agency_id, access: 'public' });
                args.image_hero_id = image.id;
              }


              // update service variant resource
              const service_variant = await updateResource(service_variant_id, args);

              const { status, name, description } = service_variant;

              const stripe_product_args = {
                name,
                description,
                active: status === 'live'
              };

              // update product at stripe
              const stripe_product = await stripe.products.update(
                service_variant.stripe_id_ext,
                stripe_product_args,
                { stripeAccount: stripe_account.stripe_id_ext });

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
            return await withSession(async ({ queryResource, deleteResource }) => {
              const service_variant = await deleteResource(service_variant_id);
              const service = await queryResource(service_variant.service_id);
              const stripe_account = await queryResource('stripe account', { agency_id: service.agency_id });

              if (service_variant == null) {
                return {
                  // error
                  success: false,
                  message: 'Service variant not found',
                  type: 'ServiceVariantMutationResult'
                };
              }

              // delete or deactivate product from stripe
              try {
                await stripe.products.del(
                  service_variant.stripe_id_ext,
                  { stripeAccount: stripe_account.stripe_id_ext });
              } catch {
                await stripe.products.update(
                  service_variant.stripe_id_ext,
                  { active: false },
                  { stripeAccount: stripe_account.stripe_id_ext });
              }

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
