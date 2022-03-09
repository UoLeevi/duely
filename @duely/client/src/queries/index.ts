import {
  CountriesDocument,
  CurrentUserDocument,
  AgencyStripeAccountUpdateUrlDocument,
  AgencyStripeAccountBalanceDocument,
  AgencyStripeAccountBalanceTransactionsDocument,
  AgencyStripeAccountPaymentIntentsDocument,
  AgencyCustomersDocument,
  CurrentUserAgenciesDocument,
  SubdomainPublicDocument,
  ProductDocument,
  OrderDocument,
  OrdersDocument,
  OrderItemDocument,
  OrderItemsDocument,
  SubdomainAgencyDocument,
  SubdomainAgencyStripeAccountUpdateUrlDocument,
  AgencySettingsDocument,
  ProductSettingsDocument,
  ProductAndAgencyFromUrlPartsDocument,
  AgencyPagesDocument,
  AgencySubscriptionPlanDocument,
  PageDocument,
  PageBlockDocument,
  PageDefinitionDocument,
  PageBlockDefinitionDocument,
  PageDefinitionsByNameDocument,
  PageBlockDefinitionsByNameDocument,
  PageDefinitionByUrlPathDocument,
  PageByUrlDocument,
  ProductsDocument,
  AgencyDocument,
  AgenciesDocument,
  CalculateTransactionFeeDocument,
  CountrySpecDocument,
  CustomerDocument,
  AgencyStripeAccountDocument,
  SubdomainAgencyExtendedDocument,
  FormFieldDocument,
  FormFieldsDocument,
  IntegrationDocument,
  IntegrationTypeDocument,
  IntegrationsDocument,
  IntegrationTypesDocument,
  IntegrationConfigDocument,
  IntegrationConfigsDocument,
  ImageDocument,
  ImagesDocument,
  CredentialDocument,
  CredentialsDocument,
  CredentialTypeDocument,
  CredentialTypesDocument,
  CountOrdersDocument,
  CountProductsDocument,
  CustomersDocument,
  CountCustomersDocument,
  AgencyStripeAccountBankAccountsDocument,
  MarkdownDocument,
  MarkdownsDocument,
  OrderDetailsDocument,
  AgencyStripeAccountCouponsDocument,
  CouponDocument,
  ThemeDocument,
  ThemesDocument,
  AgencyStripeAccountInvoicesDocument,
  InvoiceDocument,
  AgencyStripeAccountInvoiceItemsDocument,
  PromotionCodeDocument,
  PromotionCodesDocument,
  SubscriptionDocument,
  AgencyStripeAccountSubscriptionsDocument,
  CustomerSubscriptionsDocument,
  CustomerPaymentIntentsDocument,
  CustomerInvoicesDocument,
  StripeSubscription,
  AgencyStripeAccountChargesDocument,
  ChargeDocument,
  PaymentIntentDocument
} from '@duely/core';
import { ApolloCache, NormalizedCacheObject, QueryOptions } from '@apollo/client';
import { client } from '../apollo/client';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
import { CountryCode, countryFromCode } from '@duely/util';

export interface TypedQueryOptions<TDocumentNode extends TypedDocumentNode<any, any>>
  extends QueryOptions<VariablesOf<TDocumentNode>, ResultOf<TDocumentNode>> {
  readonly query: TDocumentNode;
}

export interface QueryDefinition<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult
> extends Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'variables'> {
  readonly variables?: TBoundVariables;
  readonly result: (data: TData) => TResult | null;
  readonly after?: (
    cache: ApolloCache<NormalizedCacheObject>,
    res: TResult | null,
    variables: TVariables
  ) => Promise<void>;
}

