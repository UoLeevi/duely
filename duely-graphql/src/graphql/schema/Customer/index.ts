import {
  countResource,
  queryResource,
  queryResourceAccess,
  queryResourceAll,
  Resources,
  withSession
} from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  withStripeAccountProperty
} from '../../util';
import validator from 'validator';
import stripe from '@duely/stripe';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { DuelyGraphQLError } from '../../errors';
import { pick } from '@duely/util';

const resource = {
  name: 'customer'
} as const;

export const Customer: GqlTypeDefinition<Resources['customer']> = {
  typeDef: gql`
    type Customer {
      id: ID!
      name: String
      email_address: String!
      default_stripe_customer: StripeCustomer!
      stripe_customers(
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [StripeCustomer!]!
      user: User
      stripe_account: StripeAccount!
    }

    input CustomerFilter {
      stripe_account_id: ID
      email_address: String
      default_stripe_customer_id_ext: ID
    }

    extend type Query {
      customer(id: ID!, stripe_account_id: ID, token: String): Customer
      customers(
        filter: CustomerFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Customer!]
      count_customers(filter: CustomerFilter!, token: String): Int!
    }

    extend type Mutation {
      create_customer(
        stripe_account_id: ID!
        email_address: String!
        name: String
      ): CustomerMutationResult!
      update_customer(
        customer_id: ID!
        name: String
        email_address: String
      ): CustomerMutationResult!
      delete_customer(customer_id: ID!): CustomerMutationResult!
    }

    type CustomerMutationResult implements MutationResult {
      success: Boolean!
      message: String
      customer: Customer
    }
  `,
  resolvers: {
    Customer: {
      ...createResolverForReferencedResource({
        name: 'stripe_account',
        resource_name: 'stripe account'
      }),
      ...createResolverForReferencedResource({ name: 'user' }),
      async default_stripe_customer(source, args, context) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const stripe_account = await queryResource(
            context,
            'stripe account',
            source.stripe_account_id
          );

          const stripe_env = stripe_account.livemode ? 'live' : 'test';

          // see: https://stripe.com/docs/api/customers/retrieve
          const stripe_customer = await stripe
            .get(stripe_account)
            .customers.retrieve(source.default_stripe_id_ext);

          return withStripeAccountProperty(stripe_customer, stripe_account);
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      async stripe_customers(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const stripe_account = await queryResource(
            context,
            'stripe account',
            source.stripe_account_id
          );

          args.email = source.email_address;

          // see: https://stripe.com/docs/api/customers/list
          const list = await stripe.get(stripe_account).customers.list(args);
          return withStripeAccountProperty(list.data, stripe_account);
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      async customer(
        source,
        args: { id: string; stripe_account_id?: string; token?: string },
        context
      ) {
        if (!context.jwt) {
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');
        }

        return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
          let customer = await queryResource('customer', args.id, args.token);

          if (!customer) {
            customer = await queryResource(
              'customer',
              { default_stripe_id_ext: args.id },
              args.token
            );
          }

          if (!customer && args.stripe_account_id) {
            const stripe_account = await queryResource('stripe account', args.stripe_account_id);

            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', `Only owner can access this information`);
            }

            let stripe_customer = (await stripe
              .get(stripe_account)
              .customers.retrieve(args.id)) as Stripe.Customer;
            if (!stripe_customer || !stripe_customer.email) return null;

            customer = await queryResource(
              'customer',
              { email_address: stripe_customer.email, stripe_account_id: stripe_account.id },
              args.token
            );
          }

          return customer;
        });
      },
      ...pick(createDefaultQueryResolversForResource(resource), ['customers', 'count_customers'])
    },
    Mutation: {
      async create_customer(obj, { stripe_account_id, email_address, name }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        if (!validator.isEmail(email_address))
          return {
            success: false,
            message: `Email address '${email_address}' format is invalid.`,
            type: 'CustomerMutationResult'
          };

        email_address = validator.normalizeEmail(email_address);

        try {
          return await withSession(context, async ({ queryResource, createResource }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);

            const stripe_customer_args: Stripe.CustomerCreateParams = {
              name,
              email: email_address,
              metadata: {
                creation_mode: 'api'
              }
            };

            // create customer at stripe
            const stripe_customer = await stripe
              .get(stripe_account)
              .customers.create(stripe_customer_args);

            // create customer resource
            const customer = await createResource('customer', {
              stripe_account_id,
              email_address,
              name,
              default_stripe_id_ext: stripe_customer.id
            });

            // success
            return {
              success: true,
              customer,
              type: 'CustomerMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CustomerMutationResult'
          };
        }
      },
      async update_customer(obj, { customer_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        if (args.email_address) {
          if (!validator.isEmail(args.email_address))
            return {
              success: false,
              message: `Email address '${args.email_address}' format is invalid.`,
              type: 'CustomerMutationResult'
            };

          args.email_address = validator.normalizeEmail(args.email_address);
        }

        try {
          return await withSession(context, async ({ queryResource, updateResource }) => {
            const { stripe_account_id } = await queryResource('customer', customer_id);

            if (stripe_account_id == null) {
              return {
                // error
                success: false,
                message: 'Customer not found',
                type: 'CustomerMutationResult'
              };
            }

            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const stripe_customer_args: Stripe.CustomerUpdateParams = {};

            // update customer resource
            const customer = await updateResource('customer', customer_id, args);

            stripe_customer_args.name = customer.name ?? undefined;
            stripe_customer_args.email = customer.email_address;

            // update customer at stripe
            await stripe
              .get(stripe_account)
              .customers.update(customer.default_stripe_id_ext, stripe_customer_args);

            // success
            return {
              success: true,
              customer,
              type: 'CustomerMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CustomerMutationResult'
          };
        }
      },
      async delete_customer(obj, { customer_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, deleteResource }) => {
            const customer = await deleteResource('customer', customer_id);

            if (customer == null) {
              return {
                // error
                success: false,
                message: 'Customer not found',
                type: 'CustomerMutationResult'
              };
            }

            const stripe_account = await queryResource(
              'stripe account',
              customer.stripe_account_id
            );

            // delete customer from stripe
            await stripe.get(stripe_account).customers.del(customer.default_stripe_id_ext);

            // success
            return {
              success: true,
              customer,
              type: 'CustomerMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CustomerMutationResult'
          };
        }
      }
    }
  }
};
