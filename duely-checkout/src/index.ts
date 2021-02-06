import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import validator from 'validator';
import { GraphQLClient, gql } from 'graphql-request';
import { serviceAccountContextPromise } from '@duely/db';

const gql_subdomain = gql`
  query($subdomain_name: String!, $livemode: Boolean) {
    subdomains(filter: { name: $subdomain_name }) {
      id
      agency {
        id
        stripe_account(livemode: $livemode) {
          id
          id_ext
          livemode
        }
      }
    }
  }
`;

const gql_product = gql`
  query($agency_id: ID!, $product_url_name: String!) {
    products(filter: { url_name: $product_url_name, agency_id: $agency_id }) {
      id
      default_price {
        id
      }
    }
  }
`;

const gql_create_stripe_checkout_session = gql`
  mutation($price_id: ID!, $livemode: Boolean!) {
    create_stripe_checkout_session(livemode: $livemode, price_id: $price_id) {
      success
      message
      checkout_session_id
    }
  }
`;

setupEnvironment();
main();

let client: GraphQLClient;
let context: {
    jwt: string;
  };

async function main() {
  context = await serviceAccountContextPromise;
  client = await createGraphQLClient();
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.get('/checkout/:subdomain_name/products/:product_url_name', get_checkout);
  app.get('/checkout/:product_url_name', get_checkout);
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

function setupEnvironment() {
  if (!process.env.STRIPE_PK_TEST || !process.env.STRIPE_PK_LIVE) {
    if (!process.env.STRIPECONFIGFILE) throw new Error('Invalid configuration.');

    const config = JSON.parse(fs.readFileSync(process.env.STRIPECONFIGFILE, 'utf8'));
    process.env = {
      ...config.env,
      ...process.env
    };

    if (!process.env.STRIPE_PK_TEST || !process.env.STRIPE_PK_LIVE) {
      throw new Error('Invalid configuration.');
    }
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

  let agency_id: string;
  let stripe_id_ext: string;
  let livemode: boolean;
  const preview = req.query?.preview;

  try {
    const { subdomains } = await client.request(gql_subdomain, {
      subdomain_name,
      livemode: preview ? true : null
    });

    if (subdomains.length != 1) {
      res.sendStatus(404);
      return;
    }

    const { agency } = subdomains[0];
    agency_id = agency.id;
    stripe_id_ext = agency.stripe_account.id_ext;
    livemode = agency.stripe_account.livemode;
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
    return;
  }

  const stripe_pk = process.env[livemode ? 'STRIPE_PK_LIVE' : 'STRIPE_PK_TEST'];
  let price_id;
  const product_url_name = req.params.product_url_name;

  try {
    const { products } = await client.request(gql_product, { agency_id, product_url_name });
    if (products.length != 1) {
      res.sendStatus(404);
      return;
    }

    price_id = products[0].default_price?.id;
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
    return;
  }

  const requestArgs: [
    string,
    { price_id: string; livemode: boolean },
    { authorization: string }?
  ] = [gql_create_stripe_checkout_session, { price_id, livemode }];

  const { access_token } = req.query ?? {};

  if (access_token) {
    requestArgs.push({
      authorization: `Bearer ${access_token}`
    });
  }

  let checkout_session_id;

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
          var stripe = Stripe('${stripe_pk}', { stripeAccount: '${stripe_id_ext}' });
          var redirect = stripe.redirectToCheckout({ sessionId: '${checkout_session_id}' });
        </script>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
      </body>
    </html>
  `);
}
