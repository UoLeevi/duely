import Stripe from 'stripe';
import fs from 'fs';

if (!process.env.STRIPE_SK_TEST || !process.env.STRIPE_SK_LIVE) {
  if (!process.env.STRIPECONFIGFILE) {
    throw new Error('Invalid configuration.');
  }

  const config = JSON.parse(fs.readFileSync(process.env.STRIPECONFIGFILE, 'utf8'));
  process.env = {
    ...config.env,
    ...process.env
  };

  if (!process.env.STRIPE_SK_TEST || !process.env.STRIPE_SK_LIVE) {
    throw new Error('Invalid configuration.');
  }
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
