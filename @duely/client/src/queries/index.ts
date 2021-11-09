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
  PromotionCodesDocument
} from '@duely/core';
import { QueryOptions } from '@apollo/client';
import { client } from '../apollo/client';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
import { CountryCode, countryFromCode } from '@duely/util';

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
    d?.country_codes?.map((code) => countryFromCode(code as CountryCode))
};

export const country_spec_Q = {
  query: CountrySpecDocument,
  result: (d: ResultOf<typeof CountrySpecDocument>) => d?.country_spec
};

export const markdown_Q = {
  query: MarkdownDocument,
  result: (d: ResultOf<typeof MarkdownDocument>) => d?.markdown
};

export const markdowns_Q = {
  query: MarkdownsDocument,
  result: (d: ResultOf<typeof MarkdownsDocument>) => d?.markdowns
};

export const image_Q = {
  query: ImageDocument,
  result: (d: ResultOf<typeof ImageDocument>) => d?.image
};

export const images_Q = {
  query: ImagesDocument,
  result: (d: ResultOf<typeof ImagesDocument>) => d?.images
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

export const customers_Q = {
  query: CustomersDocument,
  result: (d: ResultOf<typeof CustomersDocument>) => d?.customers
};

export const count_customers_Q = {
  query: CountCustomersDocument,
  result: (d: ResultOf<typeof CountCustomersDocument>) => d?.count_customers
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

export const theme_Q = {
  query: ThemeDocument,
  result: (d: ResultOf<typeof ThemeDocument>) => d?.theme
};

export const themes_Q = {
  query: ThemesDocument,
  result: (d: ResultOf<typeof ThemesDocument>) => d?.themes
};

export const product_Q = {
  query: ProductDocument,
  result: (d: ResultOf<typeof ProductDocument>) => d?.product
};

export const products_Q = {
  query: ProductsDocument,
  result: (d: ResultOf<typeof ProductsDocument>) => d?.products
};
export const count_products_Q = {
  query: CountProductsDocument,
  result: (d: ResultOf<typeof CountProductsDocument>) => d?.count_products
};

export const form_field_Q = {
  query: FormFieldDocument,
  result: (d: ResultOf<typeof FormFieldDocument>) => d?.form_field
};

export const form_fields_Q = {
  query: FormFieldsDocument,
  result: (d: ResultOf<typeof FormFieldsDocument>) => d?.form_fields
};

export const credential_Q = {
  query: CredentialDocument,
  result: (d: ResultOf<typeof CredentialDocument>) => d?.credential
};

export const credentials_Q = {
  query: CredentialsDocument,
  result: (d: ResultOf<typeof CredentialsDocument>) => d?.credentials
};

export const credential_type_Q = {
  query: CredentialTypeDocument,
  result: (d: ResultOf<typeof CredentialTypeDocument>) => d?.credential_type
};

export const credential_types_Q = {
  query: CredentialTypesDocument,
  result: (d: ResultOf<typeof CredentialTypesDocument>) => d?.credential_types
};

export const integration_Q = {
  query: IntegrationDocument,
  result: (d: ResultOf<typeof IntegrationDocument>) => d?.integration
};

export const integrations_Q = {
  query: IntegrationsDocument,
  result: (d: ResultOf<typeof IntegrationsDocument>) => d?.integrations
};

export const integration_config_Q = {
  query: IntegrationConfigDocument,
  result: (d: ResultOf<typeof IntegrationConfigDocument>) => d?.integration_config
};

export const integration_configs_Q = {
  query: IntegrationConfigsDocument,
  result: (d: ResultOf<typeof IntegrationConfigsDocument>) => d?.integration_configs
};

export const integration_type_Q = {
  query: IntegrationTypeDocument,
  result: (d: ResultOf<typeof IntegrationTypeDocument>) => d?.integration_type
};

export const integration_types_Q = {
  query: IntegrationTypesDocument,
  result: (d: ResultOf<typeof IntegrationTypesDocument>) => d?.integration_types
};

export const order_details_Q = {
  query: OrderDetailsDocument,
  result: (d: ResultOf<typeof OrderDetailsDocument>) => d?.order
};

export const order_Q = {
  query: OrderDocument,
  result: (d: ResultOf<typeof OrderDocument>) => d?.order
};

export const orders_Q = {
  query: OrdersDocument,
  result: (d: ResultOf<typeof OrdersDocument>) => d?.orders
};

export const count_orders_Q = {
  query: CountOrdersDocument,
  result: (d: ResultOf<typeof CountOrdersDocument>) => d?.count_orders
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

export const agency_settings_Q = {
  query: AgencySettingsDocument,
  result: (d: ResultOf<typeof AgencySettingsDocument>) => d?.agency?.settings
};

export const product_settings_Q = {
  query: ProductSettingsDocument,
  result: (d: ResultOf<typeof ProductSettingsDocument>) => d?.product?.settings
};

export const agency_pages_Q = {
  query: AgencyPagesDocument,
  result: (d: ResultOf<typeof AgencyPagesDocument>) => d?.pages
};

export const agency_subscription_plan_Q = {
  query: AgencySubscriptionPlanDocument,
  result: (d: ResultOf<typeof AgencySubscriptionPlanDocument>) => d?.agency?.subscription_plan
};

export const agency_stripe_account_bank_accounts_Q = {
  query: AgencyStripeAccountBankAccountsDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountBankAccountsDocument>) =>
    d?.agency?.stripe_account?.bank_accounts
};

export const agency_stripe_account_invoices_Q = {
  query: AgencyStripeAccountInvoicesDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountInvoicesDocument>) =>
    d?.agency?.stripe_account?.invoices
};

export const agency_stripe_account_invoiceitems_Q = {
  query: AgencyStripeAccountInvoiceItemsDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountInvoiceItemsDocument>) =>
    d?.agency?.stripe_account?.invoiceitems
};

export const invoice_Q = {
  query: InvoiceDocument,
  result: (d: ResultOf<typeof InvoiceDocument>) => d?.invoice
};

export const agency_stripe_account_coupons_Q = {
  query: AgencyStripeAccountCouponsDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountCouponsDocument>) =>
    d?.agency?.stripe_account?.coupons
};

export const coupon_Q = {
  query: CouponDocument,
  result: (d: ResultOf<typeof CouponDocument>) => d?.coupon
};

export const promotion_code_Q = {
  query: PromotionCodeDocument,
  result: (d: ResultOf<typeof PromotionCodeDocument>) => d?.promotion_code
};

export const promotion_codes_Q = {
  query: PromotionCodesDocument,
  result: (d: ResultOf<typeof PromotionCodesDocument>) => d?.promotion_codes
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
