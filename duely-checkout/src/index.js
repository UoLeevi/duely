import express from 'express';
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

async function main() {
  const client = await createGraphQLClient();
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.get('/checkout/:subdomain/:service_url_name', async (req, res) => {
    let agency_id;

    try {
      const { subdomains } = await client.request(
        gql_subdomain, { subdomain_name: req.params.subdomain });

      if (subdomains.length != 1) {
        res.sendStatus(404);
        return;
      }

      agency_id = subdomains[0].agency.id;
    } catch (error) {
      console.error(error);
      res.sendStatus(404);
      return;
    }

    let price_id;

    try {
      const { services } = await client.request(
        gql_service, { agency_id, service_url_name: req.params.service_url_name });

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

    try {
      const { create_stripe_checkout_session: result } = await client.request(
        gql_create_stripe_checkout_session, { price_id });

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
            var stripe = Stripe('${process.env.STRIPE_PK_TEST}');
            var redirect = stripe.redirectToCheckout({ sessionId: '${checkout_session_id}' });
          </script>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
        </body>
      </html>
    `);
  });

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

function setupEnvironment() {
  if (!process.env.STRIPE_PK_TEST) {
    const config = JSON.parse(fs.readFileSync(process.env.STRIPECONFIGFILE, 'utf8'));
    process.env = {
      ...config.env,
      ...process.env
    };
  }
}
