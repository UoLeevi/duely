import { withConnection } from '../../../db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import validator from 'validator';
import stripe from '../../../stripe';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';

const resource = {
  name: 'customer'
};

export const Customer: GqlTypeDefinition = {
  typeDef: gql`
    type Customer {
      id: ID!
      name: String
      email_address: String!
      default_stripe_customer: StripeCustomer!
      stripe_customers(
        created: DateTime
        starting_after_id: String
        ending_before_id: String
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
      customer(id: ID!): Customer
      customers(filter: CustomerFilter!): [Customer!]
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
      ...createResolverForReferencedResource({ name: 'stripe_account' }),
      ...createResolverForReferencedResource({ name: 'user' }),
      async default_stripe_customer(source, args, context) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          const stripe_account = await withConnection(
            context,
            async (withSession) =>
              await withSession(
                async ({ queryResource }) => await queryResource(source.stripe_account_id)
              )
          );

          const stripe_env = stripe_account.livemode ? 'live' : 'test';

          // see: https://stripe.com/docs/api/customers/retrieve
          const stripe_customer = await stripe[stripe_env].customers.retrieve(
            source.default_stripe_id_ext,
            {
              stripeAccount: stripe_account.stripe_id_ext
            }
          );

          return {
            stripeAccount: stripe_account.stripe_id_ext,
            ...stripe_customer
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
      async stripe_customers(
        source,
        { starting_after_id, ending_before_id, ...args },
        context,
        info
      ) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          const stripe_account = await withConnection(
            context,
            async (withSession) =>
              await withSession(
                async ({ queryResource }) => await queryResource(source.stripe_account_id)
              )
          );

          const stripe_env = stripe_account.livemode ? 'live' : 'test';

          args.email = source.email_address;

          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
          }

          // see: https://stripe.com/docs/api/customers/list
          const list = await stripe[stripe_env].customers.list(args, {
            stripeAccount: stripe_account.stripe_id_ext
          });
          return list.data?.map((cus) => ({
            stripeAccount: stripe_account.stripe_id_ext,
            ...cus
          }));
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_customer(obj, { stripe_account_id, email_address, name }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        if (!validator.isEmail(email_address))
          return {
            success: false,
            message: `Email address '${email_address}' format is invalid.`,
            type: 'CustomerMutationResult'
          };

        email_address = validator.normalizeEmail(email_address);

        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ queryResource, createResource }) => {
              const stripe_account = await queryResource(stripe_account_id);

              const stripe_customer_args: Stripe.CustomerCreateParams = {
                name,
                email: email_address,
                metadata: {
                  creation_mode: 'api'
                }
              };

              const stripe_env = stripe_account.livemode ? 'live' : 'test';

              // create customer at stripe
              const stripe_customer = await stripe[stripe_env].customers.create(
                stripe_customer_args,
                {
                  stripeAccount: stripe_account.stripe_id_ext
                }
              );

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
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CustomerMutationResult'
          };
        }
      },
      async update_customer(obj, { customer_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

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
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ queryResource, createResource, updateResource }) => {
              const { stripe_account_id } = await queryResource(customer_id);

              if (stripe_account_id == null) {
                return {
                  // error
                  success: false,
                  message: 'Customer not found',
                  type: 'CustomerMutationResult'
                };
              }

              const stripe_account = await queryResource(stripe_account_id);
              const stripe_customer_args: Stripe.CustomerUpdateParams = {};

              // update customer resource
              const customer = await updateResource(customer_id, args);

              stripe_customer_args.name = customer.name;
              stripe_customer_args.email = customer.email_address;

              const stripe_env = stripe_account.livemode ? 'live' : 'test';

              // update customer at stripe
              await stripe[stripe_env].customers.update(
                customer.default_stripe_id_ext,
                stripe_customer_args,
                { stripeAccount: stripe_account.stripe_id_ext }
              );

              // success
              return {
                success: true,
                customer,
                type: 'CustomerMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CustomerMutationResult'
          };
        }
      },
      async delete_customer(obj, { customer_id }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ queryResource, deleteResource }) => {
              const customer = await deleteResource(customer_id);

              if (customer == null) {
                return {
                  // error
                  success: false,
                  message: 'Customer not found',
                  type: 'CustomerMutationResult'
                };
              }

              const stripe_account = await queryResource(customer.stripe_account_id);

              const stripe_env = stripe_account.livemode ? 'live' : 'test';

              // delete customer from stripe
              await stripe[stripe_env].customers.del(customer.default_stripe_id_ext, {
                stripeAccount: stripe_account.stripe_id_ext
              });

              // success
              return {
                success: true,
                customer,
                type: 'CustomerMutationResult'
              };
            });
          });
        } catch (error) {
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
