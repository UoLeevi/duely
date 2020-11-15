import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../utils';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';
import stripe from '../../../stripe';

const resource = {
  name: 'service'
};

export const Service = {
  typeDef: `
    type Service implements Node {
      id: ID!
      name: String!
      url_name: String!
      status: String!
      agency: Agency!
      default_variant: ServiceVariant!
    }

    input ServiceFilter {
      name: String
      agency_id: ID
      url_name: String
    }

    extend type Query {
      service(id: ID!): Service
      services(filter: ServiceFilter!): [Service!]
    }

    extend type Mutation {
      create_service(agency_id: ID!, name: String!, url_name: String!, description: String, duration: String, markdown_description_id: ID, image_logo_id: ID, image_hero_id: ID, status: String): ServiceMutationResult!
      update_service(service_id: ID!, name: String, url_name: String, description: String, duration: String, markdown_description_id: ID, image_logo_id: ID, image_hero_id: ID, default_price_id: ID, status: String): ServiceMutationResult!
      delete_service(service_id: ID!): ServiceMutationResult!
    }

    type ServiceMutationResult implements MutationResult {
      success: Boolean!
      message: String
      service: Service
    }
  `,
  resolvers: {
    Service: {
      ...createResolverForReferencedResource({ name: 'agency' }),
      ...createResolverForReferencedResource({ name: 'default_variant' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_service(obj, { agency_id, name, url_name, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (!validator.isSlug(url_name))
          return {
            success: false,
            message: `URL name format '${url_name}' is invalid.`,
            type: 'ServiceMutationResult'
          };

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource, updateResource }) => {
              const { status, description } = args;

              const stripe_product_args = {
                name,
                description,
                active: status === 'live'
              };

              // create product at stripe
              const stripe_product = await stripe.products.create(stripe_product_args);

              // create service resource
              const serviceCreationOptionalArgs = {};
              if (Object.prototype.hasOwnProperty.call(args, 'status')) serviceCreationOptionalArgs.status = args.status;
              const service = await createResource('service', { name, url_name, agency_id, ...serviceCreationOptionalArgs });

              // create service variant resource
              const service_variant = await createResource('service variant', { name, service_id: service.id, ...args, stripe_id_ext: stripe_product.id });

              // set service variant as default
              service.default_variant_id = service_variant.id;
              await updateResource(service.id, { default_variant_id: service.default_variant_id });

              // success
              return {
                success: true,
                service,
                type: 'ServiceMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceMutationResult'
          };
        }
      },
      async update_service(obj, { service_id, url_name, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (url_name != null && !validator.isSlug(url_name))
          return {
            success: false,
            message: `URL name format '${url_name}' is invalid.`,
            type: 'ServiceMutationResult'
          };

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource, updateResource }) => {
              // updata service resource
              const serviceUpdates = {};
              if (url_name != null) serviceUpdates.url_name = url_name;
              if (Object.prototype.hasOwnProperty.call(args, 'name')) serviceUpdates.name = args.name;
              if (Object.prototype.hasOwnProperty.call(args, 'status')) serviceUpdates.status = args.status;

              const service = await (Object.keys(serviceUpdates).length > 0
                ? updateResource(service_id, serviceUpdates)
                : queryResource(service_id));

              if (Object.keys(args).length > 0) {
                // update service variant resource
                const service_variant = await updateResource(service.default_variant_id, args);

                const { status, name, description } = service_variant;

                const stripe_product_args = {
                  name,
                  description,
                  active: status === 'live'
                };

                // update product at stripe
                const stripe_product = await stripe.products.update(service_variant.stripe_id_ext, stripe_product_args);
              }

              // success
              return {
                success: true,
                service,
                type: 'ServiceMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceMutationResult'
          };
        }
      },
      async delete_service(obj, { service_id }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResourceAll, deleteResource }) => {
              const service_variants = await queryResourceAll('service variant', { service_id });
              const stripe_product_ids = service_variants.map(v => v.stripe_id_ext);
              const service = await deleteResource(service_id);

              for (const stripe_product_id of stripe_product_ids) {
                // delete or deactivate product from stripe
                try {
                  await stripe.products.del(stripe_product_id);
                } catch {
                  await stripe.products.update(stripe_product_id, { active: false });
                }
              }

              // success
              return {
                success: true,
                service,
                type: 'ServiceMutationResult'
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