// just a wrapper for convenience
export async function query<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult
>(
  queryDef: QueryDefinition<TData, TVariables, TBoundVariables, TResult>,
  variables?: Omit<TVariables, keyof typeof queryDef.variables>,
  options?: Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'query' | 'variables'>
): Promise<ReturnType<typeof queryDef.result>> {
  const { result, after, variables: defaultVariables, ...defaultOptions } = queryDef;
  const mergedVariables = { ...defaultVariables, ...variables };
  const { data } = await client.query({
    variables: mergedVariables as any,
    ...defaultOptions,
    ...options
  });

  const res = data == null ? null : result(data);

  if (after) {
    await after(client.cache, res, mergedVariables as any);
  }

  return res;
}

const current_user_R = (d: ResultOf<typeof CurrentUserDocument>) => d?.current_user;
export const current_user_Q = {
  query: CurrentUserDocument,
  notifyOnNetworkStatusChange: true,
  result: current_user_R
};

const countries_R = (d: ResultOf<typeof CountriesDocument>) =>
  d?.country_codes?.map((code) => countryFromCode(code as CountryCode));
export const countries_Q = {
  query: CountriesDocument,
  result: countries_R
};

const country_spec_R = (d: ResultOf<typeof CountrySpecDocument>) => d?.country_spec;
export const country_spec_Q = {
  query: CountrySpecDocument,
  result: country_spec_R
};

const markdown_R = (d: ResultOf<typeof MarkdownDocument>) => d?.markdown;
export const markdown_Q = {
  query: MarkdownDocument,
  result: markdown_R
};

const markdowns_R = (d: ResultOf<typeof MarkdownsDocument>) => d?.markdowns;
export const markdowns_Q = {
  query: MarkdownsDocument,
  result: markdowns_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    customers: ReturnType<typeof agency_customers_R> | null
  ) {
    if (!customers) return;
    for (const customer of customers) {
      cache.writeQuery({
        query: CustomerDocument,
        variables: { customer_id: customer.id },
        data: { customer }
      });
    }
  }
};

const image_R = (d: ResultOf<typeof ImageDocument>) => d?.image;
export const image_Q = {
  query: ImageDocument,
  result: image_R
};

const images_R = (d: ResultOf<typeof ImagesDocument>) => d?.images;
export const images_Q = {
  query: ImagesDocument,
  result: images_R
};

const agency_R = (d: ResultOf<typeof AgencyDocument>) => d?.agency;
export const agency_Q = {
  query: AgencyDocument,
  result: agency_R
};

const agencies_R = (d: ResultOf<typeof AgenciesDocument>) => d?.agencies;
export const agencies_Q = {
  query: AgenciesDocument,
  result: agencies_R
};

const agency_stripe_account_R = (d: ResultOf<typeof AgencyStripeAccountDocument>) =>
  d?.agency?.stripe_account;
export const agency_stripe_account_Q = {
  query: AgencyStripeAccountDocument,
  result: agency_stripe_account_R
};

const agency_stripe_account_update_url_R = (
  d: ResultOf<typeof AgencyStripeAccountUpdateUrlDocument>
) => d?.agency?.stripe_account?.account_update_url?.url;
export const agency_stripe_account_update_url_Q = {
  query: AgencyStripeAccountUpdateUrlDocument,
  fetchPolicy: 'no-cache',
  result: agency_stripe_account_update_url_R
} as const;

const agency_stripe_account_balance_R = (d: ResultOf<typeof AgencyStripeAccountBalanceDocument>) =>
  d?.agency?.stripe_account?.balance;
export const agency_stripe_account_balance_Q = {
  query: AgencyStripeAccountBalanceDocument,
  result: agency_stripe_account_balance_R
};

const agency_stripe_account_balance_transactions_R = (
  d: ResultOf<typeof AgencyStripeAccountBalanceTransactionsDocument>
) => d?.agency?.stripe_account?.balance_transactions;
export const agency_stripe_account_balance_transactions_Q = {
  query: AgencyStripeAccountBalanceTransactionsDocument,
  result: agency_stripe_account_balance_transactions_R
};

