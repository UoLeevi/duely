import Stripe from 'stripe';
import fs from 'fs';
import { ResourceId, Resources } from '@duely/db';
import {
  SplitString,
  FilterKeys,
  PathValue,
  getPathValue,
  GenericFunction,
  ParameterOverloads
} from '@duely/util';

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
  },
  retrieve<TStripeObjectType extends keyof StripeObjectTypeResources<'retrieve'>>(
    stripe: Stripe,
    object: TStripeObjectType,
    id: string,
    params: StripeRetrieveParams<StripeObjectTypeResources<'retrieve'>[TStripeObjectType]>
  ): ReturnType<
    PathValue<Stripe, StripeObjectTypeResources<'retrieve'>[TStripeObjectType]>['retrieve']
  > {
    const resource = getStripeResourceForObjectType(stripe, object);
    const retrieve = resource.retrieve.bind(resource) as (
      id: string,
      params: StripeRetrieveParams<StripeObjectTypeResources<'retrieve'>[TStripeObjectType]>
    ) => ReturnType<
      PathValue<Stripe, StripeObjectTypeResources<'retrieve'>[TStripeObjectType]>['retrieve']
    >;
    return retrieve(id, params);
  },
  list<TStripeObjectType extends keyof StripeObjectTypeResources<'list'>>(
    stripe: Stripe,
    object: TStripeObjectType,
    params: StripeListParams<StripeObjectTypeResources<'list'>[TStripeObjectType]>
  ): ReturnType<PathValue<Stripe, StripeObjectTypeResources<'list'>[TStripeObjectType]>['list']> {
    const resource = getStripeResourceForObjectType<TStripeObjectType, 'list'>(stripe, object);
    const list = resource.list.bind(resource) as (
      params: StripeListParams<StripeObjectTypeResources<'list'>[TStripeObjectType]>
    ) => ReturnType<
      PathValue<Stripe, StripeObjectTypeResources<'list'>[TStripeObjectType]>['list']
    >;
    return list(params);
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
  [Path in StripeResourceEndpointPath]: PathValue<Stripe, Path>;
};

type ExtractObjectFromStripeResponse<T extends Stripe.Response<unknown>> =
  T extends Stripe.Response<infer O> ? O : never;

export type StripeResourceEndpointWithOperation<TOperation extends string> = {
  [Path in FilterKeys<
    StripeResourceEndpoint,
    Record<TOperation, (...args: any) => any>
  >]: StripeResourceEndpoint[Path];
};

export type StripeResourceEndpointResponseObject<
  TOperationType extends 'retrieve' | 'list' | 'del' = 'retrieve'
> = {
  [Path in keyof StripeResourceEndpointWithOperation<TOperationType>]: ExtractObjectFromStripeResponse<
    Awaited<ReturnType<StripeResourceEndpointWithOperation<TOperationType>[Path]['retrieve']>>
  >;
};

export type StripeDeletableResourceEndpoint = StripeResourceEndpointWithOperation<'del'>;

export type StripeObjectType =
  StripeResourceEndpointResponseObject[keyof StripeResourceEndpoint]['object'];

export type StripeDeletableObjectType =
  StripeResourceEndpointResponseObject[keyof StripeDeletableResourceEndpoint]['object'];

