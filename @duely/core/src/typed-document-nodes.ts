import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** DateTime custom scalar type */
  DateTime: any;
  /** Json custom scalar type */
  Json: any;
};

export enum AccessLevel {
  Owner = 'OWNER',
  Manager = 'MANAGER',
  Agent = 'AGENT',
  Client = 'CLIENT',
  Public = 'PUBLIC'
}

export type Address = {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type Agency = Node & {
  __typename?: 'Agency';
  id: Scalars['ID'];
  name: Scalars['String'];
  livemode: Scalars['Boolean'];
  stripe_account: StripeAccount;
  subdomain: Subdomain;
  theme: Theme;
  products?: Maybe<Array<Product>>;
  pages?: Maybe<Array<Page>>;
  settings: AgencySettings;
  subscription_plan: SubscriptionPlan;
  default_pricing_currency?: Maybe<Scalars['String']>;
  supported_payment_currencies: Array<Scalars['String']>;
};


export type AgencyStripe_AccountArgs = {
  livemode?: Maybe<Scalars['Boolean']>;
};


export type AgencyProductsArgs = {
  filter?: Maybe<ProductFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type AgencyPagesArgs = {
  filter?: Maybe<PageFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};

export type AgencyFilter = {
  name?: Maybe<Scalars['String']>;
};

export type AgencyMutationResult = MutationResult & {
  __typename?: 'AgencyMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  agency?: Maybe<Agency>;
};

export type AgencySettings = {
  __typename?: 'AgencySettings';
  id: Scalars['ID'];
  thank_you_page_setting?: Maybe<AgencyThankYouPageSetting>;
};

export type AgencyThankYouPageSetting = {
  __typename?: 'AgencyThankYouPageSetting';
  id: Scalars['ID'];
  url: Scalars['String'];
};

export type AgencyThankYouPageSettingMutationResult = MutationResult & {
  __typename?: 'AgencyThankYouPageSettingMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  setting?: Maybe<AgencyThankYouPageSetting>;
};

export type BalanceTransaction = {
  __typename?: 'BalanceTransaction';
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  amount: Scalars['Int'];
  available_on: Scalars['DateTime'];
  created: Scalars['DateTime'];
  exchange_rate?: Maybe<Scalars['Float']>;
  currency: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  fee: Scalars['Int'];
  fee_details?: Maybe<Array<BalanceTransactionFeeDetails>>;
  net: Scalars['Int'];
  status: Scalars['String'];
  reporting_category: Scalars['String'];
  type: Scalars['String'];
  source: Scalars['String'];
};

export type BalanceTransactionFeeDetails = {
  __typename?: 'BalanceTransactionFeeDetails';
  amount: Scalars['Int'];
  application?: Maybe<Scalars['String']>;
  currency: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type BeginVisitResult = MutationResult & {
  __typename?: 'BeginVisitResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['String']>;
};

export type BillingDetails = {
  __typename?: 'BillingDetails';
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type BusinessProfile = {
  __typename?: 'BusinessProfile';
  mcc?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  product_description?: Maybe<Scalars['String']>;
  support_address?: Maybe<Scalars['String']>;
  support_email?: Maybe<Scalars['String']>;
  support_phone?: Maybe<Scalars['String']>;
  support_url?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Charge = {
  __typename?: 'Charge';
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  amount: Scalars['Int'];
  amount_capturable?: Maybe<Scalars['Int']>;
  amount_received?: Maybe<Scalars['Int']>;
  application_fee_amount?: Maybe<Scalars['Int']>;
  authorization_code?: Maybe<Scalars['String']>;
  balance_transaction?: Maybe<BalanceTransaction>;
  billing_details?: Maybe<BillingDetails>;
  calculated_statement_descriptor?: Maybe<Scalars['String']>;
  captured?: Maybe<Scalars['Boolean']>;
  created?: Maybe<Scalars['DateTime']>;
  currency?: Maybe<Scalars['String']>;
  customer?: Maybe<StripeCustomer>;
  description?: Maybe<Scalars['String']>;
  disputed?: Maybe<Scalars['Boolean']>;
  failure_code?: Maybe<Scalars['String']>;
  failure_message?: Maybe<Scalars['String']>;
  fraud_details?: Maybe<FraudDetails>;
  invoice?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  outcome?: Maybe<Outcome>;
  paid?: Maybe<Scalars['Boolean']>;
  payment_intent?: Maybe<PaymentIntent>;
  payment_method?: Maybe<Scalars['String']>;
  receipt_email?: Maybe<Scalars['String']>;
  receipt_number?: Maybe<Scalars['String']>;
  receipt_url?: Maybe<Scalars['String']>;
  refunded?: Maybe<Scalars['Boolean']>;
  source_transfer?: Maybe<Scalars['String']>;
  statement_descriptor?: Maybe<Scalars['String']>;
  statement_descriptor_suffix?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  transfer?: Maybe<Scalars['String']>;
  transfer_group?: Maybe<Scalars['String']>;
};

export type CountrySpec = {
  __typename?: 'CountrySpec';
  id: Scalars['ID'];
  default_currency: Scalars['String'];
  supported_payment_currencies: Array<Scalars['String']>;
  supported_payment_methods: Array<Scalars['String']>;
  supported_transfer_countries: Array<Scalars['String']>;
  verification_fields?: Maybe<CountrySpecVerificationFields>;
};

export type CountrySpecVerificationFields = {
  __typename?: 'CountrySpecVerificationFields';
  company?: Maybe<CountrySpecVerificationFieldsCompany>;
  individual?: Maybe<CountrySpecVerificationFieldsIndividual>;
};

export type CountrySpecVerificationFieldsCompany = {
  __typename?: 'CountrySpecVerificationFieldsCompany';
  additional: Array<Scalars['String']>;
  minimum: Array<Scalars['String']>;
};

export type CountrySpecVerificationFieldsIndividual = {
  __typename?: 'CountrySpecVerificationFieldsIndividual';
  additional: Array<Scalars['String']>;
  minimum: Array<Scalars['String']>;
};

export type CreateAgencyResult = MutationResult & {
  __typename?: 'CreateAgencyResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  agency?: Maybe<Agency>;
  stripe_verification_url?: Maybe<Scalars['String']>;
};

export type CreateStripeCheckoutSessionResult = MutationResult & {
  __typename?: 'CreateStripeCheckoutSessionResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  checkout_session_id?: Maybe<Scalars['String']>;
};

export type Credential = Node & {
  __typename?: 'Credential';
  id: Scalars['ID'];
  name: Scalars['String'];
  data: Scalars['Json'];
  agency: Agency;
  credential_type: CredentialType;
};

export type CredentialFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
  credential_type_id?: Maybe<Scalars['ID']>;
};

export type CredentialMutationResult = MutationResult & {
  __typename?: 'CredentialMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  credential?: Maybe<Credential>;
};

export type CredentialType = Node & {
  __typename?: 'CredentialType';
  id: Scalars['ID'];
  name: Scalars['String'];
  fields?: Maybe<Array<FormField>>;
};

export type CredentialTypeFilter = {
  name?: Maybe<Scalars['String']>;
  form_id?: Maybe<Scalars['ID']>;
};

export type Customer = {
  __typename?: 'Customer';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  email_address: Scalars['String'];
  default_stripe_customer: StripeCustomer;
  stripe_customers: Array<StripeCustomer>;
  user?: Maybe<User>;
  stripe_account: StripeAccount;
};


export type CustomerStripe_CustomersArgs = {
  created?: Maybe<Scalars['DateTime']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};

export type CustomerFilter = {
  stripe_account_id?: Maybe<Scalars['ID']>;
  email_address?: Maybe<Scalars['String']>;
  default_stripe_customer_id_ext?: Maybe<Scalars['ID']>;
};

export type CustomerMutationResult = MutationResult & {
  __typename?: 'CustomerMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
};


export type ExchangeRate = {
  __typename?: 'ExchangeRate';
  date: Scalars['DateTime'];
  currency: Scalars['String'];
  rate_eur: Scalars['Float'];
};

export type FormField = Node & {
  __typename?: 'FormField';
  id: Scalars['ID'];
  name: Scalars['String'];
  label: Scalars['String'];
  hint?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  required: Scalars['Boolean'];
  type: Scalars['String'];
  default?: Maybe<Scalars['Json']>;
};

export type FormFieldFilter = {
  form_id?: Maybe<Scalars['ID']>;
};

export type FraudDetails = {
  __typename?: 'FraudDetails';
  stripe_report?: Maybe<Scalars['String']>;
  user_report?: Maybe<Scalars['String']>;
};

export type Image = Node & {
  __typename?: 'Image';
  id: Scalars['ID'];
  name: Scalars['String'];
  data: Scalars['String'];
  color: Scalars['String'];
  agency?: Maybe<Agency>;
  access: AccessLevel;
};

export type ImageFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
};

export type ImageInput = {
  name: Scalars['String'];
  data: Scalars['String'];
  color: Scalars['String'];
};

export type ImageMutationResult = MutationResult & {
  __typename?: 'ImageMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  image?: Maybe<Image>;
};

export type Integration = {
  __typename?: 'Integration';
  id: Scalars['ID'];
  data: Scalars['Json'];
  agency: Agency;
  credential?: Maybe<Credential>;
  product?: Maybe<Product>;
  integration_type: IntegrationType;
  integration_config?: Maybe<IntegrationConfig>;
};

export type IntegrationConfig = Node & {
  __typename?: 'IntegrationConfig';
  id: Scalars['ID'];
  name: Scalars['String'];
  agency: Agency;
  credential?: Maybe<Credential>;
  integration_type: IntegrationType;
  data: Scalars['Json'];
};

export type IntegrationConfigFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
  integration_type_id?: Maybe<Scalars['ID']>;
};

export type IntegrationConfigMutationResult = MutationResult & {
  __typename?: 'IntegrationConfigMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  integration_config?: Maybe<IntegrationConfig>;
};

export type IntegrationFilter = {
  agency_id?: Maybe<Scalars['ID']>;
  integration_type_id?: Maybe<Scalars['ID']>;
  integration_config_id?: Maybe<Scalars['ID']>;
  product_id?: Maybe<Scalars['ID']>;
};

export type IntegrationMutationResult = MutationResult & {
  __typename?: 'IntegrationMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  integration?: Maybe<Integration>;
};

export type IntegrationType = Node & {
  __typename?: 'IntegrationType';
  id: Scalars['ID'];
  name: Scalars['String'];
  title: Scalars['String'];
  status: Scalars['String'];
  automatic_order_management: Scalars['Boolean'];
  fields?: Maybe<Array<FormField>>;
  config_fields?: Maybe<Array<FormField>>;
  credential_type?: Maybe<CredentialType>;
};

export type IntegrationTypeFilter = {
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  form_id?: Maybe<Scalars['ID']>;
  config_form_id?: Maybe<Scalars['ID']>;
};


export type LineItem = {
  __typename?: 'LineItem';
  id: Scalars['ID'];
  amount_subtotal: Scalars['Int'];
  amount_total: Scalars['Int'];
  currency: Scalars['String'];
  description: Scalars['String'];
  price?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
};

export type LogInResult = MutationResult & {
  __typename?: 'LogInResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['String']>;
};

export type Markdown = Node & {
  __typename?: 'Markdown';
  id: Scalars['ID'];
  name: Scalars['String'];
  data: Scalars['String'];
  agency?: Maybe<Agency>;
  access: AccessLevel;
};

export type MarkdownFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
};

export type MarkdownMutationResult = MutationResult & {
  __typename?: 'MarkdownMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  markdown?: Maybe<Markdown>;
};

export type Membership = Node & {
  __typename?: 'Membership';
  id: Scalars['ID'];
  name: Scalars['String'];
  access: AccessLevel;
  user: User;
  subdomain: Subdomain;
};

export type MembershipFilter = {
  access?: Maybe<AccessLevel>;
  user_id?: Maybe<Scalars['ID']>;
  subdomain_id?: Maybe<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  create_credential: CredentialMutationResult;
  update_credential: CredentialMutationResult;
  update_page: PageMutationResult;
  create_page_block: PageBlockMutationResult;
  update_page_block: PageBlockMutationResult;
  delete_page_block: PageBlockMutationResult;
  begin_visit: BeginVisitResult;
  end_visit: SimpleResult;
  log_in: LogInResult;
  log_out: SimpleResult;
  start_sign_up: SimpleResult;
  verify_sign_up: SimpleResult;
  start_password_reset: SimpleResult;
  verify_password_reset: SimpleResult;
  create_customer: CustomerMutationResult;
  update_customer: CustomerMutationResult;
  delete_customer: CustomerMutationResult;
  create_agency: CreateAgencyResult;
  update_agency: AgencyMutationResult;
  delete_agency: AgencyMutationResult;
  create_agency_thank_you_page_setting: AgencyThankYouPageSettingMutationResult;
  update_agency_thank_you_page_setting: AgencyThankYouPageSettingMutationResult;
  delete_agency_thank_you_page_setting: AgencyThankYouPageSettingMutationResult;
  create_price: PriceMutationResult;
  update_price: PriceMutationResult;
  delete_price: PriceMutationResult;
  create_stripe_checkout_session: CreateStripeCheckoutSessionResult;
  create_product_thank_you_page_setting: ProductThankYouPageSettingMutationResult;
  update_product_thank_you_page_setting: ProductThankYouPageSettingMutationResult;
  delete_product_thank_you_page_setting: ProductThankYouPageSettingMutationResult;
  create_product: ProductMutationResult;
  update_product: ProductMutationResult;
  delete_product: ProductMutationResult;
  create_image: ImageMutationResult;
  update_image: ImageMutationResult;
  create_markdown: MarkdownMutationResult;
  update_markdown: MarkdownMutationResult;
  update_theme: UpdateThemeResult;
  update_order: OrderMutationResult;
  update_order_item: OrderItemMutationResult;
  create_integration: IntegrationMutationResult;
  update_integration: IntegrationMutationResult;
  create_integration_config: IntegrationConfigMutationResult;
  update_integration_config: IntegrationConfigMutationResult;
};


export type MutationCreate_CredentialArgs = {
  agency_id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['Json'];
  credential_type_id: Scalars['ID'];
};


export type MutationUpdate_CredentialArgs = {
  credential_id: Scalars['ID'];
  data: Scalars['Json'];
};


export type MutationUpdate_PageArgs = {
  page_id: Scalars['ID'];
  access?: Maybe<AccessLevel>;
};


export type MutationCreate_Page_BlockArgs = {
  page_id: Scalars['ID'];
  page_block_definition_id: Scalars['ID'];
  data: Scalars['Json'];
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type MutationUpdate_Page_BlockArgs = {
  page_block_id: Scalars['ID'];
  data?: Maybe<Scalars['Json']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type MutationDelete_Page_BlockArgs = {
  page_block_id: Scalars['ID'];
};


export type MutationLog_InArgs = {
  email_address: Scalars['String'];
  password: Scalars['String'];
  recaptcha_token?: Maybe<Scalars['String']>;
};


export type MutationStart_Sign_UpArgs = {
  email_address: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  redirect_url?: Maybe<Scalars['String']>;
  recaptcha_token?: Maybe<Scalars['String']>;
};


export type MutationVerify_Sign_UpArgs = {
  verification_code: Scalars['String'];
};


export type MutationStart_Password_ResetArgs = {
  email_address: Scalars['String'];
  redirect_url?: Maybe<Scalars['String']>;
};


export type MutationVerify_Password_ResetArgs = {
  verification_code: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreate_CustomerArgs = {
  stripe_account_id: Scalars['ID'];
  email_address: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};


export type MutationUpdate_CustomerArgs = {
  customer_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  email_address?: Maybe<Scalars['String']>;
};


export type MutationDelete_CustomerArgs = {
  customer_id: Scalars['ID'];
};


export type MutationCreate_AgencyArgs = {
  name: Scalars['String'];
  livemode: Scalars['Boolean'];
  subdomain_name: Scalars['String'];
  country_code: Scalars['String'];
  image_logo: ImageInput;
  return_url: Scalars['String'];
  default_currency?: Maybe<Scalars['String']>;
  default_pricing_currency?: Maybe<Scalars['String']>;
};


export type MutationUpdate_AgencyArgs = {
  agency_id: Scalars['ID'];
  default_currency?: Maybe<Scalars['String']>;
  default_pricing_currency?: Maybe<Scalars['String']>;
};


export type MutationDelete_AgencyArgs = {
  agency_id: Scalars['ID'];
};


export type MutationCreate_Agency_Thank_You_Page_SettingArgs = {
  agency_id: Scalars['ID'];
  url: Scalars['String'];
};


export type MutationUpdate_Agency_Thank_You_Page_SettingArgs = {
  setting_id: Scalars['ID'];
  url: Scalars['String'];
};


export type MutationDelete_Agency_Thank_You_Page_SettingArgs = {
  setting_id: Scalars['ID'];
};


export type MutationCreate_PriceArgs = {
  product_id: Scalars['ID'];
  unit_amount: Scalars['Int'];
  currency: Scalars['String'];
  recurring_interval?: Maybe<Scalars['String']>;
  recurring_interval_count?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
};


export type MutationUpdate_PriceArgs = {
  price_id: Scalars['ID'];
  status: Scalars['String'];
};


export type MutationDelete_PriceArgs = {
  price_id: Scalars['ID'];
};


export type MutationCreate_Stripe_Checkout_SessionArgs = {
  price_id: Scalars['ID'];
  livemode: Scalars['Boolean'];
  success_url?: Maybe<Scalars['String']>;
  cancel_url?: Maybe<Scalars['String']>;
};


export type MutationCreate_Product_Thank_You_Page_SettingArgs = {
  product_id: Scalars['ID'];
  url: Scalars['String'];
};


export type MutationUpdate_Product_Thank_You_Page_SettingArgs = {
  setting_id: Scalars['ID'];
  url: Scalars['String'];
};


export type MutationDelete_Product_Thank_You_Page_SettingArgs = {
  setting_id: Scalars['ID'];
};


export type MutationCreate_ProductArgs = {
  agency_id: Scalars['ID'];
  name: Scalars['String'];
  url_name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  markdown_description_id?: Maybe<Scalars['ID']>;
  image_logo?: Maybe<ImageInput>;
  image_logo_id?: Maybe<Scalars['ID']>;
  image_hero?: Maybe<ImageInput>;
  status?: Maybe<Scalars['String']>;
};


export type MutationUpdate_ProductArgs = {
  product_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  url_name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  default_price_id?: Maybe<Scalars['ID']>;
  markdown_description_id?: Maybe<Scalars['ID']>;
  image_logo?: Maybe<ImageInput>;
  image_logo_id?: Maybe<Scalars['ID']>;
  image_hero?: Maybe<ImageInput>;
  status?: Maybe<Scalars['String']>;
};


export type MutationDelete_ProductArgs = {
  product_id: Scalars['ID'];
};


export type MutationCreate_ImageArgs = {
  agency_id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['String'];
  color: Scalars['String'];
  access?: Maybe<AccessLevel>;
};


export type MutationUpdate_ImageArgs = {
  image_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  access?: Maybe<AccessLevel>;
};


export type MutationCreate_MarkdownArgs = {
  agency_id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['String'];
  access?: Maybe<AccessLevel>;
};


export type MutationUpdate_MarkdownArgs = {
  markdown_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
  access?: Maybe<AccessLevel>;
};


export type MutationUpdate_ThemeArgs = {
  theme_id: Scalars['ID'];
  image_logo_id?: Maybe<Scalars['ID']>;
  image_hero_id?: Maybe<Scalars['ID']>;
  color_primary?: Maybe<Scalars['String']>;
  color_secondary?: Maybe<Scalars['String']>;
  color_accent?: Maybe<Scalars['String']>;
  color_background?: Maybe<Scalars['String']>;
  color_surface?: Maybe<Scalars['String']>;
  color_error?: Maybe<Scalars['String']>;
  color_success?: Maybe<Scalars['String']>;
};


export type MutationUpdate_OrderArgs = {
  order_id: Scalars['ID'];
  state?: Maybe<Scalars['String']>;
  processed_at?: Maybe<Scalars['DateTime']>;
};


export type MutationUpdate_Order_ItemArgs = {
  order_item_id: Scalars['ID'];
  state?: Maybe<Scalars['String']>;
  processed_at?: Maybe<Scalars['DateTime']>;
};


export type MutationCreate_IntegrationArgs = {
  agency_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  product_id?: Maybe<Scalars['ID']>;
  integration_type_id: Scalars['ID'];
  integration_config_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
};


export type MutationUpdate_IntegrationArgs = {
  integration_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  data?: Maybe<Scalars['Json']>;
};


export type MutationCreate_Integration_ConfigArgs = {
  agency_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  integration_type_id: Scalars['ID'];
  name: Scalars['String'];
  data: Scalars['Json'];
};


export type MutationUpdate_Integration_ConfigArgs = {
  integration_config_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['Json']>;
};

export type MutationResult = {
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type Node = {
  id: Scalars['ID'];
};

export type Order = {
  __typename?: 'Order';
  id: Scalars['ID'];
  customer: Customer;
  items: Array<OrderItem>;
  stripe_account: StripeAccount;
  stripe_checkout_session: StripeCheckoutSession;
  state: Scalars['String'];
  error?: Maybe<Scalars['String']>;
  ordered_at: Scalars['DateTime'];
  processed_at?: Maybe<Scalars['DateTime']>;
};


export type OrderCustomerArgs = {
  token?: Maybe<Scalars['String']>;
};


export type OrderItemsArgs = {
  filter?: Maybe<OrderItemFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};

export type OrderFilter = {
  customer_id?: Maybe<Scalars['ID']>;
  stripe_account_id?: Maybe<Scalars['ID']>;
  stripe_checkout_session_id_ext?: Maybe<Scalars['ID']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  id: Scalars['ID'];
  order: Order;
  price: Price;
  state: Scalars['String'];
  stripe_line_item_id_ext: Scalars['String'];
  error?: Maybe<Scalars['String']>;
  processed_at?: Maybe<Scalars['DateTime']>;
};


export type OrderItemOrderArgs = {
  token?: Maybe<Scalars['String']>;
};

export type OrderItemFilter = {
  order_id?: Maybe<Scalars['ID']>;
  stripe_line_item_id_ext?: Maybe<Scalars['ID']>;
};

export type OrderItemMutationResult = MutationResult & {
  __typename?: 'OrderItemMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  order_item?: Maybe<OrderItem>;
};

export type OrderMutationResult = MutationResult & {
  __typename?: 'OrderMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  order?: Maybe<Order>;
};

export type Outcome = {
  __typename?: 'Outcome';
  network_status?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  risk_level?: Maybe<Scalars['String']>;
  risk_score?: Maybe<Scalars['Int']>;
  rule?: Maybe<OutcomeRule>;
  seller_message?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type OutcomeRule = {
  __typename?: 'OutcomeRule';
  action?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  predicate?: Maybe<Scalars['String']>;
};

export type Page = {
  __typename?: 'Page';
  id: Scalars['ID'];
  url_path: Scalars['String'];
  agency: Agency;
  product?: Maybe<Product>;
  definition: PageDefinition;
  access: AccessLevel;
  blocks: Array<PageBlock>;
};

export type PageBlock = {
  __typename?: 'PageBlock';
  id: Scalars['ID'];
  page: Page;
  definition: PageBlockDefinition;
  data: Scalars['Json'];
};

export type PageBlockDefinition = Node & {
  __typename?: 'PageBlockDefinition';
  id: Scalars['ID'];
  name: Scalars['String'];
  page: PageDefinition;
  fields: Array<FormField>;
};

export type PageBlockDefinitionFilter = {
  name?: Maybe<Scalars['String']>;
  page_definition_id?: Maybe<Scalars['ID']>;
};

export type PageBlockFilter = {
  page_id?: Maybe<Scalars['ID']>;
  page_block_definition_id?: Maybe<Scalars['ID']>;
};

export type PageBlockMutationResult = MutationResult & {
  __typename?: 'PageBlockMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  page_block?: Maybe<PageBlock>;
};

export type PageDefinition = Node & {
  __typename?: 'PageDefinition';
  id: Scalars['ID'];
  name: Scalars['String'];
  url_path: Scalars['String'];
  blocks: Array<PageBlockDefinition>;
};

export type PageDefinitionFilter = {
  name?: Maybe<Scalars['String']>;
  url_path?: Maybe<Scalars['String']>;
};

export type PageFilter = {
  url_path?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
  product_id?: Maybe<Scalars['ID']>;
  page_definition_id?: Maybe<Scalars['ID']>;
};

export type PageMutationResult = MutationResult & {
  __typename?: 'PageMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  page?: Maybe<Page>;
};

export type PaymentIntent = {
  __typename?: 'PaymentIntent';
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  amount: Scalars['Int'];
  amount_capturable?: Maybe<Scalars['Int']>;
  amount_received?: Maybe<Scalars['Int']>;
  application_fee_amount?: Maybe<Scalars['Int']>;
  canceled_at?: Maybe<Scalars['DateTime']>;
  cancellation_reason?: Maybe<Scalars['String']>;
  capture_method?: Maybe<Scalars['String']>;
  charges?: Maybe<Array<Maybe<Charge>>>;
  confirmation_method?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['DateTime']>;
  currency?: Maybe<Scalars['String']>;
  customer?: Maybe<StripeCustomer>;
  description?: Maybe<Scalars['String']>;
  invoice?: Maybe<Scalars['String']>;
  on_behalf_of?: Maybe<Scalars['String']>;
  payment_method?: Maybe<Scalars['String']>;
  payment_method_types?: Maybe<Array<Maybe<Scalars['String']>>>;
  receipt_email?: Maybe<Scalars['String']>;
  setup_future_usage?: Maybe<Scalars['String']>;
  shipping?: Maybe<Shipping>;
  statement_descriptor?: Maybe<Scalars['String']>;
  statement_descriptor_suffix?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  transfer_group?: Maybe<Scalars['String']>;
};

export type Price = Node & {
  __typename?: 'Price';
  id: Scalars['ID'];
  name: Scalars['String'];
  status: Scalars['String'];
  active: Scalars['Boolean'];
  type: Scalars['String'];
  unit_amount: Scalars['Int'];
  currency: Scalars['String'];
  recurring_interval?: Maybe<Scalars['String']>;
  recurring_interval_count?: Maybe<Scalars['Int']>;
  product: Product;
};

export type PriceFilter = {
  product_id?: Maybe<Scalars['ID']>;
  stripe_price_id_ext_live?: Maybe<Scalars['String']>;
  stripe_price_id_ext_test?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type PriceMutationResult = MutationResult & {
  __typename?: 'PriceMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  price?: Maybe<Price>;
};

export type Product = Node & {
  __typename?: 'Product';
  id: Scalars['ID'];
  name: Scalars['String'];
  url_name: Scalars['String'];
  status: Scalars['String'];
  active: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  default_price?: Maybe<Price>;
  agency: Agency;
  prices?: Maybe<Array<Price>>;
  image_logo?: Maybe<Image>;
  image_hero?: Maybe<Image>;
  markdown_description?: Maybe<Markdown>;
  integrations?: Maybe<Array<Integration>>;
  pages?: Maybe<Array<Page>>;
  settings: ProductSettings;
};


export type ProductPricesArgs = {
  filter?: Maybe<PriceFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type ProductPagesArgs = {
  filter?: Maybe<PageFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};

export type ProductFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
  url_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type ProductMutationResult = MutationResult & {
  __typename?: 'ProductMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
};

export type ProductSettings = {
  __typename?: 'ProductSettings';
  id: Scalars['ID'];
  thank_you_page_setting?: Maybe<ProductThankYouPageSetting>;
};

export type ProductThankYouPageSetting = {
  __typename?: 'ProductThankYouPageSetting';
  id: Scalars['ID'];
  url: Scalars['String'];
};

export type ProductThankYouPageSettingMutationResult = MutationResult & {
  __typename?: 'ProductThankYouPageSettingMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  setting?: Maybe<ProductThankYouPageSetting>;
};

export type Query = {
  __typename?: 'Query';
  credential?: Maybe<Credential>;
  credentials?: Maybe<Array<Credential>>;
  count_credentials: Scalars['Int'];
  credential_type?: Maybe<CredentialType>;
  credential_types?: Maybe<Array<CredentialType>>;
  count_credential_types: Scalars['Int'];
  form_field?: Maybe<FormField>;
  form_fields?: Maybe<Array<FormField>>;
  count_form_fields: Scalars['Int'];
  page?: Maybe<Page>;
  page_by_url?: Maybe<Page>;
  pages?: Maybe<Array<Page>>;
  count_pages: Scalars['Int'];
  page_block?: Maybe<PageBlock>;
  page_blocks?: Maybe<Array<PageBlock>>;
  count_page_blocks: Scalars['Int'];
  page_definition?: Maybe<PageDefinition>;
  page_definition_by_url_path?: Maybe<PageDefinition>;
  page_definitions?: Maybe<Array<PageDefinition>>;
  count_page_definitions: Scalars['Int'];
  page_block_definition?: Maybe<PageBlockDefinition>;
  page_block_definitions?: Maybe<Array<PageBlockDefinition>>;
  count_page_block_definitions: Scalars['Int'];
  country_codes: Array<Scalars['String']>;
  country_spec?: Maybe<CountrySpec>;
  exchange_rate?: Maybe<ExchangeRate>;
  current_user?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  count_users: Scalars['Int'];
  customer?: Maybe<Customer>;
  customers?: Maybe<Array<Customer>>;
  count_customers: Scalars['Int'];
  agency?: Maybe<Agency>;
  agencies?: Maybe<Array<Agency>>;
  count_agencies: Scalars['Int'];
  price?: Maybe<Price>;
  prices?: Maybe<Array<Price>>;
  count_prices: Scalars['Int'];
  stripe_account?: Maybe<StripeAccount>;
  product?: Maybe<Product>;
  products?: Maybe<Array<Product>>;
  count_products: Scalars['Int'];
  subdomain?: Maybe<Subdomain>;
  subdomains?: Maybe<Array<Subdomain>>;
  count_subdomains: Scalars['Int'];
  subscription_plan?: Maybe<SubscriptionPlan>;
  subscription_plans?: Maybe<Array<SubscriptionPlan>>;
  count_subscription_plans: Scalars['Int'];
  transaction_fee?: Maybe<TransactionFee>;
  transaction_fees?: Maybe<Array<TransactionFee>>;
  count_transaction_fees: Scalars['Int'];
  image?: Maybe<Image>;
  images?: Maybe<Array<Image>>;
  count_images: Scalars['Int'];
  markdown?: Maybe<Markdown>;
  markdowns?: Maybe<Array<Markdown>>;
  count_markdowns: Scalars['Int'];
  membership?: Maybe<Membership>;
  memberships?: Maybe<Array<Membership>>;
  count_memberships: Scalars['Int'];
  theme?: Maybe<Theme>;
  themes?: Maybe<Array<Theme>>;
  count_themes: Scalars['Int'];
  order?: Maybe<Order>;
  orders?: Maybe<Array<Order>>;
  count_orders: Scalars['Int'];
  order_item?: Maybe<OrderItem>;
  order_items?: Maybe<Array<OrderItem>>;
  count_order_items: Scalars['Int'];
  integration?: Maybe<Integration>;
  integrations?: Maybe<Array<Integration>>;
  count_integrations: Scalars['Int'];
  integration_config?: Maybe<IntegrationConfig>;
  integration_configs?: Maybe<Array<IntegrationConfig>>;
  count_integration_configs: Scalars['Int'];
  integration_type?: Maybe<IntegrationType>;
  integration_types?: Maybe<Array<IntegrationType>>;
  count_integration_types: Scalars['Int'];
};


export type QueryCredentialArgs = {
  id: Scalars['ID'];
};


export type QueryCredentialsArgs = {
  filter: CredentialFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_CredentialsArgs = {
  filter: CredentialFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCredential_TypeArgs = {
  id: Scalars['ID'];
};


export type QueryCredential_TypesArgs = {
  filter: CredentialTypeFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Credential_TypesArgs = {
  filter: CredentialTypeFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryForm_FieldArgs = {
  id: Scalars['ID'];
};


export type QueryForm_FieldsArgs = {
  filter: FormFieldFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Form_FieldsArgs = {
  filter: FormFieldFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryPageArgs = {
  id: Scalars['ID'];
};


export type QueryPage_By_UrlArgs = {
  url: Scalars['String'];
};


export type QueryPagesArgs = {
  filter: PageFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_PagesArgs = {
  filter: PageFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryPage_BlockArgs = {
  id: Scalars['ID'];
};


export type QueryPage_BlocksArgs = {
  filter: PageBlockFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Page_BlocksArgs = {
  filter: PageBlockFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryPage_DefinitionArgs = {
  id: Scalars['ID'];
};


export type QueryPage_Definition_By_Url_PathArgs = {
  url_path: Scalars['String'];
};


export type QueryPage_DefinitionsArgs = {
  filter: PageDefinitionFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Page_DefinitionsArgs = {
  filter: PageDefinitionFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryPage_Block_DefinitionArgs = {
  id: Scalars['ID'];
};


export type QueryPage_Block_DefinitionsArgs = {
  filter: PageBlockDefinitionFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Page_Block_DefinitionsArgs = {
  filter: PageBlockDefinitionFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCountry_SpecArgs = {
  country_code: Scalars['ID'];
};


export type QueryExchange_RateArgs = {
  currency: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  filter: UserFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_UsersArgs = {
  filter: UserFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCustomerArgs = {
  id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
};


export type QueryCustomersArgs = {
  filter: CustomerFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_CustomersArgs = {
  filter: CustomerFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryAgencyArgs = {
  id: Scalars['ID'];
};


export type QueryAgenciesArgs = {
  filter: AgencyFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_AgenciesArgs = {
  filter: AgencyFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryPriceArgs = {
  id: Scalars['ID'];
};


export type QueryPricesArgs = {
  filter: PriceFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_PricesArgs = {
  filter: PriceFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryStripe_AccountArgs = {
  id: Scalars['ID'];
};


export type QueryProductArgs = {
  id: Scalars['ID'];
};


export type QueryProductsArgs = {
  filter: ProductFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_ProductsArgs = {
  filter: ProductFilter;
  token?: Maybe<Scalars['String']>;
};


export type QuerySubdomainArgs = {
  id: Scalars['ID'];
};


export type QuerySubdomainsArgs = {
  filter: SubdomainFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_SubdomainsArgs = {
  filter: SubdomainFilter;
  token?: Maybe<Scalars['String']>;
};


export type QuerySubscription_PlanArgs = {
  id: Scalars['ID'];
};


export type QuerySubscription_PlansArgs = {
  filter: SubscriptionPlanFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Subscription_PlansArgs = {
  filter: SubscriptionPlanFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryTransaction_FeeArgs = {
  id: Scalars['ID'];
};


export type QueryTransaction_FeesArgs = {
  filter: TransactionFeeFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Transaction_FeesArgs = {
  filter: TransactionFeeFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryImageArgs = {
  id: Scalars['ID'];
};


export type QueryImagesArgs = {
  filter: ImageFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_ImagesArgs = {
  filter: ImageFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryMarkdownArgs = {
  id: Scalars['ID'];
};


export type QueryMarkdownsArgs = {
  filter: MarkdownFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_MarkdownsArgs = {
  filter: MarkdownFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryMembershipArgs = {
  id: Scalars['ID'];
};


export type QueryMembershipsArgs = {
  filter: MembershipFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_MembershipsArgs = {
  filter: MembershipFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryThemeArgs = {
  id: Scalars['ID'];
};


export type QueryThemesArgs = {
  filter: ThemeFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_ThemesArgs = {
  filter: ThemeFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
};


export type QueryOrdersArgs = {
  filter: OrderFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_OrdersArgs = {
  filter: OrderFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryOrder_ItemArgs = {
  id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
};


export type QueryOrder_ItemsArgs = {
  filter: OrderItemFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Order_ItemsArgs = {
  filter: OrderItemFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryIntegrationArgs = {
  id: Scalars['ID'];
};


export type QueryIntegrationsArgs = {
  filter: IntegrationFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_IntegrationsArgs = {
  filter: IntegrationFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryIntegration_ConfigArgs = {
  id: Scalars['ID'];
};


export type QueryIntegration_ConfigsArgs = {
  filter: IntegrationConfigFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Integration_ConfigsArgs = {
  filter: IntegrationConfigFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryIntegration_TypeArgs = {
  id: Scalars['ID'];
};


export type QueryIntegration_TypesArgs = {
  filter: IntegrationTypeFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type QueryCount_Integration_TypesArgs = {
  filter: IntegrationTypeFilter;
  token?: Maybe<Scalars['String']>;
};

export type Shipping = {
  __typename?: 'Shipping';
  address?: Maybe<Address>;
  carrier?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
};

export type SimpleResult = MutationResult & {
  __typename?: 'SimpleResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type StripeAccount = {
  __typename?: 'StripeAccount';
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  livemode: Scalars['Boolean'];
  account_update_url: StripeAccountLink;
  balance: StripeBalance;
  balance_transactions: Array<BalanceTransaction>;
  payment_intents: Array<PaymentIntent>;
  customers: Array<Customer>;
  business_profile: BusinessProfile;
  business_type?: Maybe<Scalars['String']>;
  capabilities: StripeCapabilities;
  requirements: StripeRequirements;
  settings: StripeSettings;
  charges_enabled: Scalars['Boolean'];
  country: Scalars['String'];
  created: Scalars['DateTime'];
  default_currency?: Maybe<Scalars['String']>;
  details_submitted: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  payouts_enabled: Scalars['Boolean'];
};


export type StripeAccountBalance_TransactionsArgs = {
  payout_id?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
  available_on?: Maybe<Scalars['DateTime']>;
  created?: Maybe<Scalars['DateTime']>;
  currency?: Maybe<Scalars['String']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type StripeAccountPayment_IntentsArgs = {
  customer_id?: Maybe<Scalars['ID']>;
  created?: Maybe<Scalars['DateTime']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type StripeAccountCustomersArgs = {
  filter?: Maybe<CustomerFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};

export type StripeAccountLink = {
  __typename?: 'StripeAccountLink';
  type: Scalars['String'];
  url: Scalars['String'];
  created: Scalars['DateTime'];
  expires_at: Scalars['DateTime'];
};

export type StripeBalance = {
  __typename?: 'StripeBalance';
  available: Array<StripeCurrencyBalance>;
  pending: Array<StripeCurrencyBalance>;
  connect_reserved?: Maybe<Array<StripeCurrencyBalance>>;
  instant_available?: Maybe<Array<StripeCurrencyBalance>>;
};

export type StripeBalanceSource = {
  __typename?: 'StripeBalanceSource';
  bank_account?: Maybe<Scalars['Int']>;
  card?: Maybe<Scalars['Int']>;
};

export type StripeBranding = {
  __typename?: 'StripeBranding';
  icon?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  primary_color?: Maybe<Scalars['String']>;
  secondary_color?: Maybe<Scalars['String']>;
};

export type StripeCapabilities = {
  __typename?: 'StripeCapabilities';
  card_payments?: Maybe<Scalars['String']>;
  transfers?: Maybe<Scalars['String']>;
};

export type StripeCheckoutSession = {
  __typename?: 'StripeCheckoutSession';
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  allow_promotion_codes?: Maybe<Scalars['Boolean']>;
  amount_subtotal?: Maybe<Scalars['Int']>;
  amount_total?: Maybe<Scalars['Int']>;
  billing_address_collection?: Maybe<Scalars['String']>;
  cancel_url?: Maybe<Scalars['String']>;
  client_reference_id?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  customer?: Maybe<StripeCustomer>;
  customer_email?: Maybe<Scalars['String']>;
  line_items: Array<LineItem>;
  livemode?: Maybe<Scalars['Boolean']>;
  locale?: Maybe<Scalars['String']>;
  mode?: Maybe<Scalars['String']>;
  payment_method_types?: Maybe<Array<Maybe<Scalars['String']>>>;
  payment_status?: Maybe<Scalars['String']>;
  submit_type?: Maybe<Scalars['String']>;
  success_url?: Maybe<Scalars['String']>;
};


export type StripeCheckoutSessionLine_ItemsArgs = {
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};

export type StripeCurrencyBalance = {
  __typename?: 'StripeCurrencyBalance';
  amount: Scalars['Int'];
  currency: Scalars['String'];
  source_types: StripeBalanceSource;
};

export type StripeCustomer = {
  __typename?: 'StripeCustomer';
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  address?: Maybe<Address>;
  balance?: Maybe<Scalars['Int']>;
  created?: Maybe<Scalars['DateTime']>;
  currency?: Maybe<Scalars['String']>;
  delinquent?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  invoice_prefix?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  next_invoice_sequence?: Maybe<Scalars['Int']>;
  phone?: Maybe<Scalars['String']>;
  preferred_locales?: Maybe<Array<Maybe<Scalars['String']>>>;
  customer?: Maybe<Customer>;
};

export type StripeRequirements = {
  __typename?: 'StripeRequirements';
  current_deadline?: Maybe<Scalars['String']>;
  disabled_reason?: Maybe<Scalars['String']>;
  currently_due: Array<Maybe<Scalars['String']>>;
  eventually_due: Array<Maybe<Scalars['String']>>;
  past_due: Array<Maybe<Scalars['String']>>;
  pending_verification: Array<Maybe<Scalars['String']>>;
};

export type StripeSettings = {
  __typename?: 'StripeSettings';
  branding?: Maybe<StripeBranding>;
};

export type Subdomain = Node & {
  __typename?: 'Subdomain';
  id: Scalars['ID'];
  name: Scalars['String'];
  agency: Agency;
  memberships: Array<Membership>;
};


export type SubdomainMembershipsArgs = {
  filter?: Maybe<MembershipFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};

export type SubdomainFilter = {
  name?: Maybe<Scalars['String']>;
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  id: Scalars['ID'];
  name: Scalars['String'];
  transaction_fees: Array<TransactionFee>;
  calculate_fee: Scalars['Int'];
};


export type SubscriptionPlanCalculate_FeeArgs = {
  amount: Scalars['Int'];
  currency: Scalars['String'];
};

export type SubscriptionPlanFilter = {
  name?: Maybe<Scalars['String']>;
};

export type Theme = Node & {
  __typename?: 'Theme';
  id: Scalars['ID'];
  agency: Agency;
  name: Scalars['String'];
  image_logo?: Maybe<Image>;
  image_hero?: Maybe<Image>;
  color_primary?: Maybe<Scalars['String']>;
  color_secondary?: Maybe<Scalars['String']>;
  color_accent?: Maybe<Scalars['String']>;
  color_background?: Maybe<Scalars['String']>;
  color_surface?: Maybe<Scalars['String']>;
  color_error?: Maybe<Scalars['String']>;
  color_success?: Maybe<Scalars['String']>;
};

export type ThemeFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['String']>;
};

export type TransactionFee = {
  __typename?: 'TransactionFee';
  id: Scalars['ID'];
  subscription_plan: SubscriptionPlan;
  percentage: Scalars['Float'];
  fixed_amount: Scalars['Int'];
  currency: Scalars['String'];
  transaction_amount_upper_bound: Scalars['Int'];
  data: Scalars['Json'];
};

export type TransactionFeeFilter = {
  subscription_plan_id?: Maybe<Scalars['ID']>;
};

export type UpdateThemeResult = MutationResult & {
  __typename?: 'UpdateThemeResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  theme?: Maybe<Theme>;
};

export type User = Node & {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email_address: Scalars['String'];
  memberships: Array<Membership>;
};


export type UserMembershipsArgs = {
  filter?: Maybe<MembershipFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
};

export type UserFilter = {
  name?: Maybe<Scalars['String']>;
  email_address?: Maybe<Scalars['String']>;
};

export type Stripe_AccountFragment = (
  { __typename?: 'StripeAccount' }
  & Pick<StripeAccount, 'id' | 'id_ext' | 'business_type' | 'charges_enabled' | 'country' | 'created' | 'default_currency' | 'details_submitted' | 'email' | 'payouts_enabled'>
  & { business_profile: (
    { __typename?: 'BusinessProfile' }
    & Pick<BusinessProfile, 'mcc' | 'name' | 'product_description' | 'support_address' | 'support_email' | 'support_phone' | 'support_url' | 'url'>
  ), capabilities: (
    { __typename?: 'StripeCapabilities' }
    & Pick<StripeCapabilities, 'card_payments' | 'transfers'>
  ), requirements: (
    { __typename?: 'StripeRequirements' }
    & Pick<StripeRequirements, 'current_deadline' | 'disabled_reason' | 'currently_due' | 'eventually_due' | 'past_due' | 'pending_verification'>
  ), settings: (
    { __typename?: 'StripeSettings' }
    & { branding?: Maybe<(
      { __typename?: 'StripeBranding' }
      & Pick<StripeBranding, 'icon' | 'logo' | 'primary_color' | 'secondary_color'>
    )> }
  ) }
);

export type AddressFragment = (
  { __typename?: 'Address' }
  & Pick<Address, 'city' | 'country' | 'line1' | 'line2' | 'postal_code' | 'state'>
);

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name' | 'email_address'>
);

export type MarkdownFragment = (
  { __typename?: 'Markdown' }
  & Pick<Markdown, 'id' | 'name' | 'data'>
);

export type ImageFragment = (
  { __typename?: 'Image' }
  & Pick<Image, 'id' | 'name' | 'color' | 'data' | 'access'>
);

export type ThemeFragment = (
  { __typename?: 'Theme' }
  & Pick<Theme, 'id' | 'color_primary' | 'color_secondary' | 'color_accent' | 'color_background' | 'color_surface' | 'color_error' | 'color_success'>
  & { image_logo?: Maybe<(
    { __typename?: 'Image' }
    & ImageFragment
  )>, image_hero?: Maybe<(
    { __typename?: 'Image' }
    & ImageFragment
  )> }
);

export type PriceFragment = (
  { __typename?: 'Price' }
  & Pick<Price, 'id' | 'name' | 'unit_amount' | 'currency' | 'status' | 'active' | 'type' | 'recurring_interval' | 'recurring_interval_count'>
);

export type Balance_TransactionFragment = (
  { __typename?: 'BalanceTransaction' }
  & Pick<BalanceTransaction, 'id' | 'id_ext' | 'amount' | 'available_on' | 'created' | 'exchange_rate' | 'currency' | 'description' | 'fee' | 'net' | 'status' | 'reporting_category' | 'type' | 'source'>
  & { fee_details?: Maybe<Array<(
    { __typename?: 'BalanceTransactionFeeDetails' }
    & Pick<BalanceTransactionFeeDetails, 'amount' | 'application' | 'currency' | 'description' | 'type'>
  )>> }
);

export type Stripe_CustomerFragment = (
  { __typename?: 'StripeCustomer' }
  & Pick<StripeCustomer, 'id' | 'id_ext' | 'balance' | 'created' | 'currency' | 'delinquent' | 'description' | 'email' | 'invoice_prefix' | 'name' | 'next_invoice_sequence' | 'phone' | 'preferred_locales'>
  & { address?: Maybe<(
    { __typename?: 'Address' }
    & AddressFragment
  )>, customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
  )> }
);

export type ChargeFragment = (
  { __typename?: 'Charge' }
  & Pick<Charge, 'id' | 'id_ext' | 'amount' | 'amount_capturable' | 'amount_received' | 'application_fee_amount' | 'authorization_code' | 'calculated_statement_descriptor' | 'captured' | 'created' | 'currency' | 'description' | 'disputed' | 'failure_code' | 'failure_message' | 'invoice' | 'order' | 'paid' | 'payment_method' | 'receipt_email' | 'receipt_number' | 'receipt_url' | 'refunded' | 'source_transfer' | 'statement_descriptor' | 'statement_descriptor_suffix' | 'status' | 'transfer' | 'transfer_group'>
  & { balance_transaction?: Maybe<(
    { __typename?: 'BalanceTransaction' }
    & Balance_TransactionFragment
  )>, billing_details?: Maybe<(
    { __typename?: 'BillingDetails' }
    & Pick<BillingDetails, 'email' | 'name' | 'phone'>
    & { address?: Maybe<(
      { __typename?: 'Address' }
      & AddressFragment
    )> }
  )>, customer?: Maybe<(
    { __typename?: 'StripeCustomer' }
    & Pick<StripeCustomer, 'id'>
  )>, fraud_details?: Maybe<(
    { __typename?: 'FraudDetails' }
    & Pick<FraudDetails, 'stripe_report' | 'user_report'>
  )>, outcome?: Maybe<(
    { __typename?: 'Outcome' }
    & Pick<Outcome, 'network_status' | 'reason' | 'risk_level' | 'risk_score' | 'seller_message' | 'type'>
    & { rule?: Maybe<(
      { __typename?: 'OutcomeRule' }
      & Pick<OutcomeRule, 'action' | 'id' | 'predicate'>
    )> }
  )>, payment_intent?: Maybe<(
    { __typename?: 'PaymentIntent' }
    & Pick<PaymentIntent, 'id'>
  )> }
);

export type Payment_IntentFragment = (
  { __typename?: 'PaymentIntent' }
  & Pick<PaymentIntent, 'id' | 'id_ext' | 'amount' | 'amount_capturable' | 'amount_received' | 'application_fee_amount' | 'canceled_at' | 'cancellation_reason' | 'capture_method' | 'confirmation_method' | 'created' | 'currency' | 'description' | 'invoice' | 'on_behalf_of' | 'payment_method' | 'payment_method_types' | 'receipt_email' | 'setup_future_usage' | 'statement_descriptor' | 'statement_descriptor_suffix' | 'status' | 'transfer_group'>
  & { charges?: Maybe<Array<Maybe<(
    { __typename?: 'Charge' }
    & ChargeFragment
  )>>>, customer?: Maybe<(
    { __typename?: 'StripeCustomer' }
    & Stripe_CustomerFragment
  )>, shipping?: Maybe<(
    { __typename?: 'Shipping' }
    & Pick<Shipping, 'carrier' | 'name' | 'phone' | 'tracking_number'>
    & { address?: Maybe<(
      { __typename?: 'Address' }
      & AddressFragment
    )> }
  )> }
);

export type ProductFragment = (
  { __typename?: 'Product' }
  & Pick<Product, 'id' | 'name' | 'url_name' | 'description' | 'duration' | 'status' | 'active'>
  & { default_price?: Maybe<(
    { __typename?: 'Price' }
    & PriceFragment
  )>, prices?: Maybe<Array<(
    { __typename?: 'Price' }
    & PriceFragment
  )>>, image_logo?: Maybe<(
    { __typename?: 'Image' }
    & Pick<Image, 'id'>
  )>, image_hero?: Maybe<(
    { __typename?: 'Image' }
    & Pick<Image, 'id'>
  )>, markdown_description?: Maybe<(
    { __typename?: 'Markdown' }
    & MarkdownFragment
  )>, agency: (
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
  ), settings: (
    { __typename?: 'ProductSettings' }
    & Pick<ProductSettings, 'id'>
  ), integrations?: Maybe<Array<(
    { __typename?: 'Integration' }
    & Pick<Integration, 'id'>
  )>> }
);

export type MembershipFragment = (
  { __typename?: 'Membership' }
  & Pick<Membership, 'id' | 'access'>
  & { user: (
    { __typename?: 'User' }
    & UserFragment
  ), subdomain: (
    { __typename?: 'Subdomain' }
    & Pick<Subdomain, 'id'>
    & { agency: (
      { __typename?: 'Agency' }
      & Pick<Agency, 'id'>
    ) }
  ) }
);

export type Transaction_FeeFragment = (
  { __typename?: 'TransactionFee' }
  & Pick<TransactionFee, 'id' | 'percentage' | 'fixed_amount' | 'currency' | 'transaction_amount_upper_bound' | 'data'>
  & { subscription_plan: (
    { __typename?: 'SubscriptionPlan' }
    & Pick<SubscriptionPlan, 'id'>
  ) }
);

export type Subscription_PlanFragment = (
  { __typename?: 'SubscriptionPlan' }
  & Pick<SubscriptionPlan, 'id' | 'name'>
  & { transaction_fees: Array<(
    { __typename?: 'TransactionFee' }
    & Transaction_FeeFragment
  )> }
);

export type AgencyFragment = (
  { __typename?: 'Agency' }
  & Pick<Agency, 'id' | 'name' | 'livemode' | 'default_pricing_currency'>
  & { subdomain: (
    { __typename?: 'Subdomain' }
    & Pick<Subdomain, 'id' | 'name'>
  ), theme: (
    { __typename?: 'Theme' }
    & ThemeFragment
  ), settings: (
    { __typename?: 'AgencySettings' }
    & Pick<AgencySettings, 'id'>
  ) }
);

export type CustomerFragment = (
  { __typename?: 'Customer' }
  & Pick<Customer, 'id' | 'name' | 'email_address'>
  & { stripe_account: (
    { __typename?: 'StripeAccount' }
    & Pick<StripeAccount, 'id'>
  ), default_stripe_customer: (
    { __typename?: 'StripeCustomer' }
    & Stripe_CustomerFragment
  ), stripe_customers: Array<(
    { __typename?: 'StripeCustomer' }
    & Stripe_CustomerFragment
  )>, user?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type SubdomainFragment = (
  { __typename?: 'Subdomain' }
  & Pick<Subdomain, 'id' | 'name'>
  & { agency: (
    { __typename?: 'Agency' }
    & AgencyFragment
  ), memberships: Array<(
    { __typename?: 'Membership' }
    & MembershipFragment
  )> }
);

export type Form_FieldFragment = (
  { __typename?: 'FormField' }
  & Pick<FormField, 'id' | 'name' | 'label' | 'type' | 'hint' | 'prefix' | 'suffix' | 'required' | 'default'>
);

export type Credential_TypeFragment = (
  { __typename?: 'CredentialType' }
  & Pick<CredentialType, 'id' | 'name'>
  & { fields?: Maybe<Array<(
    { __typename?: 'FormField' }
    & Form_FieldFragment
  )>> }
);

export type CredentialFragment = (
  { __typename?: 'Credential' }
  & Pick<Credential, 'id' | 'data'>
  & { agency: (
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
  ), credential_type: (
    { __typename?: 'CredentialType' }
    & Credential_TypeFragment
  ) }
);

export type IntegrationFragment = (
  { __typename?: 'Integration' }
  & Pick<Integration, 'id' | 'data'>
  & { agency: (
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
  ), credential?: Maybe<(
    { __typename?: 'Credential' }
    & Pick<Credential, 'id'>
  )>, product?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id'>
  )>, integration_type: (
    { __typename?: 'IntegrationType' }
    & Pick<IntegrationType, 'id'>
  ), integration_config?: Maybe<(
    { __typename?: 'IntegrationConfig' }
    & Pick<IntegrationConfig, 'id'>
  )> }
);

export type Integration_ConfigFragment = (
  { __typename?: 'IntegrationConfig' }
  & Pick<IntegrationConfig, 'id' | 'name' | 'data'>
  & { agency: (
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
  ), credential?: Maybe<(
    { __typename?: 'Credential' }
    & Pick<Credential, 'id'>
  )>, integration_type: (
    { __typename?: 'IntegrationType' }
    & Pick<IntegrationType, 'id'>
  ) }
);

export type Integration_TypeFragment = (
  { __typename?: 'IntegrationType' }
  & Pick<IntegrationType, 'id' | 'name' | 'title' | 'status' | 'automatic_order_management'>
  & { fields?: Maybe<Array<(
    { __typename?: 'FormField' }
    & Form_FieldFragment
  )>>, config_fields?: Maybe<Array<(
    { __typename?: 'FormField' }
    & Form_FieldFragment
  )>>, credential_type?: Maybe<(
    { __typename?: 'CredentialType' }
    & Credential_TypeFragment
  )> }
);

export type Page_DefinitionFragment = (
  { __typename?: 'PageDefinition' }
  & Pick<PageDefinition, 'id' | 'name' | 'url_path'>
);

export type Page_Block_DefinitionFragment = (
  { __typename?: 'PageBlockDefinition' }
  & Pick<PageBlockDefinition, 'id' | 'name'>
  & { page: (
    { __typename?: 'PageDefinition' }
    & Pick<PageDefinition, 'id'>
  ), fields: Array<(
    { __typename?: 'FormField' }
    & Form_FieldFragment
  )> }
);

export type PageFragment = (
  { __typename?: 'Page' }
  & Pick<Page, 'id' | 'url_path' | 'access'>
  & { agency: (
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
  ), product?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id'>
  )>, definition: (
    { __typename?: 'PageDefinition' }
    & Page_DefinitionFragment
  ), blocks: Array<(
    { __typename?: 'PageBlock' }
    & Page_BlockFragment
  )> }
);

export type Page_BlockFragment = (
  { __typename?: 'PageBlock' }
  & Pick<PageBlock, 'id' | 'data'>
  & { page: (
    { __typename?: 'Page' }
    & Pick<Page, 'id'>
  ), definition: (
    { __typename?: 'PageBlockDefinition' }
    & Page_Block_DefinitionFragment
  ) }
);

export type Line_ItemFragment = (
  { __typename?: 'LineItem' }
  & Pick<LineItem, 'id' | 'amount_subtotal' | 'amount_total' | 'currency' | 'description' | 'price' | 'quantity'>
);

export type Stripe_Checkout_SessionFragment = (
  { __typename?: 'StripeCheckoutSession' }
  & Pick<StripeCheckoutSession, 'id' | 'id_ext' | 'allow_promotion_codes' | 'amount_subtotal' | 'amount_total' | 'billing_address_collection' | 'cancel_url' | 'client_reference_id' | 'currency' | 'customer_email' | 'livemode' | 'locale' | 'mode' | 'payment_method_types' | 'payment_status' | 'submit_type' | 'success_url'>
  & { customer?: Maybe<(
    { __typename?: 'StripeCustomer' }
    & Pick<StripeCustomer, 'id'>
  )>, line_items: Array<(
    { __typename?: 'LineItem' }
    & Line_ItemFragment
  )> }
);

export type Order_ItemFragment = (
  { __typename?: 'OrderItem' }
  & Pick<OrderItem, 'id' | 'state' | 'stripe_line_item_id_ext' | 'error' | 'processed_at'>
  & { order: (
    { __typename?: 'Order' }
    & Pick<Order, 'id'>
  ), price: (
    { __typename?: 'Price' }
    & { product: (
      { __typename?: 'Product' }
      & ProductFragment
    ) }
    & PriceFragment
  ) }
);

export type OrderFragment = (
  { __typename?: 'Order' }
  & Pick<Order, 'id' | 'state' | 'error' | 'ordered_at' | 'processed_at'>
);

export type BeginVisitMutationVariables = Exact<{ [key: string]: never; }>;


export type BeginVisitMutation = (
  { __typename?: 'Mutation' }
  & { begin_visit: (
    { __typename?: 'BeginVisitResult' }
    & Pick<BeginVisitResult, 'success' | 'message' | 'jwt'>
  ) }
);

export type EndVisitMutationVariables = Exact<{ [key: string]: never; }>;


export type EndVisitMutation = (
  { __typename?: 'Mutation' }
  & { end_visit: (
    { __typename?: 'SimpleResult' }
    & Pick<SimpleResult, 'success' | 'message'>
  ) }
);

export type LogInMutationVariables = Exact<{
  email_address: Scalars['String'];
  password: Scalars['String'];
  recaptcha_token?: Maybe<Scalars['String']>;
}>;


export type LogInMutation = (
  { __typename?: 'Mutation' }
  & { log_in: (
    { __typename?: 'LogInResult' }
    & Pick<LogInResult, 'success' | 'message' | 'jwt'>
  ) }
);

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = (
  { __typename?: 'Mutation' }
  & { log_out: (
    { __typename?: 'SimpleResult' }
    & Pick<SimpleResult, 'success' | 'message'>
  ) }
);

export type VerifyPasswordResetMutationVariables = Exact<{
  verification_code: Scalars['String'];
  password: Scalars['String'];
}>;


export type VerifyPasswordResetMutation = (
  { __typename?: 'Mutation' }
  & { verify_password_reset: (
    { __typename?: 'SimpleResult' }
    & Pick<SimpleResult, 'success' | 'message'>
  ) }
);

export type VerifySignUpMutationVariables = Exact<{
  verification_code: Scalars['String'];
}>;


export type VerifySignUpMutation = (
  { __typename?: 'Mutation' }
  & { verify_sign_up: (
    { __typename?: 'SimpleResult' }
    & Pick<SimpleResult, 'success' | 'message'>
  ) }
);

export type StartPasswordResetMutationVariables = Exact<{
  email_address: Scalars['String'];
  redirect_url?: Maybe<Scalars['String']>;
}>;


export type StartPasswordResetMutation = (
  { __typename?: 'Mutation' }
  & { start_password_reset: (
    { __typename?: 'SimpleResult' }
    & Pick<SimpleResult, 'success' | 'message'>
  ) }
);

export type StartSignUpMutationVariables = Exact<{
  email_address: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  redirect_url?: Maybe<Scalars['String']>;
  recaptcha_token?: Maybe<Scalars['String']>;
}>;


export type StartSignUpMutation = (
  { __typename?: 'Mutation' }
  & { start_sign_up: (
    { __typename?: 'SimpleResult' }
    & Pick<SimpleResult, 'success' | 'message'>
  ) }
);

export type CreateAgencyMutationVariables = Exact<{
  name: Scalars['String'];
  livemode: Scalars['Boolean'];
  subdomain_name: Scalars['String'];
  country_code: Scalars['String'];
  image_logo: ImageInput;
  return_url: Scalars['String'];
}>;


export type CreateAgencyMutation = (
  { __typename?: 'Mutation' }
  & { create_agency: (
    { __typename?: 'CreateAgencyResult' }
    & Pick<CreateAgencyResult, 'stripe_verification_url' | 'message' | 'success'>
    & { agency?: Maybe<(
      { __typename?: 'Agency' }
      & Pick<Agency, 'id' | 'name'>
      & { subdomain: (
        { __typename?: 'Subdomain' }
        & Pick<Subdomain, 'id' | 'name'>
      ) }
    )> }
  ) }
);

export type UpdateAgencyMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  default_pricing_currency?: Maybe<Scalars['String']>;
}>;


export type UpdateAgencyMutation = (
  { __typename?: 'Mutation' }
  & { update_agency: (
    { __typename?: 'AgencyMutationResult' }
    & Pick<AgencyMutationResult, 'message' | 'success'>
    & { agency?: Maybe<(
      { __typename?: 'Agency' }
      & Pick<Agency, 'id' | 'name' | 'default_pricing_currency'>
    )> }
  ) }
);

export type CreateProductMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  url_name: Scalars['String'];
  duration?: Maybe<Scalars['String']>;
  image_logo?: Maybe<ImageInput>;
  image_hero?: Maybe<ImageInput>;
  status?: Maybe<Scalars['String']>;
}>;


export type CreateProductMutation = (
  { __typename?: 'Mutation' }
  & { create_product: (
    { __typename?: 'ProductMutationResult' }
    & Pick<ProductMutationResult, 'success' | 'message'>
    & { product?: Maybe<(
      { __typename?: 'Product' }
      & ProductFragment
    )> }
  ) }
);

export type UpdateProductMutationVariables = Exact<{
  product_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  url_name?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  default_price_id?: Maybe<Scalars['ID']>;
  image_logo?: Maybe<ImageInput>;
  image_hero?: Maybe<ImageInput>;
  status?: Maybe<Scalars['String']>;
}>;


export type UpdateProductMutation = (
  { __typename?: 'Mutation' }
  & { update_product: (
    { __typename?: 'ProductMutationResult' }
    & Pick<ProductMutationResult, 'success' | 'message'>
    & { product?: Maybe<(
      { __typename?: 'Product' }
      & ProductFragment
    )> }
  ) }
);

export type DeleteProductMutationVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type DeleteProductMutation = (
  { __typename?: 'Mutation' }
  & { delete_product: (
    { __typename?: 'ProductMutationResult' }
    & Pick<ProductMutationResult, 'success' | 'message'>
    & { product?: Maybe<(
      { __typename?: 'Product' }
      & Pick<Product, 'id'>
    )> }
  ) }
);

export type CreatePriceMutationVariables = Exact<{
  product_id: Scalars['ID'];
  unit_amount: Scalars['Int'];
  currency: Scalars['String'];
  recurring_interval?: Maybe<Scalars['String']>;
  recurring_interval_count?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
}>;


export type CreatePriceMutation = (
  { __typename?: 'Mutation' }
  & { create_price: (
    { __typename?: 'PriceMutationResult' }
    & Pick<PriceMutationResult, 'success' | 'message'>
    & { price?: Maybe<(
      { __typename?: 'Price' }
      & PriceFragment
    )> }
  ) }
);

export type CreateCustomerMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  email_address: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateCustomerMutation = (
  { __typename?: 'Mutation' }
  & { create_customer: (
    { __typename?: 'CustomerMutationResult' }
    & Pick<CustomerMutationResult, 'success' | 'message'>
    & { customer?: Maybe<(
      { __typename?: 'Customer' }
      & CustomerFragment
    )> }
  ) }
);

export type UpdateCustomerMutationVariables = Exact<{
  customer_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  email_address?: Maybe<Scalars['String']>;
}>;


export type UpdateCustomerMutation = (
  { __typename?: 'Mutation' }
  & { update_customer: (
    { __typename?: 'CustomerMutationResult' }
    & Pick<CustomerMutationResult, 'success' | 'message'>
    & { customer?: Maybe<(
      { __typename?: 'Customer' }
      & CustomerFragment
    )> }
  ) }
);

export type DeleteCustomerMutationVariables = Exact<{
  customer_id: Scalars['ID'];
}>;


export type DeleteCustomerMutation = (
  { __typename?: 'Mutation' }
  & { delete_customer: (
    { __typename?: 'CustomerMutationResult' }
    & Pick<CustomerMutationResult, 'success' | 'message'>
    & { customer?: Maybe<(
      { __typename?: 'Customer' }
      & Pick<Customer, 'id'>
    )> }
  ) }
);

export type CreateAgencyThankYouPageSettingMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  url: Scalars['String'];
}>;


export type CreateAgencyThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { create_agency_thank_you_page_setting: (
    { __typename?: 'AgencyThankYouPageSettingMutationResult' }
    & Pick<AgencyThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'AgencyThankYouPageSetting' }
      & Pick<AgencyThankYouPageSetting, 'id' | 'url'>
    )> }
  ) }
);

export type UpdateAgencyThankYouPageSettingMutationVariables = Exact<{
  setting_id: Scalars['ID'];
  url: Scalars['String'];
}>;


export type UpdateAgencyThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { update_agency_thank_you_page_setting: (
    { __typename?: 'AgencyThankYouPageSettingMutationResult' }
    & Pick<AgencyThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'AgencyThankYouPageSetting' }
      & Pick<AgencyThankYouPageSetting, 'id' | 'url'>
    )> }
  ) }
);

export type DeleteAgencyThankYouPageSettingMutationVariables = Exact<{
  setting_id: Scalars['ID'];
}>;


export type DeleteAgencyThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { delete_agency_thank_you_page_setting: (
    { __typename?: 'AgencyThankYouPageSettingMutationResult' }
    & Pick<AgencyThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'AgencyThankYouPageSetting' }
      & Pick<AgencyThankYouPageSetting, 'id' | 'url'>
    )> }
  ) }
);

export type CreateProductThankYouPageSettingMutationVariables = Exact<{
  product_id: Scalars['ID'];
  url: Scalars['String'];
}>;


export type CreateProductThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { create_product_thank_you_page_setting: (
    { __typename?: 'ProductThankYouPageSettingMutationResult' }
    & Pick<ProductThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'ProductThankYouPageSetting' }
      & Pick<ProductThankYouPageSetting, 'id' | 'url'>
    )> }
  ) }
);

export type UpdateProductThankYouPageSettingMutationVariables = Exact<{
  setting_id: Scalars['ID'];
  url: Scalars['String'];
}>;


export type UpdateProductThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { update_product_thank_you_page_setting: (
    { __typename?: 'ProductThankYouPageSettingMutationResult' }
    & Pick<ProductThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'ProductThankYouPageSetting' }
      & Pick<ProductThankYouPageSetting, 'id' | 'url'>
    )> }
  ) }
);

export type DeleteProductThankYouPageSettingMutationVariables = Exact<{
  setting_id: Scalars['ID'];
}>;


export type DeleteProductThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { delete_product_thank_you_page_setting: (
    { __typename?: 'ProductThankYouPageSettingMutationResult' }
    & Pick<ProductThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'ProductThankYouPageSetting' }
      & Pick<ProductThankYouPageSetting, 'id' | 'url'>
    )> }
  ) }
);

export type UpdatePageMutationVariables = Exact<{
  page_id: Scalars['ID'];
  access?: Maybe<AccessLevel>;
}>;


export type UpdatePageMutation = (
  { __typename?: 'Mutation' }
  & { update_page: (
    { __typename?: 'PageMutationResult' }
    & Pick<PageMutationResult, 'success' | 'message'>
    & { page?: Maybe<(
      { __typename?: 'Page' }
      & PageFragment
    )> }
  ) }
);

export type CreatePageBlockMutationVariables = Exact<{
  page_id: Scalars['ID'];
  page_block_definition_id: Scalars['ID'];
  data: Scalars['Json'];
  after_id?: Maybe<Scalars['ID']>;
}>;


export type CreatePageBlockMutation = (
  { __typename?: 'Mutation' }
  & { create_page_block: (
    { __typename?: 'PageBlockMutationResult' }
    & Pick<PageBlockMutationResult, 'success' | 'message'>
    & { page_block?: Maybe<(
      { __typename?: 'PageBlock' }
      & Page_BlockFragment
    )> }
  ) }
);

export type UpdatePageBlockMutationVariables = Exact<{
  page_block_id: Scalars['ID'];
  data: Scalars['Json'];
  after_id?: Maybe<Scalars['ID']>;
}>;


export type UpdatePageBlockMutation = (
  { __typename?: 'Mutation' }
  & { update_page_block: (
    { __typename?: 'PageBlockMutationResult' }
    & Pick<PageBlockMutationResult, 'success' | 'message'>
    & { page_block?: Maybe<(
      { __typename?: 'PageBlock' }
      & Page_BlockFragment
    )> }
  ) }
);

export type DeletePageBlockMutationVariables = Exact<{
  page_block_id: Scalars['ID'];
}>;


export type DeletePageBlockMutation = (
  { __typename?: 'Mutation' }
  & { delete_page_block: (
    { __typename?: 'PageBlockMutationResult' }
    & Pick<PageBlockMutationResult, 'success' | 'message'>
    & { page_block?: Maybe<(
      { __typename?: 'PageBlock' }
      & Page_BlockFragment
    )> }
  ) }
);

export type CreateCredentialMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  credential_type_id: Scalars['ID'];
  data: Scalars['Json'];
  name: Scalars['String'];
}>;


export type CreateCredentialMutation = (
  { __typename?: 'Mutation' }
  & { create_credential: (
    { __typename?: 'CredentialMutationResult' }
    & Pick<CredentialMutationResult, 'success' | 'message'>
    & { credential?: Maybe<(
      { __typename?: 'Credential' }
      & CredentialFragment
    )> }
  ) }
);

export type UpdateCredentialMutationVariables = Exact<{
  credential_id: Scalars['ID'];
  data: Scalars['Json'];
}>;


export type UpdateCredentialMutation = (
  { __typename?: 'Mutation' }
  & { update_credential: (
    { __typename?: 'CredentialMutationResult' }
    & Pick<CredentialMutationResult, 'success' | 'message'>
    & { credential?: Maybe<(
      { __typename?: 'Credential' }
      & CredentialFragment
    )> }
  ) }
);

export type CreateIntegrationMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  integration_type_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  product_id?: Maybe<Scalars['ID']>;
  integration_config_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type CreateIntegrationMutation = (
  { __typename?: 'Mutation' }
  & { create_integration: (
    { __typename?: 'IntegrationMutationResult' }
    & Pick<IntegrationMutationResult, 'success' | 'message'>
    & { integration?: Maybe<(
      { __typename?: 'Integration' }
      & IntegrationFragment
    )> }
  ) }
);

export type UpdateIntegrationMutationVariables = Exact<{
  integration_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type UpdateIntegrationMutation = (
  { __typename?: 'Mutation' }
  & { update_integration: (
    { __typename?: 'IntegrationMutationResult' }
    & Pick<IntegrationMutationResult, 'success' | 'message'>
    & { integration?: Maybe<(
      { __typename?: 'Integration' }
      & IntegrationFragment
    )> }
  ) }
);

export type CreateIntegrationConfigMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  integration_type_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['Json'];
}>;


export type CreateIntegrationConfigMutation = (
  { __typename?: 'Mutation' }
  & { create_integration_config: (
    { __typename?: 'IntegrationConfigMutationResult' }
    & Pick<IntegrationConfigMutationResult, 'success' | 'message'>
    & { integration_config?: Maybe<(
      { __typename?: 'IntegrationConfig' }
      & Integration_ConfigFragment
    )> }
  ) }
);

export type UpdateIntegrationConfigMutationVariables = Exact<{
  integration_config_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  credential_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type UpdateIntegrationConfigMutation = (
  { __typename?: 'Mutation' }
  & { update_integration_config: (
    { __typename?: 'IntegrationConfigMutationResult' }
    & Pick<IntegrationConfigMutationResult, 'success' | 'message'>
    & { integration_config?: Maybe<(
      { __typename?: 'IntegrationConfig' }
      & Integration_ConfigFragment
    )> }
  ) }
);

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { current_user?: Maybe<(
    { __typename?: 'User' }
    & { memberships: Array<(
      { __typename?: 'Membership' }
      & MembershipFragment
    )> }
    & UserFragment
  )> }
);

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'country_codes'>
);

export type CountrySpecQueryVariables = Exact<{
  country_code: Scalars['ID'];
}>;


export type CountrySpecQuery = (
  { __typename?: 'Query' }
  & { country_spec?: Maybe<(
    { __typename?: 'CountrySpec' }
    & Pick<CountrySpec, 'id' | 'default_currency' | 'supported_payment_currencies' | 'supported_payment_methods' | 'supported_transfer_countries'>
  )> }
);

export type ImageQueryVariables = Exact<{
  image_id: Scalars['ID'];
}>;


export type ImageQuery = (
  { __typename?: 'Query' }
  & { image?: Maybe<(
    { __typename?: 'Image' }
    & ImageFragment
  )> }
);

export type ImagesQueryVariables = Exact<{
  filter: ImageFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type ImagesQuery = (
  { __typename?: 'Query' }
  & { images?: Maybe<Array<(
    { __typename?: 'Image' }
    & ImageFragment
  )>> }
);

export type ServicesAgreementQueryVariables = Exact<{ [key: string]: never; }>;


export type ServicesAgreementQuery = (
  { __typename?: 'Query' }
  & { markdowns?: Maybe<Array<(
    { __typename?: 'Markdown' }
    & MarkdownFragment
  )>> }
);

export type AgencyStripeAccountQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { stripe_account: (
      { __typename?: 'StripeAccount' }
      & Stripe_AccountFragment
    ) }
  )> }
);

export type AgencyStripeAccountUpdateUrlQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountUpdateUrlQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { stripe_account: (
      { __typename?: 'StripeAccount' }
      & Pick<StripeAccount, 'id'>
      & { account_update_url: (
        { __typename?: 'StripeAccountLink' }
        & Pick<StripeAccountLink, 'url'>
      ) }
    ) }
  )> }
);

export type AgencyStripeAccountBalanceQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountBalanceQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { stripe_account: (
      { __typename?: 'StripeAccount' }
      & Pick<StripeAccount, 'id'>
      & { balance: (
        { __typename?: 'StripeBalance' }
        & { available: Array<(
          { __typename?: 'StripeCurrencyBalance' }
          & Pick<StripeCurrencyBalance, 'amount' | 'currency'>
          & { source_types: (
            { __typename?: 'StripeBalanceSource' }
            & Pick<StripeBalanceSource, 'card' | 'bank_account'>
          ) }
        )>, pending: Array<(
          { __typename?: 'StripeCurrencyBalance' }
          & Pick<StripeCurrencyBalance, 'amount' | 'currency'>
          & { source_types: (
            { __typename?: 'StripeBalanceSource' }
            & Pick<StripeBalanceSource, 'card' | 'bank_account'>
          ) }
        )>, connect_reserved?: Maybe<Array<(
          { __typename?: 'StripeCurrencyBalance' }
          & Pick<StripeCurrencyBalance, 'amount' | 'currency'>
          & { source_types: (
            { __typename?: 'StripeBalanceSource' }
            & Pick<StripeBalanceSource, 'card' | 'bank_account'>
          ) }
        )>> }
      ) }
    ) }
  )> }
);

export type AgencyStripeAccountBalanceTransactionsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  created?: Maybe<Scalars['DateTime']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountBalanceTransactionsQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { stripe_account: (
      { __typename?: 'StripeAccount' }
      & Pick<StripeAccount, 'id'>
      & { balance_transactions: Array<(
        { __typename?: 'BalanceTransaction' }
        & Balance_TransactionFragment
      )> }
    ) }
  )> }
);

export type AgencyStripeAccountPaymentIntentsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  created?: Maybe<Scalars['DateTime']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountPaymentIntentsQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { stripe_account: (
      { __typename?: 'StripeAccount' }
      & Pick<StripeAccount, 'id'>
      & { payment_intents: Array<(
        { __typename?: 'PaymentIntent' }
        & Payment_IntentFragment
      )> }
    ) }
  )> }
);

export type CustomerQueryVariables = Exact<{
  customer_id: Scalars['ID'];
}>;


export type CustomerQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & CustomerFragment
  )> }
);

export type AgencyCustomersQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  filter?: Maybe<CustomerFilter>;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type AgencyCustomersQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { stripe_account: (
      { __typename?: 'StripeAccount' }
      & Pick<StripeAccount, 'id'>
      & { customers: Array<(
        { __typename?: 'Customer' }
        & CustomerFragment
      )> }
    ) }
  )> }
);

export type CustomersQueryVariables = Exact<{
  filter: CustomerFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type CustomersQuery = (
  { __typename?: 'Query' }
  & { customers?: Maybe<Array<(
    { __typename?: 'Customer' }
    & CustomerFragment
  )>> }
);

export type CountCustomersQueryVariables = Exact<{
  filter: CustomerFilter;
  token?: Maybe<Scalars['String']>;
}>;


export type CountCustomersQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'count_customers'>
);

export type AgencySubscriptionPlanQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencySubscriptionPlanQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { subscription_plan: (
      { __typename?: 'SubscriptionPlan' }
      & Subscription_PlanFragment
    ) }
  )> }
);

