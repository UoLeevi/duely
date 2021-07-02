import {
  CountriesDocument,
  CountryCode,
  CountryUtil,
  CurrentUserDocument,
  ServicesAgreementDocument,
  AgencyStripeAccountUpdateUrlDocument,
  AgencyStripeAccountBalanceDocument,
  AgencyStripeAccountBalanceTransactionsDocument,
  AgencyStripeAccountPaymentIntentsDocument,
  AgencyCustomersDocument,
  CurrentUserAgenciesDocument,
  SubdomainPublicDocument,
  AgencyProductsDocument,
  ProductDocument,
  OrderDocument,
  OrdersDocument,
  OrderItemDocument,
  OrderItemsDocument,
  SubdomainAgencyDocument,
  SubdomainAgencyStripeAccountUpdateUrlDocument,
  AgencyThankYouPageSettingDocument,
  ProductThankYouPageSettingDocument,
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
  IntegrationTypesDocument
} from '@duely/core';
import { QueryOptions } from '@apollo/client';
import { client } from '../apollo/client';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';

export interface TypedQueryOptions<TDocumentNode extends TypedDocumentNode<unknown, unknown>>
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
  readonly result: (data: TData) => TResult;
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
  const { result, variables: defaultVariables, ...defaultOptions } = queryDef;
  const mergedVariables = { ...defaultVariables, ...variables };
  const { data } = await client.query({
    variables: mergedVariables,
    ...defaultOptions,
    ...options
  });

  return result(data);
}

export const current_user_Q = {
  query: CurrentUserDocument,
  notifyOnNetworkStatusChange: true,
  result: (d: ResultOf<typeof CurrentUserDocument>) => d?.current_user
};

export const countries_Q = {
  query: CountriesDocument,
  result: (d: ResultOf<typeof CountriesDocument>) =>
    d?.country_codes?.map((code) => CountryUtil.fromCode(code as CountryCode))
};

export const country_spec_Q = {
  query: CountrySpecDocument,
  result: (d: ResultOf<typeof CountrySpecDocument>) => d?.country_spec
};

export const services_agreement_Q = {
  query: ServicesAgreementDocument,
  result: (d: ResultOf<typeof ServicesAgreementDocument>) => d?.markdowns?.[0]?.data
};

export const agency_Q = {
  query: AgencyDocument,
  result: (d: ResultOf<typeof AgencyDocument>) => d?.agency
};

export const agencies_Q = {
  query: AgenciesDocument,
  result: (d: ResultOf<typeof AgenciesDocument>) => d?.agencies
};

export const agency_stripe_account_Q = {
  query: AgencyStripeAccountDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountDocument>) => d?.agency?.stripe_account
};

export const agency_stripe_account_update_url_Q = {
  query: AgencyStripeAccountUpdateUrlDocument,
  fetchPolicy: 'no-cache',
  result: (d: ResultOf<typeof AgencyStripeAccountUpdateUrlDocument>) =>
    d?.agency?.stripe_account?.account_update_url?.url
} as const;

export const agency_stripe_account_balance_Q = {
  query: AgencyStripeAccountBalanceDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountBalanceDocument>) =>
    d?.agency?.stripe_account?.balance
};

export const agency_stripe_account_balance_transactions_Q = {
  query: AgencyStripeAccountBalanceTransactionsDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountBalanceTransactionsDocument>) =>
    d?.agency?.stripe_account?.balance_transactions
};

export const agency_stripe_account_payment_intents_Q = {
  query: AgencyStripeAccountPaymentIntentsDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountPaymentIntentsDocument>) =>
    d?.agency?.stripe_account?.payment_intents
};

export const agency_customers_Q = {
  query: AgencyCustomersDocument,
  result: (d: ResultOf<typeof AgencyCustomersDocument>) => d?.agency?.stripe_account?.customers
};

export const customer_Q = {
  query: CustomerDocument,
  result: (d: ResultOf<typeof CustomerDocument>) => d?.customer
};

export const current_user_agencies_Q = {
  query: CurrentUserAgenciesDocument,
  notifyOnNetworkStatusChange: true,
  result: (d: ResultOf<typeof CurrentUserAgenciesDocument>) =>
    d?.current_user?.memberships.map((m) => ({
      ...m.subdomain.agency,
      subdomain: m.subdomain
    }))
};

export const subdomain_public_Q = {
  query: SubdomainPublicDocument,
  result: (d: ResultOf<typeof SubdomainPublicDocument>) => d?.subdomains?.[0]
};

export const current_subdomain_Q = {
  ...subdomain_public_Q,
  variables: {
    subdomain_name: resolveSubdomain()
  }
};

function resolveSubdomain(): string | null {
  const url = new URL(window.location.href);
  let name = url.searchParams.get('subdomain');
  let subdomain = name?.toLowerCase() ?? null;
  if (subdomain !== null) return subdomain;

  const hostname = window.location.hostname.toLowerCase();

  if (hostname !== 'localhost') {
    if (hostname !== 'duely.app') {
      if (hostname.endsWith('.duely.app')) {
        subdomain = hostname.slice(0, -'.duely.app'.length);
      } else {
        // TODO: check from database
        throw new Error('Not implemented.');
      }
    }
  }

  return subdomain;
}

export const agency_products_Q = {
  query: AgencyProductsDocument,
  result: (d: ResultOf<typeof AgencyProductsDocument>) => d?.agency?.products
};

