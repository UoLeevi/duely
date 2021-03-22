import Stripe from 'stripe';
import { queryResource, withSession, updateProcessingState } from '@duely/db';

const context = { jwt: process.argv[2] };
const webhook_event_id = process.argv[3];

main();

async function main() {
  const webhook_event = await queryResource(context, 'webhook event', webhook_event_id);
  const event = webhook_event.data as Stripe.Event;
  const stripe_customer = event.data.object as Stripe.Customer;
  // check if customer creation is already processed
  if (stripe_customer.metadata.creation_mode === 'api') {
    await updateProcessingState(context, 'webhook event', webhook_event_id, 'processed');
    return;
  }

  const email_address = stripe_customer.email;

  if (!email_address) {
    await updateProcessingState(context, 'webhook event', webhook_event_id, 'processed');
    return;
  }

  try {
    await updateProcessingState(context, 'webhook event', webhook_event_id, 'processing');
    await withSession(context, async ({ queryResource, createResource }) => {
      const { id: stripe_account_id } = await queryResource('stripe account', {
        stripe_id_ext: event.account,
        livemode: event.livemode
      });

      const customer = await queryResource('customer', {
        stripe_account_id,
        email_address
      });

      if (customer) return;

      await createResource('customer', {
        stripe_account_id,
        email_address,
        name: stripe_customer.name,
        default_stripe_id_ext: stripe_customer.id
      });
    });
    await updateProcessingState(context, 'webhook event', webhook_event_id, 'processed');
  } catch (err) {
    console.error(`Webhook event processing failed:\n${err}`);
    await updateProcessingState(context, 'webhook event', webhook_event_id, err);
  }
}