export type AgencyQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & AgencyFragment
  )> }
);

export type AgenciesQueryVariables = Exact<{
  filter: AgencyFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type AgenciesQuery = (
  { __typename?: 'Query' }
  & { agencies?: Maybe<Array<(
    { __typename?: 'Agency' }
    & AgencyFragment
  )>> }
);

export type CurrentUserAgenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserAgenciesQuery = (
  { __typename?: 'Query' }
  & { current_user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { memberships: Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'id' | 'access'>
      & { subdomain: (
        { __typename?: 'Subdomain' }
        & Pick<Subdomain, 'id' | 'name'>
        & { agency: (
          { __typename?: 'Agency' }
          & { stripe_account: (
            { __typename?: 'StripeAccount' }
            & Stripe_AccountFragment
          ), subscription_plan: (
            { __typename?: 'SubscriptionPlan' }
            & Subscription_PlanFragment
          ) }
          & AgencyFragment
        ), memberships: Array<(
          { __typename?: 'Membership' }
          & MembershipFragment
        )> }
      ), user: (
        { __typename?: 'User' }
        & Pick<User, 'id'>
      ) }
    )> }
  )> }
);

export type SubdomainPublicQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainPublicQuery = (
  { __typename?: 'Query' }
  & { subdomains?: Maybe<Array<(
    { __typename?: 'Subdomain' }
    & Pick<Subdomain, 'id' | 'name'>
    & { agency: (
      { __typename?: 'Agency' }
      & Pick<Agency, 'id' | 'name'>
      & { theme: (
        { __typename?: 'Theme' }
        & ThemeFragment
      ) }
    ) }
  )>> }
);

