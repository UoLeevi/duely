import axios from 'axios';
import { getServiceAccountContext, withSession, ResourceId } from '@duely/db';
import { Currency } from '@duely/core';

const emailServiceBaseUrl = new URL('http://duely-email-service:8080/');

export type SendEmailOptions = {
  from?: string;
  to: string;
  subject: string;
  template: string;
  context?: Record<string, any>;
};

export async function sendEmail({
  template,
  context,
  ...options
}: SendEmailOptions): Promise<{ success: true; id: string }> {
  template = encodeURIComponent(template);
  const url = new URL(`send/${template}`, emailServiceBaseUrl);
  const res = await axios.post(url.href, { ...context, ...options });
  return res.data;
}

export type PreviewEmailOptions = {
  template: string;
  context?: Record<string, any>;
};

export async function previewEmail({
  template,
  context,
  ...options
}: PreviewEmailOptions): Promise<{ success: true; id: string }> {
  template = encodeURIComponent(template);
  const url = new URL(`preview/${template}`, emailServiceBaseUrl);
  const res = await axios.post(url.href, { ...context, ...options });
  return res.data;
}

export async function sendEmailNotificationAboutNewSales(order_id: ResourceId<'order'>) {
  const context = await getServiceAccountContext();

  const data = await withSession(context, async ({ queryResource, queryResourceAll }) => {
    const order = await queryResource('order', order_id);
    const stripe_account = await queryResource('stripe account', order.stripe_account_id);
    const agency = await queryResource('agency', stripe_account.agency_id);
    const subdomain = await queryResource('subdomain', agency.subdomain_id);
    const customer = await queryResource('customer', order.customer_id);
    const order_items = await queryResourceAll('order item', { order_id });

    const item_summaries = await Promise.all(
      order_items.map(async (order_item) => {
        const price = await queryResource('price', order_item.price_id);
        const product = await queryResource('product', price.product_id);

        return {
          product_name: product.name,
          amount: price.unit_amount,
          currency: price.currency as Currency
        };
      })
    );

    const amount_total = item_summaries.map((s) => s.amount).reduce((a, b) => a + b, 0);

    return {
      agency_name: agency.name,
      subdomain_name: subdomain.name,
      customer_name: customer.name,
      product_name:
        item_summaries[0].product_name +
        (item_summaries.length === 1
          ? ''
          : ` and ${item_summaries.length - 1} other product${
              item_summaries.length === 2 ? '' : 's'
            }`),
      price: Currency.format(amount_total, item_summaries[0].currency as Currency)
    };
  });

  // TODO: send email to actual agency owner

  await sendEmail({
    template: 'sales-notification',
    from: 'Duely <support@duely.app>',
    to: 'Duely <admin@duely.app>',
    subject: `Sold ${data.product_name} for ${data.price}`,
    context: data
  });
}
