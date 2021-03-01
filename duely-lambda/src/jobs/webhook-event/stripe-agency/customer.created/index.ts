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

async function main() {
  const webhook_event = await queryResource(context, webhook_event_id);
  const event = webhook_event.data as Stripe.Event;
  const stripe_customer = event.data.object as Stripe.Customer;
  // check if customer creation is already processed
  if (stripe_customer.metadata.creation_mode === 'api') {
    await updateWebhookEventState(context, webhook_event_id, 'processed');
    return;
  }

  const email_address = stripe_customer.email;

  if (!email_address) {
    await updateWebhookEventState(context, webhook_event_id, 'processed');
    return;
  }

  try {
    await updateWebhookEventState(context, webhook_event_id, 'processing');
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
    await updateWebhookEventState(context, webhook_event_id, 'processed');
  } catch (err) {
    console.error(`Webhook event processing failed:\n${err}`);
    await updateWebhookEventState(context, webhook_event_id, err);
  }
}