export type ProductQueryVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type ProductQuery = (
  { __typename?: 'Query' }
  & { product?: Maybe<(
    { __typename?: 'Product' }
    & ProductFragment
  )> }
);

export type ProductsQueryVariables = Exact<{
  filter: ProductFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type ProductsQuery = (
  { __typename?: 'Query' }
  & { products?: Maybe<Array<(
    { __typename?: 'Product' }
    & ProductFragment
  )>> }
);

export type CountProductsQueryVariables = Exact<{
  filter: ProductFilter;
  token?: Maybe<Scalars['String']>;
}>;


export type CountProductsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'count_products'>
);

export type OrderQueryVariables = Exact<{
  order_id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
}>;


export type OrderQuery = (
  { __typename?: 'Query' }
  & { order?: Maybe<(
    { __typename?: 'Order' }
    & { items: Array<(
      { __typename?: 'OrderItem' }
      & Order_ItemFragment
    )>, customer: (
      { __typename?: 'Customer' }
      & Pick<Customer, 'id' | 'name' | 'email_address'>
    ) }
    & OrderFragment
  )> }
);

export type OrdersQueryVariables = Exact<{
  filter: OrderFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type OrdersQuery = (
  { __typename?: 'Query' }
  & { orders?: Maybe<Array<(
    { __typename?: 'Order' }
    & { items: Array<(
      { __typename?: 'OrderItem' }
      & Order_ItemFragment
    )>, customer: (
      { __typename?: 'Customer' }
      & Pick<Customer, 'id' | 'name' | 'email_address'>
    ) }
    & OrderFragment
  )>> }
);

export type CountOrdersQueryVariables = Exact<{
  filter: OrderFilter;
  token?: Maybe<Scalars['String']>;
}>;


export type CountOrdersQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'count_orders'>
);