const agency_stripe_account_payment_intents_R = (
  d: ResultOf<typeof AgencyStripeAccountPaymentIntentsDocument>
) => d?.agency?.stripe_account?.payment_intents;
export const agency_stripe_account_payment_intents_Q = {
  query: AgencyStripeAccountPaymentIntentsDocument,
  result: agency_stripe_account_payment_intents_R
};

const agency_stripe_account_charges_R = (d: ResultOf<typeof AgencyStripeAccountChargesDocument>) =>
  d?.agency?.stripe_account?.charges;
export const agency_stripe_account_charges_Q = {
  query: AgencyStripeAccountChargesDocument,
  result: agency_stripe_account_charges_R
};

const agency_subscriptions_R = (d: ResultOf<typeof AgencyStripeAccountSubscriptionsDocument>) =>
  d?.agency?.stripe_account?.subscriptions;
export const agency_subscriptions_Q = {
  query: AgencyStripeAccountSubscriptionsDocument,
  result: agency_subscriptions_R
};

const subscription_R = (d: ResultOf<typeof SubscriptionDocument>) => d?.subscription;
export const subscription_Q = {
  query: SubscriptionDocument,
  result: subscription_R
};

const charge_R = (d: ResultOf<typeof ChargeDocument>) => d?.charge;
export const charge_Q = {
  query: ChargeDocument,
  result: charge_R
};

const payment_intent_R = (d: ResultOf<typeof PaymentIntentDocument>) => d?.payment_intent;
export const payment_intent_Q = {
  query: PaymentIntentDocument,
  result: payment_intent_R
};

const agency_customers_R = (d: ResultOf<typeof AgencyCustomersDocument>) =>
  d?.agency?.stripe_account?.customers;
export const agency_customers_Q = {
  query: AgencyCustomersDocument,
  result: agency_customers_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    markdowns: ReturnType<typeof markdowns_R> | null
  ) {
    if (!markdowns) return;
    for (const markdown of markdowns) {
      cache.writeQuery({
        query: MarkdownDocument,
        variables: { markdown_id: markdown.id },
        data: { markdown }
      });
    }
  }
};

const customer_R = (d: ResultOf<typeof CustomerDocument>) => d?.customer;
export const customer_Q = {
  query: CustomerDocument,
  result: customer_R
};

const customer_subscriptions_R = (d: ResultOf<typeof CustomerSubscriptionsDocument>) =>
  d?.customer?.stripe_customers?.flatMap((cus) => cus.subscriptions);
export const customer_subscriptions_Q = {
  query: CustomerSubscriptionsDocument,
  result: customer_subscriptions_R
};

const customer_payment_intents_R = (d: ResultOf<typeof CustomerPaymentIntentsDocument>) =>
  d?.customer?.stripe_customers?.flatMap((cus) => cus.payment_intents);
export const customer_payment_intents_Q = {
  query: CustomerPaymentIntentsDocument,
  result: customer_payment_intents_R
};

const customer_invoices_R = (d: ResultOf<typeof CustomerInvoicesDocument>) =>
  d?.customer?.stripe_customers?.flatMap((cus) => cus.invoices);
export const customer_invoices_Q = {
  query: CustomerInvoicesDocument,
  result: customer_invoices_R
};

const customers_R = (d: ResultOf<typeof CustomersDocument>) => d?.customers;
export const customers_Q = {
  query: CustomersDocument,
  result: customers_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    customers: ReturnType<typeof customers_R> | null
  ) {
    if (!customers) return;
    for (const customer of customers) {
      cache.writeQuery({
        query: CustomerDocument,
        variables: { customer_id: customer.id },
        data: { customer }
      });
    }
  }
};

const count_customers_R = (d: ResultOf<typeof CountCustomersDocument>) => d?.count_customers;
export const count_customers_Q = {
  query: CountCustomersDocument,
  result: count_customers_R
};

const current_user_agencies_R = (d: ResultOf<typeof CurrentUserAgenciesDocument>) =>
  d?.current_user?.memberships.map((m) => ({
    ...m.subdomain.agency,
    subdomain: m.subdomain
  }));
