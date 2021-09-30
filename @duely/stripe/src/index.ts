import Stripe from 'stripe';
import fs from 'fs';
import { ResourceId, Resources } from '@duely/db';
import { SplitString, Awaited, FilterKeys, PathValue } from '@duely/util';

const STRIPE_API_VERSION = '2020-08-27';

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

const connectedAccounts = {
  test: new Map<ResourceId<'stripe account'>, Stripe>(),
  live: new Map<ResourceId<'stripe account'>, Stripe>()
};

const stripe = {
  test: new Stripe(process.env.STRIPE_SK_TEST, {
    apiVersion: STRIPE_API_VERSION
  }),
  live: new Stripe(process.env.STRIPE_SK_LIVE, {
    apiVersion: STRIPE_API_VERSION
  }),
  get(stripe_account: Resources['stripe account'], livemode?: boolean): Stripe {
    livemode = livemode ?? stripe_account.livemode;
    const stripe_env = livemode ? 'live' : 'test';
    let stripe = connectedAccounts[stripe_env].get(stripe_account.id);

    if (!stripe) {
      const apiKey = livemode ? process.env.STRIPE_SK_LIVE! : process.env.STRIPE_SK_TEST!;
      stripe = new Stripe(apiKey, {
        apiVersion: STRIPE_API_VERSION,
        stripeAccount: stripe_account.stripe_id_ext
      });

      connectedAccounts[stripe_env].set(stripe_account.id, stripe);
    }

    return stripe;
  }
};

type StripeResourceEndpointPathL1 = FilterKeys<Stripe, Record<'retrieve', (...args: any) => any>>;
type StripeResourceEndpointPathL2 = FilterKeys<
  Stripe,
  Record<string, Record<'retrieve', (...args: any) => any>>
> extends infer K
  ? K extends string & keyof Stripe
    ? FilterKeys<Stripe[K], Record<'retrieve', (...args: any) => any>> extends infer E
      ? E extends string
        ? `${K}.${E}`
        : never
      : never
    : never
  : never;

type StripeResourceEndpointPath = StripeResourceEndpointPathL1 | StripeResourceEndpointPathL2;

export type StripeResourceEndpoint = {
  [Path in StripeResourceEndpointPath]: PathValue<Stripe, SplitString<Path, '.'>>;
};

type ExtractObjectFromStripeResponse<T extends Stripe.Response<unknown>> =
  T extends Stripe.Response<infer O> ? O : never;

export type StripeResourceEndpointResponseObject = {
  [Path in keyof StripeResourceEndpoint]: ExtractObjectFromStripeResponse<
    Awaited<ReturnType<StripeResourceEndpoint[Path]['retrieve']>>
  >;
};

export type StripeDeletableResourceEndpoint = {
  [Path in FilterKeys<
    StripeResourceEndpoint,
    Record<'del', (...args: any) => any>
  >]: StripeResourceEndpoint[Path];
};

export type StripeDeletableObjectType =
  StripeResourceEndpointResponseObject[keyof StripeDeletableResourceEndpoint]['object'];

export default stripe;
