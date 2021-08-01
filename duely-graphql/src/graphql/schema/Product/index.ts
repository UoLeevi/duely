import { withSession, ProductResource, Resources } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll
} from '../../util';
import validator from 'validator';
import stripe from '@duely/stripe';
import { validateAndReadDataUrlAsBuffer } from '../Image';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'product'
} as const;

export const Product: GqlTypeDefinition<Resources['product']> = {
  typeDef: gql`
    type Product implements Node {
      id: ID!
      name: String!
      url_name: String!
      status: String!
      active: Boolean!
      description: String
      duration: String
      default_price: Price
      agency: Agency!
      prices(
        filter: PriceFilter
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Price!]
      image_logo: Image
      image_hero: Image
      markdown_description: Markdown
      integrations: [Integration!]
      pages(
        filter: PageFilter
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Page!]
      settings: ProductSettings!
    }

    input ProductFilter {
      name: String
      agency_id: ID
      url_name: String
      status: String
      active: Boolean
    }

    extend type Query {
      product(id: ID!): Product
      products(
        filter: ProductFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Product!]
      count_products(filter: ProductFilter!, token: String): Int!
    }

    extend type Mutation {
      create_product(
        agency_id: ID!
        name: String!
        url_name: String!
        description: String
        duration: String
        markdown_description_id: ID
        image_logo: ImageInput
        image_logo_id: ID
        image_hero: ImageInput
        status: String
      ): ProductMutationResult!
      update_product(
        product_id: ID!
        name: String
        url_name: String
        description: String
        duration: String
        default_price_id: ID
        markdown_description_id: ID
        image_logo: ImageInput
        image_logo_id: ID
        image_hero: ImageInput
        status: String
      ): ProductMutationResult!
      delete_product(product_id: ID!): ProductMutationResult!
    }

    type ProductMutationResult implements MutationResult {
      success: Boolean!
      message: String
      product: Product
    }
  `,
  resolvers: {
    Product: {
      ...createResolverForReferencedResource({ name: 'agency' }),
      ...createResolverForReferencedResource({ name: 'default_price', resource_name: 'price' }),
      ...createResolverForReferencedResourceAll({
        name: 'prices',
        resource_name: 'price',
        column_name: 'product_id'
      }),
      ...createResolverForReferencedResource({ name: 'image_logo', resource_name: 'image' }),
      ...createResolverForReferencedResource({ name: 'image_hero', resource_name: 'image' }),
      ...createResolverForReferencedResource({
        name: 'markdown_description',
        resource_name: 'markdown'
      }),
      ...createResolverForReferencedResourceAll({
        name: 'pages',
        resource_name: 'page',
        column_name: 'product_id'
      }),
      ...createResolverForReferencedResourceAll({
        name: 'integrations',
        resource_name: 'integration',
        column_name: 'product_id'
      }),
      ...createResolverForReferencedResource({
        name: 'settings',
        resource_name: 'product settings',
        reverse: true,
        column_name: 'product_id'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_product(obj, { image_logo, image_hero, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        if (!validator.isSlug(args.url_name))
          return {
            success: false,
            message: `URL name format '${args.url_name}' is invalid.`,
            type: 'ProductMutationResult'
          };

        try {
          return await withSession(
            context,
            async ({ queryResource, createResource, updateResource }) => {
              const agency = await queryResource('agency', args.agency_id);
              const subdomain = await queryResource('subdomain', agency.subdomain_id);

              const { status, name, description } = args;
              const stripe_product_args: Stripe.ProductCreateParams = {
                name,
                description,
                active: status === 'live'
              };

              if (image_logo) {
                // validate and read logo image
                const [, validationError] = validateAndReadDataUrlAsBuffer(image_logo.data);

                if (validationError) {
                  return {
                    success: false,
                    message: 'Logo image validation failed. ' + validationError,
                    type: 'ProductMutationResult'
                  };
                }

                // create logo image
                const image = await createResource('image', {
                  ...image_logo,
                  agency_id: args.agency_id,
                  access: 'public'
                });
                args.image_logo_id = image.id;
                stripe_product_args.images = [
                  `https://${subdomain.name}.duely.app/asset/image/${image.id}`
                ];
              }

              if (image_hero) {
                // validate and read hero image
                const [, validationError] = validateAndReadDataUrlAsBuffer(image_hero.data);

                if (validationError) {
                  return {
                    success: false,
                    message: 'Hero image validation failed. ' + validationError,
                    type: 'ProductMutationResult'
                  };
                }

                // create hero image
                const image = await createResource('image', {
                  ...image_hero,
                  agency_id: args.agency_id,
                  access: 'public'
                });
                args.image_hero_id = image.id;
              }

              // create product resource
              let product = await createResource('product', args);

              const stripe_envs = agency.livemode
                ? (['test', 'live'] as const)
                : (['test'] as const);

              const stripe_product: Record<'test' | 'live', Stripe.Product | undefined> = {
                test: undefined,
                live: undefined
              };

              for (const stripe_env of stripe_envs) {
                const stripe_account = await queryResource('stripe account', {
                  livemode: stripe_env === 'live',
                  agency_id: agency.id
                });

                // create product at stripe
                stripe_product[stripe_env] = await stripe
                  .get(stripe_account)
                  .products.create(stripe_product_args);
              }

              // update product resource
              product = await updateResource('product', product.id, {
                stripe_prod_id_ext_live: stripe_product.live?.id,
                stripe_prod_id_ext_test: stripe_product.test?.id
              });

              // success
              return {
                success: true,
                product,
                type: 'ProductMutationResult'
              };
            }
          );
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductMutationResult'
          };
        }
      },
      async update_product(obj, { product_id, image_logo, image_hero, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        if (args.url_name != null && !validator.isSlug(args.url_name))
          return {
            success: false,
            message: `URL name format '${args.url_name}' is invalid.`,
            type: 'ProductMutationResult'
          };

        try {
          return await withSession(
            context,
            async ({ queryResource, createResource, updateResource }) => {
              const { agency_id } = await queryResource('product', product_id);
              const agency = await queryResource('agency', agency_id);
              const subdomain = await queryResource('subdomain', agency.subdomain_id);
              const stripe_product_args: Stripe.ProductUpdateParams = {};

              if (image_logo) {
                // validate and read logo image
                const [, validationError] = validateAndReadDataUrlAsBuffer(image_logo.data);

                if (validationError) {
                  return {
                    success: false,
                    message: 'Logo image validation failed. ' + validationError,
                    type: 'ProductMutationResult'
                  };
                }

                // create logo image
                const image = await createResource('image', {
                  ...image_logo,
                  agency_id,
                  access: 'public'
                });
                args.image_logo_id = image.id;
                stripe_product_args.images = [
                  `https://${subdomain.name}.duely.app/asset/image/${image.id}`
                ];
              }

              if (image_hero) {
                // validate and read hero image
                const [, validationError] = validateAndReadDataUrlAsBuffer(image_hero.data);

                if (validationError) {
                  return {
                    success: false,
                    message: 'Hero image validation failed. ' + validationError,
                    type: 'ProductMutationResult'
                  };
                }

                // create hero image
                const image = await createResource('image', {
                  ...image_hero,
                  agency_id,
                  access: 'public'
                });
                args.image_hero_id = image.id;
              }

              // update product resource
              const product = await updateResource('product', product_id, args);

              const { status, name, description } = product;
              stripe_product_args.name = name;
              stripe_product_args.description = description ?? undefined;
              stripe_product_args.active = status === 'live';

              const stripe_envs = agency.livemode
                ? (['test', 'live'] as const)
                : (['test'] as const);

              for (const stripe_env of stripe_envs) {
                const stripe_account = await queryResource('stripe account', {
                  livemode: stripe_env === 'live',
                  agency_id
                });

                // update product at stripe
                await stripe
                  .get(stripe_account)
                  .products.update(
                    product[
                      `stripe_prod_id_ext_${stripe_env}` as
                        | 'stripe_prod_id_ext_live'
                        | 'stripe_prod_id_ext_test'
                    ]!,
                    stripe_product_args
                  );
              }

              // success
              return {
                success: true,
                product,
                type: 'ProductMutationResult'
              };
            }
          );
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductMutationResult'
          };
        }
      },
      async delete_product(obj, { product_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, updateResource }) => {
            const product = await updateResource('product', product_id, { active: false });

            if (product == null) {
              return {
                // error
                success: false,
                message: 'Product not found',
                type: 'ProductMutationResult'
              };
            }

            const agency = await queryResource('agency', product.agency_id);

            const stripe_envs = agency.livemode ? (['test', 'live'] as const) : (['test'] as const);

            for (const stripe_env of stripe_envs) {
              const stripe_account = await queryResource('stripe account', {
                livemode: stripe_env === 'live',
                agency_id: product.agency_id
              });

              // deactivate product from stripe
              await stripe
                .get(stripe_account)
                .products.update(
                  product[`stripe_prod_id_ext_${stripe_env}` as keyof ProductResource] as string,
                  { active: false }
                );
            }

            // success
            return {
              success: true,
              product,
              type: 'ProductMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ProductMutationResult'
          };
        }
      }
    }
  }
};