export const current_user_agencies_Q = {
  query: CurrentUserAgenciesDocument,
  notifyOnNetworkStatusChange: true,
  result: current_user_agencies_R
};

const subdomain_public_R = (d: ResultOf<typeof SubdomainPublicDocument>) => d?.subdomains?.[0];
export const subdomain_public_Q = {
  query: SubdomainPublicDocument,
  result: subdomain_public_R
};

export const current_subdomain_Q = {
  ...subdomain_public_Q,
  variables: {
    subdomain_name: resolveSubdomain()
  }
};

function isPrivateIp(hostname: string) {
  var parts = hostname.split('.').map((part) => parseInt(part, 10));
  if (parts.length !== 4 || parts.some(isNaN)) return false;

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

function resolveSubdomain(): string | null {
  const url = new URL(window.location.href);
  const hostname = url.hostname.toLowerCase();

  if (hostname === 'localhost' || isPrivateIp(hostname)) {
    // development environment
    let subdomain = url.searchParams.get('subdomain')?.toLowerCase() ?? null;

    if (subdomain !== null) {
      sessionStorage.setItem('development-subdomain', subdomain);
      return subdomain;
    }

    return sessionStorage.getItem('development-subdomain');
  }

  if (hostname !== 'duely.app') {
    if (hostname.endsWith('.duely.app')) {
      return hostname.slice(0, -'.duely.app'.length);
    } else {
      // TODO: check from database
      throw new Error('Not implemented.');
    }
  }

  return null;
}

const theme_R = (d: ResultOf<typeof ThemeDocument>) => d?.theme;
export const theme_Q = {
  query: ThemeDocument,
  result: theme_R
};

const themes_R = (d: ResultOf<typeof ThemesDocument>) => d?.themes;
export const themes_Q = {
  query: ThemesDocument,
  result: themes_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    themes: ReturnType<typeof themes_R> | null
  ) {
    if (!themes) return;
    for (const theme of themes) {
      cache.writeQuery({
        query: ThemeDocument,
        variables: { theme_id: theme.id },
        data: { theme }
      });
    }
  }
};

const product_R = (d: ResultOf<typeof ProductDocument>) => d?.product;
export const product_Q = {
  query: ProductDocument,
  result: product_R
};

const products_R = (d: ResultOf<typeof ProductsDocument>) => d?.products;
export const products_Q = {
  query: ProductsDocument,
  result: products_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    products: ReturnType<typeof products_R> | null
  ) {
    if (!products) return;
    for (const product of products) {
      cache.writeQuery({
        query: ProductDocument,
        variables: { product_id: product.id },
        data: { product }
      });
    }
  }
};

const count_products_R = (d: ResultOf<typeof CountProductsDocument>) => d?.count_products;
export const count_products_Q = {
  query: CountProductsDocument,
  result: count_products_R
};

const form_field_R = (d: ResultOf<typeof FormFieldDocument>) => d?.form_field;
export const form_field_Q = {
  query: FormFieldDocument,
  result: form_field_R
};

const form_fields_R = (d: ResultOf<typeof FormFieldsDocument>) => d?.form_fields;
export const form_fields_Q = {
  query: FormFieldsDocument,
  result: form_fields_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    form_fields: ReturnType<typeof form_fields_R> | null
  ) {
    if (!form_fields) return;
    for (const form_field of form_fields) {
      cache.writeQuery({
        query: FormFieldDocument,
        variables: { form_field_id: form_field.id },
        data: { form_field }
      });
    }
  }
};

const credential_R = (d: ResultOf<typeof CredentialDocument>) => d?.credential;
export const credential_Q = {
  query: CredentialDocument,
  result: credential_R
};

