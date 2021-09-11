// see: https://stripe.com/docs/api/invoices/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources, withSession } from '@duely/db';
import { DuelyGraphQLError } from '../../errors';
import stripe from '@duely/stripe';
import { withStripeAccountProperty } from '../../util';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';

export const InvoiceLineItem: GqlTypeDefinition<
  Stripe.InvoiceLineItem & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    interface InvoiceLineItem {
   */
      id: String!
      amount: Int!
      currency: String!
      description: String
      discount_amounts: Array<InvoiceLineItem.DiscountAmount> | null;
      discountable: Boolean!
      discounts: Array<string | Stripe.Discount> | null;
      invoice_item?: String!
      livemode: Boolean!
      metadata: Stripe.Metadata;
      period: InvoiceLineItem.Period;
      plan: Stripe.Plan | null;
      price: Stripe.Price | null;
      proration: Boolean!
      quantity: Int
      subscription: String
      subscription_item?: String!
      tax_amounts?: Array<InvoiceLineItem.TaxAmount>;
      tax_rates?: Array<Stripe.TaxRate>;
      type: InvoiceLineItem.Type;
    }
  `,
  resolvers: {
    InvoiceLineItem: {
      id_ext: (source) => source.id
    }
  }
};
