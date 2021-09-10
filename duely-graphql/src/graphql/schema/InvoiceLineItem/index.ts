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
      quantity: number | null;
      subscription: String
      subscription_item?: String!
      tax_amounts?: Array<InvoiceLineItem.TaxAmount>;
      tax_rates?: Array<Stripe.TaxRate>;
      type: InvoiceLineItem.Type;
    }
  `,
  resolvers: {
    InvoiceLineItem: {
      id_ext: (source) => source.id,
      created: (source) => new Date(source.created * 1000),
      subscription_proration_date: (source) => source.subscription_proration_date && new Date(source.subscription_proration_date * 1000),
      webhooks_delivered_at: (source) => source.webhooks_delivered_at && new Date(source.webhooks_delivered_at * 1000),
      async customer(source, args, context, info) {
        if (source.customer == null) return null;
        if (typeof source.customer === 'object') return source.customer;

        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const fields = Object.keys(Object.values(resolveTree.fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.customer };

        const customer = await stripe
          .get(source.stripe_account)
          .customers.retrieve(source.customer);
        return withStripeAccountProperty(customer, source.stripe_account);
      },
      async payment_intent(source, args, context, info) {
        if (source.payment_intent == null) return null;
        if (typeof source.payment_intent === 'object') return source.payment_intent;

        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const fields = Object.keys(Object.values(resolveTree.fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.payment_intent };

        const payment_intent = await stripe
          .get(source.stripe_account)
          .paymentIntents.retrieve(source.payment_intent);
        return withStripeAccountProperty(payment_intent, source.stripe_account);
      }
    }
  }
};