const credentials_R = (d: ResultOf<typeof CredentialsDocument>) => d?.credentials;
export const credentials_Q = {
  query: CredentialsDocument,
  result: credentials_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    credentials: ReturnType<typeof credentials_R> | null
  ) {
    if (!credentials) return;
    for (const credential of credentials) {
      cache.writeQuery({
        query: CredentialDocument,
        variables: { credential_id: credential.id },
        data: { credential }
      });
    }
  }
};

const credential_type_R = (d: ResultOf<typeof CredentialTypeDocument>) => d?.credential_type;
export const credential_type_Q = {
  query: CredentialTypeDocument,
  result: credential_type_R
};

const credential_types_R = (d: ResultOf<typeof CredentialTypesDocument>) => d?.credential_types;
export const credential_types_Q = {
  query: CredentialTypesDocument,
  result: credential_types_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    credential_types: ReturnType<typeof credential_types_R> | null
  ) {
    if (!credential_types) return;
    for (const credential_type of credential_types) {
      cache.writeQuery({
        query: CredentialTypeDocument,
        variables: { credential_type_id: credential_type.id },
        data: { credential_type }
      });
    }
  }
};

const integration_R = (d: ResultOf<typeof IntegrationDocument>) => d?.integration;
export const integration_Q = {
  query: IntegrationDocument,
  result: integration_R
};

const integrations_R = (d: ResultOf<typeof IntegrationsDocument>) => d?.integrations;
export const integrations_Q = {
  query: IntegrationsDocument,
  result: integrations_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    integrations: ReturnType<typeof integrations_R> | null
  ) {
    if (!integrations) return;
    for (const integration of integrations) {
      cache.writeQuery({
        query: IntegrationDocument,
        variables: { integration_id: integration.id },
        data: { integration }
      });
    }
  }
};

const integration_config_R = (d: ResultOf<typeof IntegrationConfigDocument>) =>
  d?.integration_config;
export const integration_config_Q = {
  query: IntegrationConfigDocument,
  result: integration_config_R
};

const integration_configs_R = (d: ResultOf<typeof IntegrationConfigsDocument>) =>
  d?.integration_configs;
export const integration_configs_Q = {
  query: IntegrationConfigsDocument,
  result: integration_configs_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    integration_configs: ReturnType<typeof integration_configs_R> | null
  ) {
    if (!integration_configs) return;
    for (const integration_config of integration_configs) {
      cache.writeQuery({
        query: IntegrationConfigDocument,
        variables: { integration_config_id: integration_config.id },
        data: { integration_config }
      });
    }
  }
};

const integration_type_R = (d: ResultOf<typeof IntegrationTypeDocument>) => d?.integration_type;
export const integration_type_Q = {
  query: IntegrationTypeDocument,
  result: integration_type_R
};

const integration_types_R = (d: ResultOf<typeof IntegrationTypesDocument>) => d?.integration_types;
export const integration_types_Q = {
  query: IntegrationTypesDocument,
  result: integration_types_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    integration_types: ReturnType<typeof integration_types_R> | null
  ) {
    if (!integration_types) return;
    for (const integration_type of integration_types) {
      cache.writeQuery({
        query: IntegrationTypeDocument,
        variables: { integration_type_id: integration_type.id },
        data: { integration_type }
      });
    }
  }
};

const order_details_R = (d: ResultOf<typeof OrderDetailsDocument>) => d?.order;
export const order_details_Q = {
  query: OrderDetailsDocument,
  result: order_details_R
};

const order_R = (d: ResultOf<typeof OrderDocument>) => d?.order;
export const order_Q = {
  query: OrderDocument,
  result: order_R
};

const orders_R = (d: ResultOf<typeof OrdersDocument>) => d?.orders;
export const orders_Q = {
  query: OrdersDocument,
  result: orders_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    orders: ReturnType<typeof orders_R> | null
  ) {
    if (!orders) return;
    for (const order of orders) {
      cache.writeQuery({
        query: OrderDocument,
        variables: { order_id: order.id },
        data: { order }
      });
    }
  }
};

