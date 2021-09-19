import axios from 'axios';
import { getServiceAccountContext, withSession, ResourceId } from '@duely/db';
import { Currency } from '@duely/util';
import stripe from '@duely/stripe';
import Stripe from 'stripe';

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

  const data = await withSession(context, async ({ queryResource }) => {
    const order = await queryResource('order', order_id);
    const stripe_account = await queryResource('stripe account', order.stripe_account_id);
    const checkout_session = await stripe
      .get(stripe_account)
      .checkout.sessions.retrieve(order.stripe_checkout_session_id_ext, {
        expand: ['payment_intent', 'line_items']
      });

    const payment_intent = checkout_session.payment_intent as Stripe.PaymentIntent;
    const charge = payment_intent.charges.data[0];
    const receipt_url = charge.receipt_url;

    const line_items = checkout_session.line_items!.data;
    const agency = await queryResource('agency', stripe_account.agency_id);
    const subdomain = await queryResource('subdomain', agency.subdomain_id);
    const customer = await queryResource('customer', order.customer_id);

    const account = await stripe.get(stripe_account).accounts.retrieve();

    return {
      account_email: account.email!,
      agency_name: agency.name,
      subdomain_name: subdomain.name,
      customer_name: customer.name,
      receipt_url,
      product_name:
        line_items[0].description +
        (line_items.length === 1
          ? ''
          : ` and ${line_items.length - 1} other product${line_items.length === 2 ? '' : 's'}`),
      price: formatCurrency(
        checkout_session.amount_total ?? 0,
        checkout_session.currency as Currency
      )
    };
  });

  await sendEmail({
    template: 'default',
    from: 'Duely <support@duely.app>',
    to: data.account_email,
    subject: `${data.customer_name} just purchased ${data.product_name} for ${data.price}`,
    context: {
      header: `${data.customer_name} just purchased ${data.product_name} for ${data.price}`,
      paragraphs: [
        `Congratulations! ${data.agency_name} just made a sale of product ${data.product_name} for ${data.price}. You can view the full details of this order right from your dashboard. You can also [view the receipt in your browser](${data.receipt_url}).`,
        `[View dashboard](https://${data.subdomain_name}.duely.app/dashboard/orders){.button}`,
        `Have questions? You can find us at <https://support.duely.app/>.`
      ],
      footer: 'Duely'
    }
  });
}
