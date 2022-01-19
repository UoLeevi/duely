import stripe from '@duely/stripe';
import Stripe from 'stripe';
import {
  queryResource,
  withSession,
  updateProcessingState,
  getServiceAccountContext
} from '@duely/db';
import { runLambda } from '@duely/lambda';

const webhook_event_id = process.argv[2];

main();

// https://stripe.com/docs/payments/checkout/fulfill-orders
// TODO:
// 1. get customer and purchased products
// 2. create order
// 3. wait that payment has succeeded
// 4. start whatever happens then
async function main() {
  const context = await getServiceAccountContext();
  const webhook_event = await queryResource(context, 'webhook event', webhook_event_id);
  const event = webhook_event.data as Stripe.Event;
  const session = event.data.object as Stripe.Checkout.Session;
  const stripe_env = event.livemode ? 'live' : 'test';
  let order_id: string;

  try {
    await updateProcessingState(context, 'webhook event', webhook_event_id, 'processing');

    if (!session.customer_details?.email) {
      throw new Error('Processing orders without customer email address is not implemented');
    }

    const stripe_account = await queryResource(context, 'stripe account', {
      stripe_id_ext: event.account,
      livemode: event.livemode
    });

    let customer = await queryResource(context, 'customer', {
      stripe_account_id: stripe_account.id,
      email_address: session.customer_details?.email
    });

    // Stripe does not necessary deliver webhooks in order.
    // See: https://stripe.com/docs/webhooks/best-practices#event-ordering
    // If customer does not yet exist let's wait a bit and try again couple times.

    const maxRetries = 5;
    for (let retries = 1; !customer && retries <= maxRetries; ++retries) {
      await new Promise((r) => setTimeout(r, 1000 * retries));
      customer = await queryResource(context, 'customer', {
        stripe_account_id: stripe_account.id,
        email_address: session.customer_details?.email
      });
    }

    if (!customer) {
      throw new Error(
        'Customer matching the email address was not found for this checkout session'
      );
    }

    await withSession(context, async ({ queryResource, createResource }) => {
      // Create order
      const order = await createResource('order', {
        customer_id: customer.id,
        stripe_account_id: stripe_account.id,
        stripe_checkout_session_id_ext: session.id,
        state: 'pending'
      });

      // Create order items

      const lineItemsList = await stripe
        .get(stripe_account)
        .checkout.sessions.listLineItems(session.id, { limit: 100 });

      for (const lineItem of lineItemsList.data) {
        if (!lineItem.price) {
          throw new Error('Line item did not have price associated with it.');
        }

        const price = await queryResource('price', lineItem.price.id);

        await createResource('order item', {
          order_id: order.id,
          price_id: price.id,
          stripe_line_item_id_ext: lineItem.id,
          state: 'pending'
        });
      }

      console.log(`Info: Order created:\n${JSON.stringify(order)}`);
      order_id = order.id;
    });

    await runLambda('process-order', order_id!);
    await updateProcessingState(context, 'webhook event', webhook_event_id, 'processed');
  } catch (err: any) {
    console.error(`Webhook event processing failed:\n${err}`);
    await updateProcessingState(context, 'webhook event', webhook_event_id, err);
    throw err;
  }
}