const stripeResourceEndpointByType: {
  [TStripeObjectType in StripeObjectType]: FilterKeys<
    StripeResourceEndpointResponseObject,
    Record<'object', TStripeObjectType>
  >;
} = {
  product: 'products',
  customer: 'customers',
  price: 'prices',
  order: 'orders',
  balance: 'balance',
  account: 'accounts',
  apple_pay_domain: 'applePayDomains',
  application_fee: 'applicationFees',
  balance_transaction: 'balanceTransactions',
  charge: 'charges',
  country_spec: 'countrySpecs',
  coupon: 'coupons',
  credit_note: 'creditNotes',
  dispute: 'disputes',
  event: 'events',
  exchange_rate: 'exchangeRates',
  file: 'files',
  file_link: 'fileLinks',
  invoice: 'invoices',
  invoiceitem: 'invoiceItems',
  issuer_fraud_record: 'issuerFraudRecords',
  mandate: 'mandates',
  order_return: 'orderReturns',
  payment_intent: 'paymentIntents',
  payment_link: 'paymentLinks',
  payment_method: 'paymentMethods',
  payout: 'payouts',
  plan: 'plans',
  promotion_code: 'promotionCodes',
  quote: 'quotes',
  refund: 'refunds',
  review: 'reviews',
  setup_intent: 'setupIntents',
  shipping_rate: 'shippingRates',
  sku: 'skus',
  source: 'sources',
  subscription: 'subscriptions',
  subscription_item: 'subscriptionItems',
  subscription_schedule: 'subscriptionSchedules',
  tax_code: 'taxCodes',
  tax_rate: 'taxRates',
  token: 'tokens',
  topup: 'topups',
  transfer: 'transfers',
  webhook_endpoint: 'webhookEndpoints',
  'checkout.session': 'checkout.sessions',
  'identity.verification_report': 'identity.verificationReports',
  'identity.verification_session': 'identity.verificationSessions',
  'issuing.authorization': 'issuing.authorizations',
  'issuing.card': 'issuing.cards',
  'issuing.cardholder': 'issuing.cardholders',
  'issuing.dispute': 'issuing.disputes',
  'issuing.transaction': 'issuing.transactions',
  'radar.early_fraud_warning': 'radar.earlyFraudWarnings',
  'radar.value_list': 'radar.valueLists',
  'radar.value_list_item': 'radar.valueListItems',
  'reporting.report_run': 'reporting.reportRuns',
  'reporting.report_type': 'reporting.reportTypes',
  scheduled_query_run: 'sigma.scheduledQueryRuns',
  'test_helpers.test_clock': 'testHelpers.testClocks',
} as const;

export type StripeObjectTypeResources<
  TOperationType extends 'retrieve' | 'list' | 'del' = 'retrieve'
> = {
  [TStripeObjectType in StripeObjectType]: FilterKeys<
    StripeResourceEndpointResponseObject<TOperationType>,
    Record<'object', TStripeObjectType>
  >;
};

export function getStripeResourceForObjectType<
  TStripeObjectType extends StripeObjectType,
  TOperationType extends 'retrieve' | 'list' | 'del' = 'retrieve'
>(
  stripe: Stripe,
  object: TStripeObjectType
): PathValue<
  Stripe,
  SplitString<
    FilterKeys<
      StripeResourceEndpointResponseObject<TOperationType>,
      Record<'object', TStripeObjectType>
    >,
    '.'
  >
> {
  const endpoint = stripeResourceEndpointByType[object];
  return getPathValue(stripe, endpoint) as any;
}

export function deleteStripeObjects<
  T extends readonly { id: string; object: StripeDeletableObjectType }[]
>(stripe: Stripe, objects: T) {
  objects
    .slice()
    .reverse()
    .forEach(async (obj) => {
      await getStripeResourceForObjectType(stripe, obj.object).del(obj.id);
    });
}

export type StripeRetrieveParams<
  TStripeResourceEndpoint extends keyof StripeResourceEndpointWithOperation<'retrieve'>
> = NonNullable<
  Exclude<
    ParameterOverloads<PathValue<Stripe, TStripeResourceEndpoint>['retrieve']>[1],
    Stripe.RequestOptions
  >
>;

export type StripeListParams<
  TStripeResourceEndpoint extends keyof StripeResourceEndpointWithOperation<'list'>
> = NonNullable<
  Exclude<
    ParameterOverloads<PathValue<Stripe, TStripeResourceEndpoint>['list']>[0],
    Stripe.RequestOptions
  >
>;

export default stripe;