const count_orders_R = (d: ResultOf<typeof CountOrdersDocument>) => d?.count_orders;
export const count_orders_Q = {
  query: CountOrdersDocument,
  result: count_orders_R
};

const order_item_R = (d: ResultOf<typeof OrderItemDocument>) => d?.order_item;
export const order_item_Q = {
  query: OrderItemDocument,
  result: order_item_R
};

const order_items_R = (d: ResultOf<typeof OrderItemsDocument>) => d?.order_items;
export const order_items_Q = {
  query: OrderItemsDocument,
  result: order_items_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    order_items: ReturnType<typeof order_items_R> | null
  ) {
    if (!order_items) return;
    for (const order_item of order_items) {
      cache.writeQuery({
        query: OrderItemDocument,
        variables: { order_item_id: order_item.id },
        data: { order_item }
      });
    }
  }
};

const product_and_agency_from_url_parts_R = (
  d: ResultOf<typeof ProductAndAgencyFromUrlPartsDocument>
) => d?.subdomains?.[0]?.agency.products?.[0];
export const product_and_agency_from_url_parts_Q = {
  query: ProductAndAgencyFromUrlPartsDocument,
  result: product_and_agency_from_url_parts_R
};

const current_agency_R = (d: ResultOf<typeof SubdomainAgencyDocument>) =>
  d?.subdomains?.[0]?.agency;
export const current_agency_Q = {
  ...current_subdomain_Q,
  query: SubdomainAgencyDocument,
  result: current_agency_R
};

const current_agency_extended_R = (d: ResultOf<typeof SubdomainAgencyExtendedDocument>) =>
  d?.subdomains?.[0]?.agency;
export const current_agency_extended_Q = {
  ...current_subdomain_Q,
  query: SubdomainAgencyExtendedDocument,
  result: current_agency_extended_R
};

const current_subdomain_R = (d: ResultOf<typeof SubdomainAgencyStripeAccountUpdateUrlDocument>) =>
  d?.subdomains?.[0]?.agency?.stripe_account?.account_update_url?.url;
export const current_agency_stripe_account_update_url_Q = {
  ...current_subdomain_Q,
  query: SubdomainAgencyStripeAccountUpdateUrlDocument,
  fetchPolicy: 'no-cache',
  result: current_subdomain_R
} as const;

const agency_settings_R = (d: ResultOf<typeof AgencySettingsDocument>) => d?.agency?.settings;
export const agency_settings_Q = {
  query: AgencySettingsDocument,
  result: agency_settings_R
};

const product_settings_R = (d: ResultOf<typeof ProductSettingsDocument>) => d?.product?.settings;
export const product_settings_Q = {
  query: ProductSettingsDocument,
  result: product_settings_R
};

const agency_pages_R = (d: ResultOf<typeof AgencyPagesDocument>) => d?.pages;
export const agency_pages_Q = {
  query: AgencyPagesDocument,
  result: agency_pages_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    pages: ReturnType<typeof agency_pages_R> | null
  ) {
    if (!pages) return;
    for (const page of pages) {
      cache.writeQuery({
        query: PageDocument,
        variables: { page_id: page.id },
        data: { page }
      });
    }
  }
};

const agency_subscription_plan_R = (d: ResultOf<typeof AgencySubscriptionPlanDocument>) =>
  d?.agency?.subscription_plan;
export const agency_subscription_plan_Q = {
  query: AgencySubscriptionPlanDocument,
  result: agency_subscription_plan_R
};

const agency_stripe_account_bank_accounts_R = (
  d: ResultOf<typeof AgencyStripeAccountBankAccountsDocument>
) => d?.agency?.stripe_account?.bank_accounts;
export const agency_stripe_account_bank_accounts_Q = {
  query: AgencyStripeAccountBankAccountsDocument,
  result: agency_stripe_account_bank_accounts_R
};