export const product_Q = {
  query: ProductDocument,
  result: (d: ResultOf<typeof ProductDocument>) => d?.product
};

export const products_Q = {
  query: ProductsDocument,
  result: (d: ResultOf<typeof ProductsDocument>) => d?.products
};

export const form_field_Q = {
  query: FormFieldDocument,
  result: (d: ResultOf<typeof FormFieldDocument>) => d?.form_field
};

export const form_fields_Q = {
  query: FormFieldsDocument,
  result: (d: ResultOf<typeof FormFieldsDocument>) => d?.form_fields
};

export const integration_Q = {
  query: IntegrationDocument,
  result: (d: ResultOf<typeof IntegrationDocument>) => d?.integration
};

export const integrations_Q = {
  query: IntegrationsDocument,
  result: (d: ResultOf<typeof IntegrationsDocument>) => d?.integrations
};

export const integration_type_Q = {
  query: IntegrationTypeDocument,
  result: (d: ResultOf<typeof IntegrationTypeDocument>) => d?.integration_type
};

export const integration_types_Q = {
  query: IntegrationTypesDocument,
  result: (d: ResultOf<typeof IntegrationTypesDocument>) => d?.integration_types
};

export const order_Q = {
  query: OrderDocument,
  result: (d: ResultOf<typeof OrderDocument>) => d?.order
};

export const orders_Q = {
  query: OrdersDocument,
  result: (d: ResultOf<typeof OrdersDocument>) => d?.orders
};

export const order_item_Q = {
  query: OrderItemDocument,
  result: (d: ResultOf<typeof OrderItemDocument>) => d?.order_item
};

export const order_items_Q = {
  query: OrderItemsDocument,
  result: (d: ResultOf<typeof OrderItemsDocument>) => d?.order_items
};

export const product_and_agency_from_url_parts_Q = {
  query: ProductAndAgencyFromUrlPartsDocument,
  result: (d: ResultOf<typeof ProductAndAgencyFromUrlPartsDocument>) =>
    d?.subdomains?.[0]?.agency.products?.[0]
};

export const current_agency_Q = {
  ...current_subdomain_Q,
  query: SubdomainAgencyDocument,
  result: (d: ResultOf<typeof SubdomainAgencyDocument>) => d?.subdomains?.[0]?.agency
};

export const current_agency_extended_Q = {
  ...current_subdomain_Q,
  query: SubdomainAgencyExtendedDocument,
  result: (d: ResultOf<typeof SubdomainAgencyExtendedDocument>) => d?.subdomains?.[0]?.agency
};

export const current_agency_stripe_account_update_url_Q = {
  ...current_subdomain_Q,
  query: SubdomainAgencyStripeAccountUpdateUrlDocument,
  fetchPolicy: 'no-cache',
  result: (d: ResultOf<typeof SubdomainAgencyStripeAccountUpdateUrlDocument>) =>
    d?.subdomains?.[0]?.agency?.stripe_account?.account_update_url?.url
} as const;

export const agency_thank_you_page_settings_Q = {
  query: AgencyThankYouPageSettingDocument,
  result: (d: ResultOf<typeof AgencyThankYouPageSettingDocument>) =>
    d?.agency?.settings?.thank_you_page_setting
};

export const product_thank_you_page_settings_Q = {
  query: ProductThankYouPageSettingDocument,
  result: (d: ResultOf<typeof ProductThankYouPageSettingDocument>) =>
    d?.product?.settings?.thank_you_page_setting
};

export const agency_pages_Q = {
  query: AgencyPagesDocument,
  result: (d: ResultOf<typeof AgencyPagesDocument>) => d?.pages
};

export const agency_subscription_plan_Q = {
  query: AgencySubscriptionPlanDocument,
  result: (d: ResultOf<typeof AgencySubscriptionPlanDocument>) => d?.agency?.subscription_plan
};

export const page_Q = {
  query: PageDocument,
  result: (d: ResultOf<typeof PageDocument>) => d?.page
};

export const page_by_url_Q = {
  query: PageByUrlDocument,
  result: (d: ResultOf<typeof PageByUrlDocument>) => d?.page_by_url
};

export const page_block_Q = {
  query: PageBlockDocument,
  result: (d: ResultOf<typeof PageBlockDocument>) => d?.page_block
};

export const page_definition_Q = {
  query: PageDefinitionDocument,
  result: (d: ResultOf<typeof PageDefinitionDocument>) => d?.page_definition
};

export const page_block_definition_Q = {
  query: PageBlockDefinitionDocument,
  result: (d: ResultOf<typeof PageBlockDefinitionDocument>) => d?.page_block_definition
};

export const page_definition_by_name_Q = {
  query: PageDefinitionsByNameDocument,
  result: (d: ResultOf<typeof PageDefinitionsByNameDocument>) => d?.page_definitions?.[0]
};

export const page_definition_by_url_path_Q = {
  query: PageDefinitionByUrlPathDocument,
  result: (d: ResultOf<typeof PageDefinitionByUrlPathDocument>) => d?.page_definition_by_url_path
};

export const page_block_definition_by_name_Q = {
  query: PageBlockDefinitionsByNameDocument,
  result: (d: ResultOf<typeof PageBlockDefinitionsByNameDocument>) => d?.page_block_definitions?.[0]
};

export const calculate_transaction_fee_Q = {
  query: CalculateTransactionFeeDocument,
  result: (d: ResultOf<typeof CalculateTransactionFeeDocument>) =>
    d?.subscription_plan?.calculate_fee
};
