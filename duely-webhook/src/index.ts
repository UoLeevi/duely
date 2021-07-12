import express, { Request, Response } from 'express';
import cors from 'cors';
import stripe from './stripe';
import Stripe from 'stripe';
import {
  createResource,
  getServiceAccountContext,
  queryResource,
  getDbErrorCode,
  updateProcessingState,
  WebhookEventResource
} from '@duely/db';
import { runLambda } from '@duely/lambda';

let context: {
  jwt: string | null;
};

main();

async function main() {
  context = await getServiceAccountContext();
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

// see: https://stripe.com/docs/webhooks
// see: https://stripe.com/docs/api/events/types
async function handle_webhook(req: Request, res: Response) {
  const { source } = req.params;
  const { livemode }: { livemode: boolean } = JSON.parse(req.body);
  let event: Stripe.Event;
  let agency_id = undefined;

  try {
    switch (source) {
      case 'stripe-agency': {
        const secret =
          process.env[livemode ? 'STRIPE_WHSEC_AGENCY_LIVE' : 'STRIPE_WHSEC_AGENCY_TEST']!;
        const stripe_env = livemode ? 'live' : 'test';
        const sig = req.headers['stripe-signature']!;
        event = stripe[stripe_env].webhooks.constructEvent(req.body, sig, secret);
        break;
      }

      case 'stripe-platform': {
        const secret =
          process.env[livemode ? 'STRIPE_WHSEC_PLATFORM_LIVE' : 'STRIPE_WHSEC_PLATFORM_TEST']!;
        const stripe_env = livemode ? 'live' : 'test';
        const sig = req.headers['stripe-signature']!;
        event = stripe[stripe_env].webhooks.constructEvent(req.body, sig, secret);
        break;
      }

      default: {
        throw new Error(`Event source '${source}' is unknown.`);
      }
    }
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (source === 'stripe-agency') {
    try {
      const stripe_account = await queryResource(context, 'stripe account', {
        stripe_id_ext: event.account
      });
      agency_id = stripe_account.agency_id;
    } catch (err: any) {
      res.status(400).send(`Error while querying agency: ${err.message}`);
    }
  }

  let webhook_event: WebhookEventResource;

  try {
    webhook_event = await createResource(context, 'webhook event', {
      id_ext: event.id,
      source,
      livemode,
      data: event,
      state: 'pending',
      agency_id
    });
  } catch (err: any) {
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
          await runLambda('webhook-event/stripe-agency/customer.created', webhook_event.id);
          break;
        }

        case 'checkout.session.completed': {
          await runLambda(
            'webhook-event/stripe-agency/checkout.session.completed',
            webhook_event.id
          );
          break;
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
          await updateProcessingState(context, 'webhook event', webhook_event.id, 'processed');
      }
      break;
    }

    case 'stripe-platform': {
      switch (event.type) {
        default:
          console.log(`Unhandled event type ${event.type}`);
          await updateProcessingState(context, 'webhook event', webhook_event.id, 'processed');
      }
      break;
    }
  }
}