export type OrderItemQueryVariables = Exact<{
  order_item_id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
}>;


export type OrderItemQuery = (
  { __typename?: 'Query' }
  & { order_item?: Maybe<(
    { __typename?: 'OrderItem' }
    & Order_ItemFragment
  )> }
);

export type OrderItemsQueryVariables = Exact<{
  filter: OrderItemFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type OrderItemsQuery = (
  { __typename?: 'Query' }
  & { order_items?: Maybe<Array<(
    { __typename?: 'OrderItem' }
    & Order_ItemFragment
  )>> }
);

export type ProductAndAgencyFromUrlPartsQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
  product_url_name: Scalars['String'];
}>;


export type ProductAndAgencyFromUrlPartsQuery = (
  { __typename?: 'Query' }
  & { subdomains?: Maybe<Array<(
    { __typename?: 'Subdomain' }
    & Pick<Subdomain, 'id' | 'name'>
    & { agency: (
      { __typename?: 'Agency' }
      & Pick<Agency, 'id'>
      & { products?: Maybe<Array<(
        { __typename?: 'Product' }
        & { agency: (
          { __typename?: 'Agency' }
          & AgencyFragment
        ) }
        & ProductFragment
      )>> }
    ) }
  )>> }
);

export type SubdomainAgencyQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyQuery = (
  { __typename?: 'Query' }
  & { subdomains?: Maybe<Array<(
    { __typename?: 'Subdomain' }
    & Pick<Subdomain, 'id' | 'name'>
    & { agency: (
      { __typename?: 'Agency' }
      & AgencyFragment
    ) }
  )>> }
);

export type SubdomainAgencyExtendedQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyExtendedQuery = (
  { __typename?: 'Query' }
  & { subdomains?: Maybe<Array<(
    { __typename?: 'Subdomain' }
    & Pick<Subdomain, 'id' | 'name'>
    & { agency: (
      { __typename?: 'Agency' }
      & Pick<Agency, 'supported_payment_currencies'>
      & AgencyFragment
    ) }
  )>> }
);

export type SubdomainAgencyStripeAccountUpdateUrlQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyStripeAccountUpdateUrlQuery = (
  { __typename?: 'Query' }
  & { subdomains?: Maybe<Array<(
    { __typename?: 'Subdomain' }
    & Pick<Subdomain, 'id' | 'name'>
    & { agency: (
      { __typename?: 'Agency' }
      & Pick<Agency, 'id'>
      & { stripe_account: (
        { __typename?: 'StripeAccount' }
        & { account_update_url: (
          { __typename?: 'StripeAccountLink' }
          & Pick<StripeAccountLink, 'url'>
        ) }
      ) }
    ) }
  )>> }
);

export type AgencyThankYouPageSettingQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyThankYouPageSettingQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { settings: (
      { __typename?: 'AgencySettings' }
      & Pick<AgencySettings, 'id'>
      & { thank_you_page_setting?: Maybe<(
        { __typename?: 'AgencyThankYouPageSetting' }
        & Pick<AgencyThankYouPageSetting, 'id' | 'url'>
      )> }
    ) }
  )> }
);

export type ProductThankYouPageSettingQueryVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type ProductThankYouPageSettingQuery = (
  { __typename?: 'Query' }
  & { product?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id'>
    & { settings: (
      { __typename?: 'ProductSettings' }
      & Pick<ProductSettings, 'id'>
      & { thank_you_page_setting?: Maybe<(
        { __typename?: 'ProductThankYouPageSetting' }
        & Pick<ProductThankYouPageSetting, 'id' | 'url'>
      )> }
    ) }
  )> }
);

export type AgencyPagesQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  page_definition_id?: Maybe<Scalars['ID']>;
}>;


export type AgencyPagesQuery = (
  { __typename?: 'Query' }
  & { pages?: Maybe<Array<(
    { __typename?: 'Page' }
    & PageFragment
  )>> }
);

export type ProductPagesQueryVariables = Exact<{
  product_id: Scalars['ID'];
  page_definition_id?: Maybe<Scalars['ID']>;
}>;


export type ProductPagesQuery = (
  { __typename?: 'Query' }
  & { pages?: Maybe<Array<(
    { __typename?: 'Page' }
    & PageFragment
  )>> }
);

export type PageQueryVariables = Exact<{
  page_id: Scalars['ID'];
}>;


export type PageQuery = (
  { __typename?: 'Query' }
  & { page?: Maybe<(
    { __typename?: 'Page' }
    & PageFragment
  )> }
);

export type PageByUrlQueryVariables = Exact<{
  url: Scalars['String'];
}>;


export type PageByUrlQuery = (
  { __typename?: 'Query' }
  & { page_by_url?: Maybe<(
    { __typename?: 'Page' }
    & PageFragment
  )> }
);

export type PageBlockQueryVariables = Exact<{
  page_block_id: Scalars['ID'];
}>;


export type PageBlockQuery = (
  { __typename?: 'Query' }
  & { page_block?: Maybe<(
    { __typename?: 'PageBlock' }
    & Page_BlockFragment
  )> }
);

