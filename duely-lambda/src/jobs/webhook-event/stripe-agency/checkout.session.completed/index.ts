import stripe from '../../../../stripe';
import Stripe from 'stripe';
import {
  serviceAccountContextPromise,
  queryResource,
  updateResource,
  withSession
} from '@duely/db';
import { Awaited } from '@duely/core';

type ProcessingState = 'pending' | 'processing' | 'processed' | 'failed';

async function updateWebhookEventState(
  context: Awaited<typeof serviceAccountContextPromise>,
  webhook_event_id: string,
  state: ProcessingState
): Promise<void>;
async function updateWebhookEventState(
  context: Awaited<typeof serviceAccountContextPromise>,
  webhook_event_id: string,
  err: Error
): Promise<void>;
async function updateWebhookEventState(
  context: Awaited<typeof serviceAccountContextPromise>,
  webhook_event_id: string,
  arg: ProcessingState | Error
): Promise<void> {
  if (typeof arg === 'string') {
    const state = arg;
    await updateResource(context, webhook_event_id, { state });
  } else {
    const err = arg;
    await updateResource(context, webhook_event_id, {
      state: 'failed',
      error: err.toString()
    });
  }
}

const context = { jwt: process.argv[2] };
const webhook_event_id = process.argv[3];

main();

// https://stripe.com/docs/payments/checkout/fulfill-orders
// TODO:
// 1. get customer and purchased products
// 2. create order
// 3. wait that payment has succeeded
// 4. start whatever happens then
async function main() {
  const webhook_event = await queryResource(context, webhook_event_id);
  const event = webhook_event.data as Stripe.Event;
  const session = event.data.object as Stripe.Checkout.Session;
  const stripe_env = event.livemode ? 'live' : 'test';

  try {
    await updateWebhookEventState(context, webhook_event_id, 'processing');
    await withSession(context, async ({ queryResource, createResource }) => {
      const lineItems = await stripe[stripe_env].checkout.sessions.listLineItems(
        session.id,
        { limit: 100 },
        { stripeAccount: event.account }
      );

      if (lineItems.data.length !== 1 || !lineItems.data[0].price) {
        throw new Error('Processing orders with multiple line items is not implemented.');
      }

      const { id: stripe_account_id, agency_id } = await queryResource('stripe account', {
        stripe_id_ext: event.account,
        livemode: event.livemode
      });

      const price = await queryResource('price', {
        [`stripe_price_id_ext_${stripe_env}`]: lineItems.data[0].price.id
      });

      const product = await queryResource(price.product_id);

      if (!session.customer_details?.email) {
        throw new Error('Processing orders without customer email address is not implemented');
      }

      const customer = await queryResource('customer', {
        stripe_account_id,
        email_address: session.customer_details?.email
      });

      const order = await createResource('order', {
        customer_id: customer.id,
        stripe_account_id: stripe_account_id,
        stripe_checkout_session_id_ext: session.id,
        state: 'pending'
      });

      console.log(`Info: Order created:\n${JSON.stringify(order)}`);
    });
    await updateWebhookEventState(context, webhook_event_id, 'processed');
  } catch (err) {
    console.error(`Webhook event processing failed:\n${err}`);
    await updateWebhookEventState(context, webhook_event_id, err);
  }
}
