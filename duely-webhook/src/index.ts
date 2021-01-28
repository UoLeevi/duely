import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import stripe from './stripe';
import { GraphQLClient, gql } from 'graphql-request';
import Stripe from 'stripe';

const gql_begin_visit = gql`
  mutation {
    begin_visit {
      success
      jwt
      message
    }
  }
`;

const gql_log_in_serviceaccount = gql`
  mutation($password: String!) {
    log_in(email_address: "serviceaccount@duely.app", password: $password) {
      success
      jwt
      message
    }
  }
`;

const gql_subdomain = gql`
  query($subdomain_name: String!) {
    subdomains(filter: { name: $subdomain_name }) {
      id
      agency {
        id
        stripe_account {
          id
          id_ext
        }
      }
    }
  }
`;

const gql_service = gql`
  query($agency_id: ID!, $service_url_name: String!) {
    services(filter: { url_name: $service_url_name, agency_id: $agency_id }) {
      id
      default_variant {
        id
        default_price {
          id
        }
      }
    }
  }
`;

const gql_create_stripe_checkout_session = gql`
  mutation($price_id: ID!) {
    create_stripe_checkout_session(price_id: $price_id) {
      success
      message
      checkout_session_id
    }
  }
`;

main();

let client;

async function main() {
  client = await createGraphQLClient();
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.post('/webhook/platform', bodyParser.raw({ type: 'application/json' }), handle_webhook_platform);
  app.post('/webhook/agency', bodyParser.raw({ type: 'application/json' }), handle_webhook_agency);

  app.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
}

async function createGraphQLClient() {
  const endpoint = 'https://api.duely.app/graphql';
  const client = new GraphQLClient(endpoint);

  const { begin_visit } = await client.request(gql_begin_visit);

  if (!begin_visit.success) {
    throw new Error("Unable to get access token.");
  }

  client.setHeader('authorization', `Bearer ${begin_visit.jwt}`);

  const { log_in } = await client.request(gql_log_in_serviceaccount, { password: process.env.DUELY_SERVICE_ACCOUNT_PASSWORD });

  if (!log_in.success) {
    throw new Error("Unable to get access token.");
  }

  client.setHeader('authorization', `Bearer ${log_in.jwt}`);

  return client;
}

// see: https://stripe.com/docs/webhooks
async function handle_webhook_platform(req: Request, res: Response) {
  const { livemode }: { livemode: boolean } = JSON.parse(req.body);
  const stripe_env = livemode ? 'live' : 'test';
  const secret = process.env[livemode ? 'STRIPE_WHSEC_PLATFORM_LIVE' : 'STRIPE_WHSEC_PLATFORM_TEST']!;
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripe[stripe_env].webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

async function handle_webhook_agency(req: Request, res: Response) {
  const { livemode }: { livemode: boolean } = JSON.parse(req.body);
  const stripe_env = livemode ? 'live' : 'test';
  const secret = process.env[livemode ? 'STRIPE_WHSEC_AGENCY_LIVE' : 'STRIPE_WHSEC_AGENCY_TEST']!;
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripe[stripe_env].webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
