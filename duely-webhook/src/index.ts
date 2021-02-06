import express, { Request, Response } from 'express';
import cors from 'cors';
import stripe from './stripe';
import { GraphQLClient } from 'graphql-request';
import Stripe from 'stripe';
import { createResource, serviceAccountContextPromise, queryResource } from '@duely/db';

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

async function handle_webhook(req: Request, res: Response) {
  const { source } = req.params;
  const { livemode }: { livemode: boolean } = JSON.parse(req.body);
  let event: Stripe.Event;
  let agency_id = null;

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
        id_ext: event.account
      });
      agency_id = stripe_account.agency_id;
    } catch (err) {
      res.status(400).send(`Error while querying agency: ${err.message}`);
    }
  }

  try {
    await createResource(context, 'webhook event', {
      id_ext: event.id,
      source,
      livemode,
      data: event,
      state: 'pending',
      agency_id
    });
  } catch (err) {
    res.status(400).send(`Error while storing the event: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
