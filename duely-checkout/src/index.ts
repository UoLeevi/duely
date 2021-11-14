import express, { Request, Response } from 'express';
import cors from 'cors';
import { GraphQLClient, gql } from 'graphql-request';
import { getServiceAccountContext, withSession } from '@duely/db';
import stripe from '@duely/stripe';

const gql_create_stripe_checkout_session = gql`
  mutation (
    $price_id: ID!
    $livemode: Boolean!
    $coupon_id: ID
    $promotion_code_id: ID
    $allow_promotion_codes: Boolean
  ) {
    create_stripe_checkout_session(
      livemode: $livemode
      price_id: $price_id
      coupon_id: $coupon_id
      promotion_code_id: $promotion_code_id
      allow_promotion_codes: $allow_promotion_codes
    ) {
      success
      message
      checkout_session_id
      checkout_session_url
    }
  }
`;

main();

let client: GraphQLClient;
let context: {
  jwt: string | null;
};

async function main() {
  context = await getServiceAccountContext();
  client = await createGraphQLClient();
  const app = express();
  app.set('port', process.env.PORT ?? 3000);
  app.set('trust proxy', true);
  app.use(cors());
  app.get('/checkout/:subdomain_name/products/:product_url_name', get_checkout);
  app.get('/checkout/:product_url_name', get_checkout);
  app.get('/.well-known/server-health', (req, res) => res.send('ok'));

  app.listen({ port: app.get('port') }, () => {
    console.log(`🚀 Server ready at http://localhost:${app.get('port')}`);
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

async function get_checkout(req: Request, res: Response) {
  let subdomain_name = req.params.subdomain_name;

  if (subdomain_name == null) {
    const domain = req.hostname;

    if (!domain.endsWith('.duely.app')) {
      throw new Error('Invalid reverse proxy configuration.');
    }

    subdomain_name = req.hostname.split('.duely.app')[0];
  }

  // TODO: implement checkout preview somehow
  const preview = req.query?.preview || req.query.preview === '' ? true : false;

  try {
    return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
      const subdomain = await queryResource('subdomain', { name: subdomain_name });

      if (!subdomain) {
        res.sendStatus(404);
        return;
      }

      const agency = await queryResource('agency', { subdomain_id: subdomain.id });

      if (!agency) {
        res.sendStatus(404);
        return;
      }

      const stripe_account = await queryResource('stripe account', {
        agency_id: agency.id,
        livemode: agency.livemode
      });

      if (!stripe_account) {
        res.sendStatus(404);
        return;
      }

      const product = await queryResource('product', {
        url_name: req.params.product_url_name,
        status: 'live'
      });

      if (!product || !product.default_price_id) {
        res.sendStatus(404);
        return;
      }

      const price = await queryResource('price', product.default_price_id);

      if (!price) {
        res.sendStatus(404);
        return;
      }

      const allow_promotion_codes = req.query?.promo || req.query.promo === '' ? true : false;
      let promotion_code_id: string | undefined =
        typeof req.query.promotion_code_id === 'string' ? req.query.promotion_code_id : undefined;
      const coupon_id: string | undefined =
        typeof req.query.coupon_id === 'string' ? req.query.coupon_id : undefined;

      if (!promotion_code_id && typeof req.query.code === 'string') {
        const promotionCodes = await stripe
          .get(stripe_account)
          .promotionCodes.list({ code: req.query.code, active: true });

        if (promotionCodes.data.length > 0) {
          promotion_code_id = promotionCodes.data[0].id;
        }
      }

      const requestArgs: [
        string,
        {
          price_id: string;
          livemode: boolean;
          allow_promotion_codes: boolean;
          coupon_id: string | undefined;
          promotion_code_id: string | undefined;
        },
        { authorization: string }?
      ] = [
        gql_create_stripe_checkout_session,
        {
          price_id: price.id,
          livemode: agency.livemode,
          allow_promotion_codes,
          coupon_id,
          promotion_code_id
        }
      ];

      const access_token: string | undefined =
        typeof req.query.access_token === 'string' ? req.query.access_token : undefined;

      if (access_token) {
        requestArgs.push({
          authorization: `Bearer ${access_token}`
        });
      }

      const { create_stripe_checkout_session: result } = await client.request(...requestArgs);

      if (!result.success || !result.checkout_session_url) {
        console.error(result.message);
        res.sendStatus(404);
        return;
      }

      res.redirect(303, result.checkout_session_url);
    });
  } catch (error: any) {
    console.error(error);
    res.sendStatus(500);
    return;
  }
}
