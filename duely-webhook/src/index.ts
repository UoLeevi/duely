import express, { Request, Response } from 'express';
import cors from 'cors';
import stripe from './stripe';
import { GraphQLClient } from 'graphql-request';
import Stripe from 'stripe';
import {
  createResource,
  serviceAccountContextPromise,
  queryResource,
  getDbErrorCode,
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

let client: GraphQLClient;
let context: {
  jwt: string;
};

main();

async function main() {
  context = await serviceAccountContextPromise;
  client = await createGraphQLClient();
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.use('/webhook/', express.raw({ type: 'application/json' }));
  app.post('/webhook/:source', handle_webhook);
  app.get('/.well-known/server-health', (req, res) => res.send('ok'));

  app.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
}

async function createGraphQLClient() {
  const endpoint = 'https://api.duely.app/graphql';
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${context.jwt}`
    }
  });
}

// see: https://stripe.com/docs/webhooks
// see: https://stripe.com/docs/api/events/types
async function handle_webhook(req: Request, res: Response) {
  const { source } = req.params;
  const { livemode }: { livemode: boolean } = JSON.parse(req.body);
  let event: Stripe.Event;
  let agency_id: string | null = null;

  try {
    switch (source) {
      case 'stripe-agency': {
        const secret = process.env[
          livemode ? 'STRIPE_WHSEC_AGENCY_LIVE' : 'STRIPE_WHSEC_AGENCY_TEST'
        ]!;
        const stripe_env = livemode ? 'live' : 'test';
        const sig = req.headers['stripe-signature']!;
        event = stripe[stripe_env].webhooks.constructEvent(req.body, sig, secret);
        break;
      }

      case 'stripe-platform': {
        const secret = process.env[
          livemode ? 'STRIPE_WHSEC_PLATFORM_LIVE' : 'STRIPE_WHSEC_PLATFORM_TEST'
        ]!;
        const stripe_env = livemode ? 'live' : 'test';
        const sig = req.headers['stripe-signature']!;
        event = stripe[stripe_env].webhooks.constructEvent(req.body, sig, secret);
        break;
      }

      default: {
        throw new Error(`Event source '${source}' is unknown.`);
      }
    }
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (source === 'stripe-agency') {
    try {
      const stripe_account: {
        agency_id: string;
      } = await queryResource(context, 'stripe account', {
        stripe_id_ext: event.account
      });
      agency_id = stripe_account.agency_id;
    } catch (err) {
      res.status(400).send(`Error while querying agency: ${err.message}`);
    }
  }

  let webhook_event: {
    id: string;
    id_ext: string;
    source: string;
    livemode: boolean;
    data: object;
    state: string;
    agency_id?: string | null;
  };

  try {
    webhook_event = await createResource(context, 'webhook event', {
      id_ext: event.id,
      source,
      livemode,
      data: event,
      state: 'pending',
      agency_id
    });
  } catch (err) {
    if (getDbErrorCode(err) === 'unique_violation') {
      console.log(`Duplicate webhook event received: source: ${source}, id_ext: ${event.id}`);
      res.json({ received: true, message: 'already processed' });
    } else {
      res.status(400).send(`Error while storing the event: ${err.message}`);
    }
    return;
  }

  // Send OK response
  res.json({ received: true });

  // Handle the event
  switch (source) {
    case 'stripe-agency': {
      switch (event.type) {
        case 'customer.created': {
          await handle_event_stripe_agency_customer_created(webhook_event.id, event);
          break;
        }

        case 'checkout.session.completed': {
          await handle_event_stripe_agency_checkout_session_completed(webhook_event.id, event);
          break;
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
          await updateWebhookEventState(context, webhook_event.id, 'processed');
      }
      break;
    }

    case 'stripe-platform': {
      switch (event.type) {
        default:
          console.log(`Unhandled event type ${event.type}`);
          await updateWebhookEventState(context, webhook_event.id, 'processed');
      }
      break;
    }
  }
}

async function handle_event_stripe_agency_customer_created(webhook_event_id: string, event: Stripe.Event) {
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

// https://stripe.com/docs/payments/checkout/fulfill-orders
// TODO:
// 1. get customer and purchased products
// 2. create order
// 3. wait that payment has succeeded
// 4. start whatever happens then
async function handle_event_stripe_agency_checkout_session_completed(webhook_event_id: string, event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  await updateWebhookEventState(context, webhook_event_id, 'processed');
}