const agency_stripe_account_invoices_R = (
  d: ResultOf<typeof AgencyStripeAccountInvoicesDocument>
) => d?.agency?.stripe_account?.invoices;
export const agency_stripe_account_invoices_Q = {
  query: AgencyStripeAccountInvoicesDocument,
  result: agency_stripe_account_invoices_R
};

const agency_stripe_account_invoiceitems_R = (
  d: ResultOf<typeof AgencyStripeAccountInvoiceItemsDocument>
) => d?.agency?.stripe_account?.invoiceitems;
export const agency_stripe_account_invoiceitems_Q = {
  query: AgencyStripeAccountInvoiceItemsDocument,
  result: agency_stripe_account_invoiceitems_R
};

const invoice_R = (d: ResultOf<typeof InvoiceDocument>) => d?.invoice;
export const invoice_Q = {
  query: InvoiceDocument,
  result: invoice_R
};

const agency_stripe_account_coupons_R = (d: ResultOf<typeof AgencyStripeAccountCouponsDocument>) =>
  d?.agency?.stripe_account?.coupons;
export const agency_stripe_account_coupons_Q = {
  query: AgencyStripeAccountCouponsDocument,
  result: agency_stripe_account_coupons_R
};

const coupon_R = (d: ResultOf<typeof CouponDocument>) => d?.coupon;
export const coupon_Q = {
  query: CouponDocument,
  result: coupon_R
};

const promotion_code_R = (d: ResultOf<typeof PromotionCodeDocument>) => d?.promotion_code;
export const promotion_code_Q = {
  query: PromotionCodeDocument,
  result: promotion_code_R
};

const promotion_codes_R = (d: ResultOf<typeof PromotionCodesDocument>) => d?.promotion_codes;
export const promotion_codes_Q = {
  query: PromotionCodesDocument,
  result: promotion_codes_R
};

const page_R = (d: ResultOf<typeof PageDocument>) => d?.page;
export const page_Q = {
  query: PageDocument,
  result: page_R
};

const page_by_url_R = (d: ResultOf<typeof PageByUrlDocument>) => d?.page_by_url;
export const page_by_url_Q = {
  query: PageByUrlDocument,
  result: page_by_url_R
};

const page_block_R = (d: ResultOf<typeof PageBlockDocument>) => d?.page_block;
export const page_block_Q = {
  query: PageBlockDocument,
  result: page_block_R
};

const page_definition_R = (d: ResultOf<typeof PageDefinitionDocument>) => d?.page_definition;
export const page_definition_Q = {
  query: PageDefinitionDocument,
  result: page_definition_R
};

const page_block_definition_R = (d: ResultOf<typeof PageBlockDefinitionDocument>) =>
  d?.page_block_definition;
export const page_block_definition_Q = {
  query: PageBlockDefinitionDocument,
  result: page_block_definition_R
};

const page_definition_by_name_R = (d: ResultOf<typeof PageDefinitionsByNameDocument>) =>
  d?.page_definitions?.[0];
export const page_definition_by_name_Q = {
  query: PageDefinitionsByNameDocument,
  result: page_definition_by_name_R
};

const page_definition_by_url_path_R = (d: ResultOf<typeof PageDefinitionByUrlPathDocument>) =>
  d?.page_definition_by_url_path;
export const page_definition_by_url_path_Q = {
  query: PageDefinitionByUrlPathDocument,
  result: page_definition_by_url_path_R
};

const page_block_definition_by_name_R = (d: ResultOf<typeof PageBlockDefinitionsByNameDocument>) =>
  d?.page_block_definitions?.[0];
export const page_block_definition_by_name_Q = {
  query: PageBlockDefinitionsByNameDocument,
  result: page_block_definition_by_name_R
};

const calculate_transaction_fee_R = (d: ResultOf<typeof CalculateTransactionFeeDocument>) =>
  d?.subscription_plan?.calculate_fee;
export const calculate_transaction_fee_Q = {
  query: CalculateTransactionFeeDocument,
  result: calculate_transaction_fee_R
};