export type PageDefinitionQueryVariables = Exact<{
  page_definition_id: Scalars['ID'];
}>;


export type PageDefinitionQuery = (
  { __typename?: 'Query' }
  & { page_definition?: Maybe<(
    { __typename?: 'PageDefinition' }
    & Page_DefinitionFragment
  )> }
);

export type PageBlockDefinitionQueryVariables = Exact<{
  page_block_definition_id: Scalars['ID'];
}>;


export type PageBlockDefinitionQuery = (
  { __typename?: 'Query' }
  & { page_block_definition?: Maybe<(
    { __typename?: 'PageBlockDefinition' }
    & Page_Block_DefinitionFragment
  )> }
);

export type PageDefinitionsByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type PageDefinitionsByNameQuery = (
  { __typename?: 'Query' }
  & { page_definitions?: Maybe<Array<(
    { __typename?: 'PageDefinition' }
    & Page_DefinitionFragment
  )>> }
);

export type PageDefinitionByUrlPathQueryVariables = Exact<{
  url_path: Scalars['String'];
}>;


export type PageDefinitionByUrlPathQuery = (
  { __typename?: 'Query' }
  & { page_definition_by_url_path?: Maybe<(
    { __typename?: 'PageDefinition' }
    & Page_DefinitionFragment
  )> }
);

export type PageBlockDefinitionsByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type PageBlockDefinitionsByNameQuery = (
  { __typename?: 'Query' }
  & { page_block_definitions?: Maybe<Array<(
    { __typename?: 'PageBlockDefinition' }
    & Page_Block_DefinitionFragment
  )>> }
);

export type CalculateTransactionFeeQueryVariables = Exact<{
  subscription_plan_id: Scalars['ID'];
  amount: Scalars['Int'];
  currency: Scalars['String'];
}>;


export type CalculateTransactionFeeQuery = (
  { __typename?: 'Query' }
  & { subscription_plan?: Maybe<(
    { __typename?: 'SubscriptionPlan' }
    & Pick<SubscriptionPlan, 'id' | 'calculate_fee'>
  )> }
);

export type FormFieldQueryVariables = Exact<{
  form_field_id: Scalars['ID'];
}>;


export type FormFieldQuery = (
  { __typename?: 'Query' }
  & { form_field?: Maybe<(
    { __typename?: 'FormField' }
    & Form_FieldFragment
  )> }
);

