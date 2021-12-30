// see: https://stripe.com/docs/api/invoices/line_item

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources } from '@duely/db';
import { createStripeRetrieveResolverForReferencedResource } from '../../util';

export const InvoiceLineItem: GqlTypeDefinition<
  Stripe.InvoiceLineItem & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type InvoiceLineItem {
      id: ID!
      amount: Int!
      currency: String!
      description: String
      discount_amounts: [InvoiceLineItemDiscountAmount!]
      discountable: Boolean!
      # discounts: Array<string | Stripe.Discount> | null;
      invoice_item: String
      livemode: Boolean!
      # metadata: Stripe.Metadata;
      # period: InvoiceLineItem.Period;
      # plan: Stripe.Plan | null;
      price: StripePrice
      proration: Boolean!
      quantity: Int
      subscription: String
      subscription_item: String
      # tax_amounts?: Array<InvoiceLineItem.TaxAmount>;
      # tax_rates?: Array<Stripe.TaxRate>;
      type: String!
    }
  `,
  resolvers: {
    InvoiceLineItem: {
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'price',
        object: 'price',
        expand: ['product'],
        role: 'owner'
      })
    }
  }
};

export const InvoiceLineItemDiscountAmount: GqlTypeDefinition<
  Stripe.InvoiceLineItem.DiscountAmount & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type InvoiceLineItemDiscountAmount {
      amount: Int
      discount: Discount
    }
  `,
  resolvers: {
    InvoiceLineItemDiscountAmount: {}
  }
};
