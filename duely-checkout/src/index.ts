import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import validator from 'validator';
import { GraphQLClient, gql } from 'graphql-request';

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

setupEnvironment();
main();

let client: GraphQLClient;

async function main() {
  client = await createGraphQLClient();
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.get('/checkout/:subdomain_name/services/:service_url_name', get_checkout);
  app.get('/checkout/:service_url_name', get_checkout);
  app.get('/.well-known/server-health', (req, res) => res.send('ok'));

  app.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
}

async function createGraphQLClient() {
  const endpoint = 'https://api.duely.app/graphql';
  const client = new GraphQLClient(endpoint);

  const { begin_visit } = await client.request(gql_begin_visit);

  if (!begin_visit.success) {
    throw new Error('Unable to get access token.');
  }

  client.setHeader('authorization', `Bearer ${begin_visit.jwt}`);

  const { log_in } = await client.request(gql_log_in_serviceaccount, {
    password: process.env.DUELY_SERVICE_ACCOUNT_PASSWORD
  });

  if (!log_in.success) {
    throw new Error('Unable to get access token.');
  }

  client.setHeader('authorization', `Bearer ${log_in.jwt}`);

  return client;
}

function setupEnvironment() {
  if (!process.env.STRIPE_PK_TEST) {
    if (!process.env.STRIPECONFIGFILE) throw new Error('Invalid configuration.');

    const config = JSON.parse(fs.readFileSync(process.env.STRIPECONFIGFILE, 'utf8'));
    process.env = {
      ...config.env,
      ...process.env
    };
  }
}

async function get_checkout(req: Request, res: Response) {
  let subdomain_name = req.params.subdomain_name;

  if (subdomain_name == null) {
    const domain = req.hostname;

    if (!domain.endsWith('.duely.app')) {
      throw new Error('Invalid reverse proxy configuration.');
    }

    subdomain_name = req.hostname.split('.duely.app')[0];
  }

  let agency_id;
  let stripe_id_ext;

  try {
    const { subdomains } = await client.request(gql_subdomain, { subdomain_name });

    if (subdomains.length != 1) {
      res.sendStatus(404);
      return;
    }

    const { agency } = subdomains[0];

    agency_id = agency.id;
    stripe_id_ext = agency.stripe_account.id_ext;
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
    return;
  }

  let price_id;
  const service_url_name = req.params.service_url_name;

  try {
    const { services } = await client.request(gql_service, { agency_id, service_url_name });

    if (services.length != 1) {
      res.sendStatus(404);
      return;
    }

    price_id = services[0].default_variant.default_price?.id;
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
    return;
  }

  let checkout_session_id;
  const requestArgs: [string, { price_id: string }, { authorization: string }?] = [
    gql_create_stripe_checkout_session,
    { price_id }
  ];
  const { access_token } = req.query ?? {};

  if (access_token) {
    requestArgs.push({
      authorization: `Bearer ${access_token}`
    });
  }

  try {
    const { create_stripe_checkout_session: result } = await client.request(...requestArgs);

    if (!result.success) {
      console.error(result.message);
      res.sendStatus(404);
      return;
    }

    checkout_session_id = validator.escape(result.checkout_session_id);
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
    return;
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Duely</title>
        <script src="https://js.stripe.com/v3/"></script>
        <script>
          var stripe = Stripe('${process.env.STRIPE_PK_TEST}', { stripeAccount: '${stripe_id_ext}' });
          var redirect = stripe.redirectToCheckout({ sessionId: '${checkout_session_id}' });
        </script>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
      </body>
    </html>
  `);
}