export type FormFieldsQueryVariables = Exact<{
  filter: FormFieldFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type FormFieldsQuery = (
  { __typename?: 'Query' }
  & { form_fields?: Maybe<Array<(
    { __typename?: 'FormField' }
    & Form_FieldFragment
  )>> }
);

export type CredentialQueryVariables = Exact<{
  credential_id: Scalars['ID'];
}>;


export type CredentialQuery = (
  { __typename?: 'Query' }
  & { credential?: Maybe<(
    { __typename?: 'Credential' }
    & CredentialFragment
  )> }
);

export type CredentialsQueryVariables = Exact<{
  filter: CredentialFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type CredentialsQuery = (
  { __typename?: 'Query' }
  & { credentials?: Maybe<Array<(
    { __typename?: 'Credential' }
    & CredentialFragment
  )>> }
);

export type CredentialTypeQueryVariables = Exact<{
  credential_type_id: Scalars['ID'];
}>;


export type CredentialTypeQuery = (
  { __typename?: 'Query' }
  & { credential_type?: Maybe<(
    { __typename?: 'CredentialType' }
    & Credential_TypeFragment
  )> }
);

export type CredentialTypesQueryVariables = Exact<{
  filter: CredentialTypeFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type CredentialTypesQuery = (
  { __typename?: 'Query' }
  & { credential_types?: Maybe<Array<(
    { __typename?: 'CredentialType' }
    & Credential_TypeFragment
  )>> }
);

export type IntegrationQueryVariables = Exact<{
  integration_id: Scalars['ID'];
}>;


export type IntegrationQuery = (
  { __typename?: 'Query' }
  & { integration?: Maybe<(
    { __typename?: 'Integration' }
    & IntegrationFragment
  )> }
);

export type IntegrationsQueryVariables = Exact<{
  filter: IntegrationFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type IntegrationsQuery = (
  { __typename?: 'Query' }
  & { integrations?: Maybe<Array<(
    { __typename?: 'Integration' }
    & IntegrationFragment
  )>> }
);

export type IntegrationConfigQueryVariables = Exact<{
  integration_config_id: Scalars['ID'];
}>;


export type IntegrationConfigQuery = (
  { __typename?: 'Query' }
  & { integration_config?: Maybe<(
    { __typename?: 'IntegrationConfig' }
    & Integration_ConfigFragment
  )> }
);

export type IntegrationConfigsQueryVariables = Exact<{
  filter: IntegrationConfigFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type IntegrationConfigsQuery = (
  { __typename?: 'Query' }
  & { integration_configs?: Maybe<Array<(
    { __typename?: 'IntegrationConfig' }
    & Integration_ConfigFragment
  )>> }
);

export type IntegrationTypeQueryVariables = Exact<{
  integration_type_id: Scalars['ID'];
}>;


export type IntegrationTypeQuery = (
  { __typename?: 'Query' }
  & { integration_type?: Maybe<(
    { __typename?: 'IntegrationType' }
    & Integration_TypeFragment
  )> }
);

export type IntegrationTypesQueryVariables = Exact<{
  filter: IntegrationTypeFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type IntegrationTypesQuery = (
  { __typename?: 'Query' }
  & { integration_types?: Maybe<Array<(
    { __typename?: 'IntegrationType' }
    & Integration_TypeFragment
  )>> }
);

export const Stripe_AccountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_account"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"business_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mcc"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"product_description"}},{"kind":"Field","name":{"kind":"Name","value":"support_address"}},{"kind":"Field","name":{"kind":"Name","value":"support_email"}},{"kind":"Field","name":{"kind":"Name","value":"support_phone"}},{"kind":"Field","name":{"kind":"Name","value":"support_url"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"business_type"}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card_payments"}},{"kind":"Field","name":{"kind":"Name","value":"transfers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_deadline"}},{"kind":"Field","name":{"kind":"Name","value":"disabled_reason"}},{"kind":"Field","name":{"kind":"Name","value":"currently_due"}},{"kind":"Field","name":{"kind":"Name","value":"eventually_due"}},{"kind":"Field","name":{"kind":"Name","value":"past_due"}},{"kind":"Field","name":{"kind":"Name","value":"pending_verification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"primary_color"}},{"kind":"Field","name":{"kind":"Name","value":"secondary_color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"charges_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency"}},{"kind":"Field","name":{"kind":"Name","value":"details_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"payouts_enabled"}}]}}]} as unknown as DocumentNode<Stripe_AccountFragment, unknown>;
export const Balance_TransactionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"balance_transaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"available_on"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"exchange_rate"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"fee_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"application"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"net"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reporting_category"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<Balance_TransactionFragment, unknown>;
export const AddressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]} as unknown as DocumentNode<AddressFragment, unknown>;
export const ChargeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"charge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"authorization_code"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculated_statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"captured"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"disputed"}},{"kind":"Field","name":{"kind":"Name","value":"failure_code"}},{"kind":"Field","name":{"kind":"Name","value":"failure_message"}},{"kind":"Field","name":{"kind":"Name","value":"fraud_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_report"}},{"kind":"Field","name":{"kind":"Name","value":"user_report"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network_status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"risk_level"}},{"kind":"Field","name":{"kind":"Name","value":"risk_score"}},{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seller_message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_number"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_url"}},{"kind":"Field","name":{"kind":"Name","value":"refunded"}},{"kind":"Field","name":{"kind":"Name","value":"source_transfer"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}}]} as unknown as DocumentNode<ChargeFragment, unknown>;
export const Stripe_CustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"delinquent"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_prefix"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"next_invoice_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"preferred_locales"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Stripe_CustomerFragment, unknown>;
export const Payment_IntentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"payment_intent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentIntent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"cancellation_reason"}},{"kind":"Field","name":{"kind":"Name","value":"capture_method"}},{"kind":"Field","name":{"kind":"Name","value":"charges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"charge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmation_method"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"on_behalf_of"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"setup_future_usage"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}}]} as unknown as DocumentNode<Payment_IntentFragment, unknown>;
export const Transaction_FeeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"transaction_fee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionFee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"transaction_amount_upper_bound"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Transaction_FeeFragment, unknown>;
export const Subscription_PlanFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subscription_plan"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionPlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"transaction_fees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"transaction_fee"}}]}}]}}]} as unknown as DocumentNode<Subscription_PlanFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"user"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const CustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_stripe_customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}}]}}]}}]} as unknown as DocumentNode<CustomerFragment, unknown>;
export const ImageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"image"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}}]} as unknown as DocumentNode<ImageFragment, unknown>;
export const ThemeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"theme"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Theme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"color_primary"}},{"kind":"Field","name":{"kind":"Name","value":"color_secondary"}},{"kind":"Field","name":{"kind":"Name","value":"color_accent"}},{"kind":"Field","name":{"kind":"Name","value":"color_background"}},{"kind":"Field","name":{"kind":"Name","value":"color_surface"}},{"kind":"Field","name":{"kind":"Name","value":"color_error"}},{"kind":"Field","name":{"kind":"Name","value":"color_success"}}]}}]} as unknown as DocumentNode<ThemeFragment, unknown>;
export const AgencyFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"agency"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agency"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_pricing_currency"}}]}}]} as unknown as DocumentNode<AgencyFragment, unknown>;
export const MembershipFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Membership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MembershipFragment, unknown>;
export const SubdomainFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subdomain"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subdomain"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}}]} as unknown as DocumentNode<SubdomainFragment, unknown>;
export const Form_FieldFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"form_field"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hint"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"suffix"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"default"}}]}}]} as unknown as DocumentNode<Form_FieldFragment, unknown>;
export const Credential_TypeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"credential_type"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CredentialType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"form_field"}}]}}]}}]} as unknown as DocumentNode<Credential_TypeFragment, unknown>;
export const CredentialFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"credential"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Credential"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"credential_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"credential_type"}}]}}]}}]} as unknown as DocumentNode<CredentialFragment, unknown>;
export const IntegrationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"integration"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Integration"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"credential"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integration_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integration_config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<IntegrationFragment, unknown>;
export const Integration_ConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"integration_config"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IntegrationConfig"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"credential"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integration_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Integration_ConfigFragment, unknown>;
export const Integration_TypeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"integration_type"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IntegrationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"automatic_order_management"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"form_field"}}]}},{"kind":"Field","name":{"kind":"Name","value":"config_fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"form_field"}}]}},{"kind":"Field","name":{"kind":"Name","value":"credential_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"credential_type"}}]}}]}}]} as unknown as DocumentNode<Integration_TypeFragment, unknown>;
export const Page_DefinitionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"page_definition"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageDefinition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url_path"}}]}}]} as unknown as DocumentNode<Page_DefinitionFragment, unknown>;
export const Page_Block_DefinitionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"page_block_definition"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageBlockDefinition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"form_field"}}]}}]}}]} as unknown as DocumentNode<Page_Block_DefinitionFragment, unknown>;
export const Page_BlockFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"page_block"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"definition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block_definition"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]} as unknown as DocumentNode<Page_BlockFragment, unknown>;
export const PageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"page"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url_path"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"definition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_definition"}}]}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}}]} as unknown as DocumentNode<PageFragment, unknown>;
export const Line_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"line_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]} as unknown as DocumentNode<Line_ItemFragment, unknown>;
export const Stripe_Checkout_SessionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_checkout_session"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCheckoutSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"allow_promotion_codes"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"billing_address_collection"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_url"}},{"kind":"Field","name":{"kind":"Name","value":"client_reference_id"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_email"}},{"kind":"Field","name":{"kind":"Name","value":"line_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"line_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"payment_status"}},{"kind":"Field","name":{"kind":"Name","value":"submit_type"}},{"kind":"Field","name":{"kind":"Name","value":"success_url"}}]}}]} as unknown as DocumentNode<Stripe_Checkout_SessionFragment, unknown>;
export const PriceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Price"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval_count"}}]}}]} as unknown as DocumentNode<PriceFragment, unknown>;
export const MarkdownFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"markdown"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Markdown"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]} as unknown as DocumentNode<MarkdownFragment, unknown>;
export const ProductFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url_name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"default_price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"markdown_description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProductFragment, unknown>;
export const Order_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"order_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_line_item_id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"processed_at"}}]}}]} as unknown as DocumentNode<Order_ItemFragment, unknown>;
export const OrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ordered_at"}},{"kind":"Field","name":{"kind":"Name","value":"processed_at"}}]}}]} as unknown as DocumentNode<OrderFragment, unknown>;
export const BeginVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BeginVisit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"begin_visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]} as unknown as DocumentNode<BeginVisitMutation, BeginVisitMutationVariables>;
export const EndVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndVisit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"end_visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EndVisitMutation, EndVisitMutationVariables>;
export const LogInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recaptcha_token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"log_in"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"recaptcha_token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recaptcha_token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]} as unknown as DocumentNode<LogInMutation, LogInMutationVariables>;
export const LogOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"log_out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LogOutMutation, LogOutMutationVariables>;
export const VerifyPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verify_password_reset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verification_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifyPasswordResetMutation, VerifyPasswordResetMutationVariables>;
export const VerifySignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifySignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verify_sign_up"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verification_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifySignUpMutation, VerifySignUpMutationVariables>;
export const StartPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start_password_reset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirect_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<StartPasswordResetMutation, StartPasswordResetMutationVariables>;
export const StartSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recaptcha_token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start_sign_up"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirect_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}}},{"kind":"Argument","name":{"kind":"Name","value":"recaptcha_token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recaptcha_token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<StartSignUpMutation, StartSignUpMutationVariables>;
export const CreateAgencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"livemode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"return_url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"livemode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"livemode"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdomain_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"country_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"return_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"return_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_verification_url"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateAgencyMutation, CreateAgencyMutationVariables>;
export const UpdateAgencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_pricing_currency"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_pricing_currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_pricing_currency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"default_pricing_currency"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAgencyMutation, UpdateAgencyMutationVariables>;
export const CreateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}}]}},...ProductFragmentDoc.definitions,...PriceFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_price_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_price_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_price_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}}]}},...ProductFragmentDoc.definitions,...PriceFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<UpdateProductMutation, UpdateProductMutationVariables>;
export const DeleteProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteProductMutation, DeleteProductMutationVariables>;
export const CreatePriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval_count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_price"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"unit_amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"recurring_interval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval"}}},{"kind":"Argument","name":{"kind":"Name","value":"recurring_interval_count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval_count"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}}]}}]}},...PriceFragmentDoc.definitions]} as unknown as DocumentNode<CreatePriceMutation, CreatePriceMutationVariables>;
export const CreateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}},...CustomerFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}},...CustomerFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const CreateAgencyThankYouPageSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<CreateAgencyThankYouPageSettingMutation, CreateAgencyThankYouPageSettingMutationVariables>;
export const UpdateAgencyThankYouPageSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAgencyThankYouPageSettingMutation, UpdateAgencyThankYouPageSettingMutationVariables>;
export const DeleteAgencyThankYouPageSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteAgencyThankYouPageSettingMutation, DeleteAgencyThankYouPageSettingMutationVariables>;
export const CreateProductThankYouPageSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProductThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_product_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<CreateProductThankYouPageSettingMutation, CreateProductThankYouPageSettingMutationVariables>;
export const UpdateProductThankYouPageSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_product_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProductThankYouPageSettingMutation, UpdateProductThankYouPageSettingMutationVariables>;
export const DeleteProductThankYouPageSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProductThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_product_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteProductThankYouPageSettingMutation, DeleteProductThankYouPageSettingMutationVariables>;
export const UpdatePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"access"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessLevel"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"access"},"value":{"kind":"Variable","name":{"kind":"Name","value":"access"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}}]}},...PageFragmentDoc.definitions,...Page_DefinitionFragmentDoc.definitions,...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<UpdatePageMutation, UpdatePageMutationVariables>;
export const CreatePageBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePageBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_definition_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_page_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"page_block_definition_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_definition_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"page_block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}}]}}]}},...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<CreatePageBlockMutation, CreatePageBlockMutationVariables>;
export const UpdatePageBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePageBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_page_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page_block_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"page_block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}}]}}]}},...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<UpdatePageBlockMutation, UpdatePageBlockMutationVariables>;
export const DeletePageBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePageBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_page_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page_block_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"page_block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}}]}}]}},...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<DeletePageBlockMutation, DeletePageBlockMutationVariables>;
export const CreateCredentialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCredential"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credential_type_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_credential"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"credential_type_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credential_type_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"credential"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"credential"}}]}}]}}]}},...CredentialFragmentDoc.definitions,...Credential_TypeFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<CreateCredentialMutation, CreateCredentialMutationVariables>;
export const UpdateCredentialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCredential"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_credential"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credential_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"credential"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"credential"}}]}}]}}]}},...CredentialFragmentDoc.definitions,...Credential_TypeFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<UpdateCredentialMutation, UpdateCredentialMutationVariables>;
export const CreateIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration_type_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration_config_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_integration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"integration_type_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration_type_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"credential_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"integration_config_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration_config_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"integration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration"}}]}}]}}]}},...IntegrationFragmentDoc.definitions]} as unknown as DocumentNode<CreateIntegrationMutation, CreateIntegrationMutationVariables>;
export const UpdateIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_integration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"integration_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"credential_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"integration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration"}}]}}]}}]}},...IntegrationFragmentDoc.definitions]} as unknown as DocumentNode<UpdateIntegrationMutation, UpdateIntegrationMutationVariables>;
export const CreateIntegrationConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIntegrationConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration_type_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_integration_config"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"integration_type_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration_type_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"credential_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"integration_config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration_config"}}]}}]}}]}},...Integration_ConfigFragmentDoc.definitions]} as unknown as DocumentNode<CreateIntegrationConfigMutation, CreateIntegrationConfigMutationVariables>;
export const UpdateIntegrationConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIntegrationConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration_config_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_integration_config"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"integration_config_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration_config_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"credential_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"integration_config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration_config"}}]}}]}}]}},...Integration_ConfigFragmentDoc.definitions]} as unknown as DocumentNode<UpdateIntegrationConfigMutation, UpdateIntegrationConfigMutationVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}}]}},...UserFragmentDoc.definitions,...MembershipFragmentDoc.definitions]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const CountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country_codes"}}]}}]} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;
export const CountrySpecDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CountrySpec"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country_spec"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"country_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency"}},{"kind":"Field","name":{"kind":"Name","value":"supported_payment_currencies"}},{"kind":"Field","name":{"kind":"Name","value":"supported_payment_methods"}},{"kind":"Field","name":{"kind":"Name","value":"supported_transfer_countries"}}]}}]}}]} as unknown as DocumentNode<CountrySpecQuery, CountrySpecQueryVariables>;
export const ImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Image"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}}]}},...ImageFragmentDoc.definitions]} as unknown as DocumentNode<ImageQuery, ImageQueryVariables>;
export const ImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Images"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}}]}},...ImageFragmentDoc.definitions]} as unknown as DocumentNode<ImagesQuery, ImagesQueryVariables>;
export const ServicesAgreementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServicesAgreement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markdowns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"Services Agreement","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}}]}},...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<ServicesAgreementQuery, ServicesAgreementQueryVariables>;
export const AgencyStripeAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_account"}}]}}]}}]}},...Stripe_AccountFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountQuery, AgencyStripeAccountQueryVariables>;
export const AgencyStripeAccountUpdateUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountUpdateUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"account_update_url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AgencyStripeAccountUpdateUrlQuery, AgencyStripeAccountUpdateUrlQueryVariables>;
export const AgencyStripeAccountBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"connect_reserved"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AgencyStripeAccountBalanceQuery, AgencyStripeAccountBalanceQueryVariables>;
export const AgencyStripeAccountBalanceTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalanceTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}}]}}]}}]}},...Balance_TransactionFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountBalanceTransactionsQuery, AgencyStripeAccountBalanceTransactionsQueryVariables>;
export const AgencyStripeAccountPaymentIntentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountPaymentIntents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}}]}}]}}]}},...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountPaymentIntentsQuery, AgencyStripeAccountPaymentIntentsQueryVariables>;
export const CustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Customer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}},...CustomerFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<CustomerQuery, CustomerQueryVariables>;
export const AgencyCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}}]}},...CustomerFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<AgencyCustomersQuery, AgencyCustomersQueryVariables>;
export const CustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Customers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}},...CustomerFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<CustomersQuery, CustomersQueryVariables>;
export const CountCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CountCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count_customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<CountCustomersQuery, CountCustomersQueryVariables>;
export const AgencySubscriptionPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencySubscriptionPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription_plan"}}]}}]}}]}},...Subscription_PlanFragmentDoc.definitions,...Transaction_FeeFragmentDoc.definitions]} as unknown as DocumentNode<AgencySubscriptionPlanQuery, AgencySubscriptionPlanQueryVariables>;
export const AgencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Agency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}},...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<AgencyQuery, AgencyQueryVariables>;
export const AgenciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Agencies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AgencyFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agencies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}},...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<AgenciesQuery, AgenciesQueryVariables>;
export const CurrentUserAgenciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUserAgencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_account"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription_plan"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions,...Stripe_AccountFragmentDoc.definitions,...Subscription_PlanFragmentDoc.definitions,...Transaction_FeeFragmentDoc.definitions,...MembershipFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<CurrentUserAgenciesQuery, CurrentUserAgenciesQueryVariables>;
export const SubdomainPublicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainPublic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}}]}}]}}]}},...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<SubdomainPublicQuery, SubdomainPublicQueryVariables>;
export const ProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Product"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}},...ProductFragmentDoc.definitions,...PriceFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<ProductQuery, ProductQueryVariables>;
export const ProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Products"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}},...ProductFragmentDoc.definitions,...PriceFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const CountProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CountProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count_products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<CountProductsQuery, CountProductsQueryVariables>;
export const OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}}]}}]}},...OrderFragmentDoc.definitions,...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const OrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Orders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}}]}}]}},...OrderFragmentDoc.definitions,...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<OrdersQuery, OrdersQueryVariables>;
export const CountOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CountOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count_orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<CountOrdersQuery, CountOrdersQueryVariables>;
export const OrderItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_item_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order_item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_item_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}}]}},...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<OrderItemQuery, OrderItemQueryVariables>;
export const OrderItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItemFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order_items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}}]}},...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<OrderItemsQuery, OrderItemsQueryVariables>;
export const ProductAndAgencyFromUrlPartsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductAndAgencyFromUrlParts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_url_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_url_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}}]}}]}}]}},...ProductFragmentDoc.definitions,...PriceFragmentDoc.definitions,...MarkdownFragmentDoc.definitions,...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<ProductAndAgencyFromUrlPartsQuery, ProductAndAgencyFromUrlPartsQueryVariables>;
export const SubdomainAgencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}}]}},...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<SubdomainAgencyQuery, SubdomainAgencyQueryVariables>;
export const SubdomainAgencyExtendedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgencyExtended"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}},{"kind":"Field","name":{"kind":"Name","value":"supported_payment_currencies"}}]}}]}}]}},...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<SubdomainAgencyExtendedQuery, SubdomainAgencyExtendedQueryVariables>;
export const SubdomainAgencyStripeAccountUpdateUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgencyStripeAccountUpdateUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account_update_url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubdomainAgencyStripeAccountUpdateUrlQuery, SubdomainAgencyStripeAccountUpdateUrlQueryVariables>;
export const AgencyThankYouPageSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thank_you_page_setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AgencyThankYouPageSettingQuery, AgencyThankYouPageSettingQueryVariables>;
export const ProductThankYouPageSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thank_you_page_setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductThankYouPageSettingQuery, ProductThankYouPageSettingQueryVariables>;
export const AgencyPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"page_definition_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}},...PageFragmentDoc.definitions,...Page_DefinitionFragmentDoc.definitions,...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<AgencyPagesQuery, AgencyPagesQueryVariables>;
export const ProductPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"page_definition_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}},...PageFragmentDoc.definitions,...Page_DefinitionFragmentDoc.definitions,...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<ProductPagesQuery, ProductPagesQueryVariables>;
export const PageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Page"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}},...PageFragmentDoc.definitions,...Page_DefinitionFragmentDoc.definitions,...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<PageQuery, PageQueryVariables>;
export const PageByUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageByUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_by_url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}},...PageFragmentDoc.definitions,...Page_DefinitionFragmentDoc.definitions,...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<PageByUrlQuery, PageByUrlQueryVariables>;
export const PageBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}}]}},...Page_BlockFragmentDoc.definitions,...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<PageBlockQuery, PageBlockQueryVariables>;
export const PageDefinitionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageDefinition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_definition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_definition"}}]}}]}},...Page_DefinitionFragmentDoc.definitions]} as unknown as DocumentNode<PageDefinitionQuery, PageDefinitionQueryVariables>;
export const PageBlockDefinitionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageBlockDefinition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_definition_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_block_definition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_definition_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block_definition"}}]}}]}},...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<PageBlockDefinitionQuery, PageBlockDefinitionQueryVariables>;
export const PageDefinitionsByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageDefinitionsByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_definitions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_definition"}}]}}]}},...Page_DefinitionFragmentDoc.definitions]} as unknown as DocumentNode<PageDefinitionsByNameQuery, PageDefinitionsByNameQueryVariables>;
export const PageDefinitionByUrlPathDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageDefinitionByUrlPath"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_definition_by_url_path"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url_path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_definition"}}]}}]}},...Page_DefinitionFragmentDoc.definitions]} as unknown as DocumentNode<PageDefinitionByUrlPathQuery, PageDefinitionByUrlPathQueryVariables>;
export const PageBlockDefinitionsByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageBlockDefinitionsByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_block_definitions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block_definition"}}]}}]}},...Page_Block_DefinitionFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<PageBlockDefinitionsByNameQuery, PageBlockDefinitionsByNameQueryVariables>;
export const CalculateTransactionFeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalculateTransactionFee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription_plan_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription_plan_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"calculate_fee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}]}]}}]}}]} as unknown as DocumentNode<CalculateTransactionFeeQuery, CalculateTransactionFeeQueryVariables>;
export const FormFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FormField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"form_field_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form_field"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"form_field_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"form_field"}}]}}]}},...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<FormFieldQuery, FormFieldQueryVariables>;
export const FormFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FormFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FormFieldFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form_fields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"form_field"}}]}}]}},...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<FormFieldsQuery, FormFieldsQueryVariables>;
export const CredentialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Credential"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credential"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credential_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"credential"}}]}}]}},...CredentialFragmentDoc.definitions,...Credential_TypeFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<CredentialQuery, CredentialQueryVariables>;
export const CredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Credentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CredentialFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"credential"}}]}}]}},...CredentialFragmentDoc.definitions,...Credential_TypeFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<CredentialsQuery, CredentialsQueryVariables>;
export const CredentialTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CredentialType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credential_type_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credential_type"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credential_type_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"credential_type"}}]}}]}},...Credential_TypeFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<CredentialTypeQuery, CredentialTypeQueryVariables>;
export const CredentialTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CredentialTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CredentialTypeFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credential_types"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"credential_type"}}]}}]}},...Credential_TypeFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions]} as unknown as DocumentNode<CredentialTypesQuery, CredentialTypesQueryVariables>;
export const IntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Integration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration"}}]}}]}},...IntegrationFragmentDoc.definitions]} as unknown as DocumentNode<IntegrationQuery, IntegrationQueryVariables>;
export const IntegrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Integrations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IntegrationFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integrations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration"}}]}}]}},...IntegrationFragmentDoc.definitions]} as unknown as DocumentNode<IntegrationsQuery, IntegrationsQueryVariables>;
export const IntegrationConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IntegrationConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration_config_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integration_config"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration_config_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration_config"}}]}}]}},...Integration_ConfigFragmentDoc.definitions]} as unknown as DocumentNode<IntegrationConfigQuery, IntegrationConfigQueryVariables>;
export const IntegrationConfigsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IntegrationConfigs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IntegrationConfigFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integration_configs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration_config"}}]}}]}},...Integration_ConfigFragmentDoc.definitions]} as unknown as DocumentNode<IntegrationConfigsQuery, IntegrationConfigsQueryVariables>;
export const IntegrationTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IntegrationType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integration_type_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integration_type"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integration_type_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration_type"}}]}}]}},...Integration_TypeFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions,...Credential_TypeFragmentDoc.definitions]} as unknown as DocumentNode<IntegrationTypeQuery, IntegrationTypeQueryVariables>;
export const IntegrationTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IntegrationTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IntegrationTypeFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integration_types"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"integration_type"}}]}}]}},...Integration_TypeFragmentDoc.definitions,...Form_FieldFragmentDoc.definitions,...Credential_TypeFragmentDoc.definitions]} as unknown as DocumentNode<IntegrationTypesQuery, IntegrationTypesQueryVariables>;