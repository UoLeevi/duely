import Stripe from 'stripe';
import fs from 'fs';

if (!process.env.STRIPE_SK_TEST) {
  const config = JSON.parse(fs.readFileSync(process.env.STRIPECONFIGFILE, 'utf8'));
  process.env = {
    ...config.env,
    ...process.env
  };
}

const stripe = {
  test: new Stripe(process.env.STRIPE_SK_TEST, {
    apiVersion: '2020-08-27',
  }),
  live: new Stripe(process.env.STRIPE_SK_LIVE, {
    apiVersion: '2020-08-27',
  })
};

export default stripe;
