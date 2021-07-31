import { withSession } from '@duely/db';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { DuelyGraphQLError } from '../../errors';
import stripe from '@duely/stripe';

// interface BankAccount {
//   /**
//    * Unique identifier for the object.
//    */
//    id: string;

//    /**
//     * String representing the object's type. Objects of the same type share the same value.
//     */
//    object: 'bank_account';

//    /**
//     * The ID of the account that the bank account is associated with.
//     */
//    account?: string | Stripe.Account | null;

//    /**
//     * The name of the person or business that owns the bank account.
//     */
//    account_holder_name: string | null;

//    /**
//     * The type of entity that holds the account. This can be either `individual` or `company`.
//     */
//    account_holder_type: string | null;

//    /**
//     * A set of available payout methods for this bank account. Only values from this set should be passed as the `method` when creating a payout.
//     */
//    available_payout_methods?: Array<
//      BankAccount.AvailablePayoutMethod
//    > | null;

//    /**
//     * Name of the bank associated with the routing number (e.g., `WELLS FARGO`).
//     */
//    bank_name: string | null;

//    /**
//     * Two-letter ISO code representing the country the bank account is located in.
//     */
//    country: string;

//    /**
//     * Three-letter [ISO code for the currency](https://stripe.com/docs/payouts) paid out to the bank account.
//     */
//    currency: string;

//    /**
//     * The ID of the customer that the bank account is associated with.
//     */
//    customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null;

//    /**
//     * Whether this bank account is the default external account for its currency.
//     */
//    default_for_currency?: boolean | null;

//    deleted?: void;

//    /**
//     * Uniquely identifies this particular bank account. You can use this attribute to check whether two bank accounts are the same.
//     */
//    fingerprint: string | null;

//    /**
//     * The last four digits of the bank account number.
//     */
//    last4: string;

//    /**
//     * Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
//     */
//    metadata?: Stripe.Metadata | null;

//    /**
//     * The routing transit number for the bank account.
//     */
//    routing_number: string | null;

//    /**
//     * For bank accounts, possible values are `new`, `validated`, `verified`, `verification_failed`, or `errored`. A bank account that hasn't had any activity or validation performed is `new`. If Stripe can determine that the bank account exists, its status will be `validated`. Note that there often isn't enough information to know (e.g., for smaller credit unions), and the validation is not always run. If customer bank account verification has succeeded, the bank account status will be `verified`. If the verification failed for any reason, such as microdeposit failure, the status will be `verification_failed`. If a transfer sent to this bank account fails, we'll set the status to `errored` and will not continue to send transfers until the bank details are updated.
//     *
//     * For external accounts, possible values are `new` and `errored`. Validations aren't run against external accounts because they're only used for payouts. This means the other statuses don't apply. If a transfer fails, the status is set to `errored` and transfers are stopped until account details are updated.
//     */
//    status: string;
//  }

export const BankAccount: GqlTypeDefinition = {
  typeDef: gql`
    type BankAccount implements Node {
      id: ID!
      id_ext: ID!
      account_holder_name: String
      account_holder_type: String
      available_payout_methods: [String!]
      bank_name: String
      country: String!
      currency: String!
      default_for_currency: Boolean
      fingerprint: String
      last4: String!
      routing_number: String
      status: String!
    }

    extend type Mutation {
      create_bank_account(
        stripe_account_id: ID!
        country: String!
        currency: String!
        account_number: String!
        account_holder_name: String
        account_holder_type: String
        routing_number: String
        default_for_currency: Boolean
      ): BankAccountMutationResult!
      update_bank_account(
        stripe_account_id: ID!
        bank_account_id: ID!
        account_holder_name: String
        account_holder_type: String
        default_for_currency: Boolean
      ): BankAccountMutationResult!
      delete_bank_account(stripe_account_id: ID!, bank_account_id: ID!): BankAccountMutationResult!
    }

    type BankAccountMutationResult implements MutationResult {
      success: Boolean!
      message: String
      bank_account: BankAccount
    }
  `,
  resolvers: {
    BankAccount: {
      id_ext: (source) => source.id
    },
    Mutation: {
      async create_bank_account(obj, { stripe_account_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);

            const stripe_env = stripe_account.livemode ? 'live' : 'test';

            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const bank_account = await stripe[stripe_env].accounts.createExternalAccount(
              stripe_account.stripe_id_ext,
              {
                external_account: {
                  object: 'bank_account',
                  ...args
                }
              }
            );

            // success
            return {
              success: true,
              bank_account,
              type: 'BankAccountMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'BankAccountMutationResult'
          };
        }
      },
      async update_bank_account(
        obj,
        { stripe_account_id, bank_account_id, ...args },
        context,
        info
      ) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);

            const stripe_env = stripe_account.livemode ? 'live' : 'test';

            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const bank_account = await stripe[stripe_env].accounts.updateExternalAccount(
              stripe_account.stripe_id_ext,
              bank_account_id,
              args
            );

            // success
            return {
              success: true,
              bank_account,
              type: 'BankAccountMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'BankAccountMutationResult'
          };
        }
      },
      async delete_bank_account(obj, { stripe_account_id, bank_account_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);

            const stripe_env = stripe_account.livemode ? 'live' : 'test';

            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const bank_account = await stripe[stripe_env].accounts.deleteExternalAccount(
              stripe_account.stripe_id_ext,
              bank_account_id
            );

            // success
            return {
              success: true,
              bank_account,
              type: 'BankAccountMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'BankAccountMutationResult'
          };
        }
      }
    }
  }
};
