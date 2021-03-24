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

export type Query = {
  __typename?: 'Query';
  credential?: Maybe<Credential>;
  credentials?: Maybe<Array<Credential>>;
  page?: Maybe<Page>;
  page_by_url?: Maybe<Page>;
  pages?: Maybe<Array<Page>>;
  page_block?: Maybe<PageBlock>;
  page_blocks?: Maybe<Array<PageBlock>>;
  page_definition?: Maybe<PageDefinition>;
  page_definition_by_url_path?: Maybe<PageDefinition>;
  page_definitions?: Maybe<Array<PageDefinition>>;
  page_block_definition?: Maybe<PageBlockDefinition>;
  page_block_definitions?: Maybe<Array<PageBlockDefinition>>;
  country_codes: Array<Scalars['String']>;
  country_spec?: Maybe<CountrySpec>;
  exchange_rate?: Maybe<ExchangeRate>;
  current_user?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  customer?: Maybe<Customer>;
  customers?: Maybe<Array<Customer>>;
  agency?: Maybe<Agency>;
  agencies?: Maybe<Array<Agency>>;
  price?: Maybe<Price>;
  prices?: Maybe<Array<Price>>;
  stripe_account?: Maybe<StripeAccount>;
  product?: Maybe<Product>;
  products?: Maybe<Array<Product>>;
  subdomain?: Maybe<Subdomain>;
  subdomains?: Maybe<Array<Subdomain>>;
  subscription_plan?: Maybe<SubscriptionPlan>;
  subscription_plans?: Maybe<Array<SubscriptionPlan>>;
  transaction_fee?: Maybe<TransactionFee>;
  transaction_fees?: Maybe<Array<TransactionFee>>;
  image?: Maybe<Image>;
  images?: Maybe<Array<Image>>;
  markdown?: Maybe<Markdown>;
  markdowns?: Maybe<Array<Markdown>>;
  membership?: Maybe<Membership>;
  memberships?: Maybe<Array<Membership>>;
  theme?: Maybe<Theme>;
  themes?: Maybe<Array<Theme>>;
  order?: Maybe<Order>;
  orders?: Maybe<Array<Order>>;
  order_item?: Maybe<OrderItem>;
  order_items?: Maybe<Array<OrderItem>>;
  integration?: Maybe<Integration>;
  integrations?: Maybe<Array<Integration>>;
};


export type QueryCredentialArgs = {
  id: Scalars['ID'];
};


export type QueryCredentialsArgs = {
  filter: CredentialFilter;
};


export type QueryPageArgs = {
  id: Scalars['ID'];
};


export type QueryPage_By_UrlArgs = {
  url: Scalars['String'];
};


export type QueryPagesArgs = {
  filter: PageFilter;
};


export type QueryPage_BlockArgs = {
  id: Scalars['ID'];
};


export type QueryPage_BlocksArgs = {
  filter: PageBlockFilter;
};


export type QueryPage_DefinitionArgs = {
  id: Scalars['ID'];
};


export type QueryPage_Definition_By_Url_PathArgs = {
  url_path: Scalars['String'];
};


export type QueryPage_DefinitionsArgs = {
  filter: PageDefinitionFilter;
};


export type QueryPage_Block_DefinitionArgs = {
  id: Scalars['ID'];
};


export type QueryPage_Block_DefinitionsArgs = {
  filter: PageBlockDefinitionFilter;
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
};


export type QueryCustomerArgs = {
  id: Scalars['ID'];
};


export type QueryCustomersArgs = {
  filter: CustomerFilter;
};


export type QueryAgencyArgs = {
  id: Scalars['ID'];
};


export type QueryAgenciesArgs = {
  filter: AgencyFilter;
};


export type QueryPriceArgs = {
  id: Scalars['ID'];
};


export type QueryPricesArgs = {
  filter: PriceFilter;
};


export type QueryStripe_AccountArgs = {
  id: Scalars['ID'];
};


export type QueryProductArgs = {
  id: Scalars['ID'];
};


export type QueryProductsArgs = {
  filter: ProductFilter;
};


export type QuerySubdomainArgs = {
  id: Scalars['ID'];
};


export type QuerySubdomainsArgs = {
  filter: SubdomainFilter;
};


export type QuerySubscription_PlanArgs = {
  id: Scalars['ID'];
};


export type QuerySubscription_PlansArgs = {
  filter: SubscriptionPlanFilter;
};


export type QueryTransaction_FeeArgs = {
  id: Scalars['ID'];
};


export type QueryTransaction_FeesArgs = {
  filter: TransactionFeeFilter;
};


export type QueryImageArgs = {
  id: Scalars['ID'];
};


export type QueryImagesArgs = {
  filter: ImageFilter;
};


export type QueryMarkdownArgs = {
  id: Scalars['ID'];
};


export type QueryMarkdownsArgs = {
  filter: MarkdownFilter;
};


export type QueryMembershipArgs = {
  id: Scalars['ID'];
};


export type QueryMembershipsArgs = {
  filter: MembershipFilter;
};


export type QueryThemeArgs = {
  id: Scalars['ID'];
};


export type QueryThemesArgs = {
  filter: ThemeFilter;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryOrdersArgs = {
  filter: OrderFilter;
};


export type QueryOrder_ItemArgs = {
  id: Scalars['ID'];
};


export type QueryOrder_ItemsArgs = {
  filter: OrderItemFilter;
};


export type QueryIntegrationArgs = {
  id: Scalars['ID'];
};


export type QueryIntegrationsArgs = {
  filter: IntegrationFilter;
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
  delete_agency: DeleteAgencyResult;
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
};


export type MutationCreate_CredentialArgs = {
  agency_id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['Json'];
  type: Scalars['String'];
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
  after_id?: Maybe<Scalars['ID']>;
};


export type MutationUpdate_Page_BlockArgs = {
  page_block_id: Scalars['ID'];
  data?: Maybe<Scalars['Json']>;
  after_id?: Maybe<Scalars['ID']>;
};


export type MutationDelete_Page_BlockArgs = {
  page_block_id: Scalars['ID'];
};


export type MutationLog_InArgs = {
  email_address: Scalars['String'];
  password: Scalars['String'];
};


export type MutationStart_Sign_UpArgs = {
  email_address: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  redirect_url?: Maybe<Scalars['String']>;
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
  integration_id?: Maybe<Scalars['ID']>;
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
  integration_id?: Maybe<Scalars['ID']>;
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
  name: Scalars['String'];
  data: Scalars['Json'];
};


export type MutationUpdate_IntegrationArgs = {
  integration_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['Json']>;
};

export type SimpleResult = MutationResult & {
  __typename?: 'SimpleResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type Node = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type MutationResult = {
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type Connection = {
  edges: Array<Edge>;
};


export type ConnectionEdgesArgs = {
  ids?: Maybe<Array<Scalars['ID']>>;
};

export type Edge = {
  cursor?: Maybe<Scalars['String']>;
  node: Node;
};

export enum AccessLevel {
  Owner = 'OWNER',
  Manager = 'MANAGER',
  Agent = 'AGENT',
  Client = 'CLIENT',
  Public = 'PUBLIC'
}

export type Credential = Node & {
  __typename?: 'Credential';
  id: Scalars['ID'];
  name: Scalars['String'];
  data: Scalars['Json'];
  agency: Agency;
  type: Scalars['String'];
};

export type CredentialFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
};

export type CredentialMutationResult = MutationResult & {
  __typename?: 'CredentialMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  credential?: Maybe<Credential>;
};

export type FormField = Node & {
  __typename?: 'FormField';
  id: Scalars['ID'];
  name: Scalars['String'];
  label: Scalars['String'];
  type: Scalars['String'];
  default?: Maybe<Scalars['Json']>;
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

export type PageBlock = {
  __typename?: 'PageBlock';
  id: Scalars['ID'];
  page: Page;
  definition: PageBlockDefinition;
  data: Scalars['Json'];
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

export type Address = {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
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

export type BillingDetails = {
  __typename?: 'BillingDetails';
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type FraudDetails = {
  __typename?: 'FraudDetails';
  stripe_report?: Maybe<Scalars['String']>;
  user_report?: Maybe<Scalars['String']>;
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

export type Shipping = {
  __typename?: 'Shipping';
  address?: Maybe<Address>;
  carrier?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
};

export type BeginVisitResult = MutationResult & {
  __typename?: 'BeginVisitResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['String']>;
};

export type LogInResult = MutationResult & {
  __typename?: 'LogInResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['String']>;
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

export type ExchangeRate = {
  __typename?: 'ExchangeRate';
  date: Scalars['DateTime'];
  currency: Scalars['String'];
  rate_eur: Scalars['Float'];
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
};

export type UserFilter = {
  name?: Maybe<Scalars['String']>;
  email_address?: Maybe<Scalars['String']>;
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
};


export type AgencyStripe_AccountArgs = {
  livemode?: Maybe<Scalars['Boolean']>;
};


export type AgencyProductsArgs = {
  filter?: Maybe<ProductFilter>;
};


export type AgencyPagesArgs = {
  filter?: Maybe<PageFilter>;
};

export type AgencyFilter = {
  name?: Maybe<Scalars['String']>;
};

export type CreateAgencyResult = MutationResult & {
  __typename?: 'CreateAgencyResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  agency?: Maybe<Agency>;
  stripe_verification_url?: Maybe<Scalars['String']>;
};

export type DeleteAgencyResult = MutationResult & {
  __typename?: 'DeleteAgencyResult';
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

export type Price = Node & {
  __typename?: 'Price';
  id: Scalars['ID'];
  name: Scalars['String'];
  status: Scalars['String'];
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
};

export type PriceMutationResult = MutationResult & {
  __typename?: 'PriceMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  price?: Maybe<Price>;
};

export type CreateStripeCheckoutSessionResult = MutationResult & {
  __typename?: 'CreateStripeCheckoutSessionResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  checkout_session_id?: Maybe<Scalars['String']>;
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

export type StripeCapabilities = {
  __typename?: 'StripeCapabilities';
  card_payments?: Maybe<Scalars['String']>;
  transfers?: Maybe<Scalars['String']>;
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

export type StripeBranding = {
  __typename?: 'StripeBranding';
  icon?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  primary_color?: Maybe<Scalars['String']>;
  secondary_color?: Maybe<Scalars['String']>;
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

export type StripeCurrencyBalance = {
  __typename?: 'StripeCurrencyBalance';
  amount: Scalars['Int'];
  currency: Scalars['String'];
  source_types: StripeBalanceSource;
};

export type StripeBalanceSource = {
  __typename?: 'StripeBalanceSource';
  bank_account?: Maybe<Scalars['Int']>;
  card?: Maybe<Scalars['Int']>;
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

export type Product = Node & {
  __typename?: 'Product';
  id: Scalars['ID'];
  name: Scalars['String'];
  url_name: Scalars['String'];
  status: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  default_price?: Maybe<Price>;
  agency: Agency;
  prices?: Maybe<Array<Price>>;
  image_logo?: Maybe<Image>;
  image_hero?: Maybe<Image>;
  markdown_description?: Maybe<Markdown>;
  integration?: Maybe<Integration>;
  pages?: Maybe<Array<Page>>;
  settings: ProductSettings;
};


export type ProductPricesArgs = {
  filter?: Maybe<PriceFilter>;
};


export type ProductPagesArgs = {
  filter?: Maybe<PageFilter>;
};

export type ProductFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
  url_name?: Maybe<Scalars['String']>;
};

export type ProductMutationResult = MutationResult & {
  __typename?: 'ProductMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
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

export type Image = Node & {
  __typename?: 'Image';
  id: Scalars['ID'];
  name: Scalars['String'];
  data: Scalars['String'];
  color: Scalars['String'];
  agency?: Maybe<Agency>;
  access: AccessLevel;
};

export type ImageInput = {
  name: Scalars['String'];
  data: Scalars['String'];
  color: Scalars['String'];
};

export type ImageFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
};

export type ImageMutationResult = MutationResult & {
  __typename?: 'ImageMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  image?: Maybe<Image>;
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

export type UpdateThemeResult = MutationResult & {
  __typename?: 'UpdateThemeResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  theme?: Maybe<Theme>;
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

export type OrderFilter = {
  customer_id?: Maybe<Scalars['ID']>;
  stripe_account_id?: Maybe<Scalars['ID']>;
  stripe_checkout_session_id_ext?: Maybe<Scalars['ID']>;
};

export type OrderMutationResult = MutationResult & {
  __typename?: 'OrderMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  order?: Maybe<Order>;
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

export type Integration = Node & {
  __typename?: 'Integration';
  id: Scalars['ID'];
  name: Scalars['String'];
  data: Scalars['Json'];
  agency: Agency;
  credential?: Maybe<Credential>;
};

export type IntegrationFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
};

export type IntegrationMutationResult = MutationResult & {
  __typename?: 'IntegrationMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  integration?: Maybe<Integration>;
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
  & Pick<Price, 'id' | 'name' | 'unit_amount' | 'currency' | 'type' | 'recurring_interval' | 'recurring_interval_count'>
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
  & Pick<Product, 'id' | 'name' | 'url_name' | 'description' | 'duration' | 'status'>
  & { default_price?: Maybe<(
    { __typename?: 'Price' }
    & PriceFragment
  )>, prices?: Maybe<Array<(
    { __typename?: 'Price' }
    & PriceFragment
  )>>, image_logo?: Maybe<(
    { __typename?: 'Image' }
    & ImageFragment
  )>, image_hero?: Maybe<(
    { __typename?: 'Image' }
    & ImageFragment
  )>, markdown_description?: Maybe<(
    { __typename?: 'Markdown' }
    & MarkdownFragment
  )>, agency: (
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
  ), settings: (
    { __typename?: 'ProductSettings' }
    & Pick<ProductSettings, 'id'>
  ) }
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
  & Pick<Agency, 'id' | 'name' | 'livemode'>
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
  & Pick<FormField, 'id' | 'name' | 'label' | 'type' | 'default'>
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
    & PriceFragment
  ) }
);

export type OrderFragment = (
  { __typename?: 'Order' }
  & Pick<Order, 'id' | 'state' | 'error' | 'ordered_at' | 'processed_at'>
  & { customer: (
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
  ), items: Array<(
    { __typename?: 'OrderItem' }
    & Order_ItemFragment
  )>, stripe_account: (
    { __typename?: 'StripeAccount' }
    & Pick<StripeAccount, 'id'>
  ), stripe_checkout_session: (
    { __typename?: 'StripeCheckoutSession' }
    & Pick<StripeCheckoutSession, 'id'>
  ) }
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

export type AgencyProductsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyProductsQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { products?: Maybe<Array<(
      { __typename?: 'Product' }
      & ProductFragment
    )>> }
  )> }
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
}>;


export type ProductsQuery = (
  { __typename?: 'Query' }
  & { products?: Maybe<Array<(
    { __typename?: 'Product' }
    & ProductFragment
  )>> }
);

export type OrderQueryVariables = Exact<{
  order_id: Scalars['ID'];
}>;


export type OrderQuery = (
  { __typename?: 'Query' }
  & { order?: Maybe<(
    { __typename?: 'Order' }
    & OrderFragment
  )> }
);

export type OrdersQueryVariables = Exact<{
  filter: OrderFilter;
}>;


export type OrdersQuery = (
  { __typename?: 'Query' }
  & { orders?: Maybe<Array<(
    { __typename?: 'Order' }
    & OrderFragment
  )>> }
);

export type OrderItemQueryVariables = Exact<{
  order_item_id: Scalars['ID'];
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
      & { products?: Maybe<Array<(
        { __typename?: 'Product' }
        & ProductFragment
      )>> }
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

export const Stripe_AccountFragmentDoc: DocumentNode<Stripe_AccountFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_account"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"business_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mcc"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"product_description"}},{"kind":"Field","name":{"kind":"Name","value":"support_address"}},{"kind":"Field","name":{"kind":"Name","value":"support_email"}},{"kind":"Field","name":{"kind":"Name","value":"support_phone"}},{"kind":"Field","name":{"kind":"Name","value":"support_url"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"business_type"}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card_payments"}},{"kind":"Field","name":{"kind":"Name","value":"transfers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_deadline"}},{"kind":"Field","name":{"kind":"Name","value":"disabled_reason"}},{"kind":"Field","name":{"kind":"Name","value":"currently_due"}},{"kind":"Field","name":{"kind":"Name","value":"eventually_due"}},{"kind":"Field","name":{"kind":"Name","value":"past_due"}},{"kind":"Field","name":{"kind":"Name","value":"pending_verification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"primary_color"}},{"kind":"Field","name":{"kind":"Name","value":"secondary_color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"charges_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency"}},{"kind":"Field","name":{"kind":"Name","value":"details_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"payouts_enabled"}}]}}]};
export const Balance_TransactionFragmentDoc: DocumentNode<Balance_TransactionFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"balance_transaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"available_on"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"exchange_rate"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"fee_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"application"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"net"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reporting_category"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]};
export const AddressFragmentDoc: DocumentNode<AddressFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]};
export const ChargeFragmentDoc: DocumentNode<ChargeFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"charge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"authorization_code"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculated_statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"captured"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"disputed"}},{"kind":"Field","name":{"kind":"Name","value":"failure_code"}},{"kind":"Field","name":{"kind":"Name","value":"failure_message"}},{"kind":"Field","name":{"kind":"Name","value":"fraud_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_report"}},{"kind":"Field","name":{"kind":"Name","value":"user_report"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network_status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"risk_level"}},{"kind":"Field","name":{"kind":"Name","value":"risk_score"}},{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seller_message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_number"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_url"}},{"kind":"Field","name":{"kind":"Name","value":"refunded"}},{"kind":"Field","name":{"kind":"Name","value":"source_transfer"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}},...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions]};
export const Stripe_CustomerFragmentDoc: DocumentNode<Stripe_CustomerFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"delinquent"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_prefix"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"next_invoice_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"preferred_locales"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},...AddressFragmentDoc.definitions]};
export const Payment_IntentFragmentDoc: DocumentNode<Payment_IntentFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"payment_intent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentIntent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"cancellation_reason"}},{"kind":"Field","name":{"kind":"Name","value":"capture_method"}},{"kind":"Field","name":{"kind":"Name","value":"charges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"charge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmation_method"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"on_behalf_of"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"setup_future_usage"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}},...ChargeFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions]};
export const PriceFragmentDoc: DocumentNode<PriceFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Price"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval_count"}}]}}]};
export const ImageFragmentDoc: DocumentNode<ImageFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"image"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}}]};
export const MarkdownFragmentDoc: DocumentNode<MarkdownFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"markdown"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Markdown"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]};
export const ProductFragmentDoc: DocumentNode<ProductFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url_name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"default_price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"markdown_description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},...PriceFragmentDoc.definitions,...ImageFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]};
export const Transaction_FeeFragmentDoc: DocumentNode<Transaction_FeeFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"transaction_fee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionFee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"transaction_amount_upper_bound"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]};
export const Subscription_PlanFragmentDoc: DocumentNode<Subscription_PlanFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subscription_plan"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionPlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"transaction_fees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"transaction_fee"}}]}}]}},...Transaction_FeeFragmentDoc.definitions]};
export const UserFragmentDoc: DocumentNode<UserFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"user"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}}]};
export const CustomerFragmentDoc: DocumentNode<CustomerFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_stripe_customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}}]}}]}},...Stripe_CustomerFragmentDoc.definitions,...UserFragmentDoc.definitions]};
export const ThemeFragmentDoc: DocumentNode<ThemeFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"theme"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Theme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"color_primary"}},{"kind":"Field","name":{"kind":"Name","value":"color_secondary"}},{"kind":"Field","name":{"kind":"Name","value":"color_accent"}},{"kind":"Field","name":{"kind":"Name","value":"color_background"}},{"kind":"Field","name":{"kind":"Name","value":"color_surface"}},{"kind":"Field","name":{"kind":"Name","value":"color_error"}},{"kind":"Field","name":{"kind":"Name","value":"color_success"}}]}},...ImageFragmentDoc.definitions]};
export const AgencyFragmentDoc: DocumentNode<AgencyFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"agency"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agency"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},...ThemeFragmentDoc.definitions]};
export const MembershipFragmentDoc: DocumentNode<MembershipFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Membership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},...UserFragmentDoc.definitions]};
export const SubdomainFragmentDoc: DocumentNode<SubdomainFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subdomain"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subdomain"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}},...AgencyFragmentDoc.definitions,...MembershipFragmentDoc.definitions]};
export const Page_DefinitionFragmentDoc: DocumentNode<Page_DefinitionFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"page_definition"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageDefinition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url_path"}}]}}]};
export const Form_FieldFragmentDoc: DocumentNode<Form_FieldFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"form_field"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"default"}}]}}]};
export const Page_Block_DefinitionFragmentDoc: DocumentNode<Page_Block_DefinitionFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"page_block_definition"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageBlockDefinition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"form_field"}}]}}]}},...Form_FieldFragmentDoc.definitions]};
export const Page_BlockFragmentDoc: DocumentNode<Page_BlockFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"page_block"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"definition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block_definition"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},...Page_Block_DefinitionFragmentDoc.definitions]};
export const PageFragmentDoc: DocumentNode<PageFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"page"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url_path"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"definition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_definition"}}]}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}},...Page_DefinitionFragmentDoc.definitions,...Page_BlockFragmentDoc.definitions]};
export const Line_ItemFragmentDoc: DocumentNode<Line_ItemFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"line_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]};
export const Stripe_Checkout_SessionFragmentDoc: DocumentNode<Stripe_Checkout_SessionFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_checkout_session"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCheckoutSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"allow_promotion_codes"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"billing_address_collection"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_url"}},{"kind":"Field","name":{"kind":"Name","value":"client_reference_id"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_email"}},{"kind":"Field","name":{"kind":"Name","value":"line_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"line_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"payment_status"}},{"kind":"Field","name":{"kind":"Name","value":"submit_type"}},{"kind":"Field","name":{"kind":"Name","value":"success_url"}}]}},...Line_ItemFragmentDoc.definitions]};
export const Order_ItemFragmentDoc: DocumentNode<Order_ItemFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"order_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_line_item_id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"processed_at"}}]}},...PriceFragmentDoc.definitions]};
export const OrderFragmentDoc: DocumentNode<OrderFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_checkout_session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ordered_at"}},{"kind":"Field","name":{"kind":"Name","value":"processed_at"}}]}},...Order_ItemFragmentDoc.definitions]};
export const BeginVisitDocument: DocumentNode<BeginVisitMutation, BeginVisitMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BeginVisit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"begin_visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]};
export const EndVisitDocument: DocumentNode<EndVisitMutation, EndVisitMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndVisit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"end_visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const LogInDocument: DocumentNode<LogInMutation, LogInMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"log_in"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]};
export const LogOutDocument: DocumentNode<LogOutMutation, LogOutMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"log_out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const VerifyPasswordResetDocument: DocumentNode<VerifyPasswordResetMutation, VerifyPasswordResetMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verify_password_reset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verification_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const VerifySignUpDocument: DocumentNode<VerifySignUpMutation, VerifySignUpMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifySignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verify_sign_up"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verification_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const StartPasswordResetDocument: DocumentNode<StartPasswordResetMutation, StartPasswordResetMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start_password_reset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirect_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const StartSignUpDocument: DocumentNode<StartSignUpMutation, StartSignUpMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start_sign_up"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirect_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const CreateAgencyDocument: DocumentNode<CreateAgencyMutation, CreateAgencyMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"livemode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"return_url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"livemode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"livemode"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdomain_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"country_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"return_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"return_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_verification_url"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]};
export const CreateProductDocument: DocumentNode<CreateProductMutation, CreateProductMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}}]}},...ProductFragmentDoc.definitions]};
export const UpdateProductDocument: DocumentNode<UpdateProductMutation, UpdateProductMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_price_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_price_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_price_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}}]}},...ProductFragmentDoc.definitions]};
export const DeleteProductDocument: DocumentNode<DeleteProductMutation, DeleteProductMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]};
export const CreatePriceDocument: DocumentNode<CreatePriceMutation, CreatePriceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval_count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_price"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"unit_amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"recurring_interval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval"}}},{"kind":"Argument","name":{"kind":"Name","value":"recurring_interval_count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval_count"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}}]}}]}},...PriceFragmentDoc.definitions]};
export const CreateCustomerDocument: DocumentNode<CreateCustomerMutation, CreateCustomerMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}},...CustomerFragmentDoc.definitions]};
export const UpdateCustomerDocument: DocumentNode<UpdateCustomerMutation, UpdateCustomerMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}},...CustomerFragmentDoc.definitions]};
export const DeleteCustomerDocument: DocumentNode<DeleteCustomerMutation, DeleteCustomerMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]};
export const CreateAgencyThankYouPageSettingDocument: DocumentNode<CreateAgencyThankYouPageSettingMutation, CreateAgencyThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const UpdateAgencyThankYouPageSettingDocument: DocumentNode<UpdateAgencyThankYouPageSettingMutation, UpdateAgencyThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const DeleteAgencyThankYouPageSettingDocument: DocumentNode<DeleteAgencyThankYouPageSettingMutation, DeleteAgencyThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const CreateProductThankYouPageSettingDocument: DocumentNode<CreateProductThankYouPageSettingMutation, CreateProductThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProductThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_product_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const UpdateProductThankYouPageSettingDocument: DocumentNode<UpdateProductThankYouPageSettingMutation, UpdateProductThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_product_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const DeleteProductThankYouPageSettingDocument: DocumentNode<DeleteProductThankYouPageSettingMutation, DeleteProductThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProductThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_product_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const UpdatePageDocument: DocumentNode<UpdatePageMutation, UpdatePageMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"access"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessLevel"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"access"},"value":{"kind":"Variable","name":{"kind":"Name","value":"access"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}}]}},...PageFragmentDoc.definitions]};
export const CreatePageBlockDocument: DocumentNode<CreatePageBlockMutation, CreatePageBlockMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePageBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_definition_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_page_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"page_block_definition_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_definition_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"page_block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}}]}}]}},...Page_BlockFragmentDoc.definitions]};
export const UpdatePageBlockDocument: DocumentNode<UpdatePageBlockMutation, UpdatePageBlockMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePageBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_page_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page_block_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"page_block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}}]}}]}},...Page_BlockFragmentDoc.definitions]};
export const DeletePageBlockDocument: DocumentNode<DeletePageBlockMutation, DeletePageBlockMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePageBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_page_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page_block_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"page_block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}}]}}]}},...Page_BlockFragmentDoc.definitions]};
export const CurrentUserDocument: DocumentNode<CurrentUserQuery, CurrentUserQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}}]}},...UserFragmentDoc.definitions,...MembershipFragmentDoc.definitions]};
export const CountriesDocument: DocumentNode<CountriesQuery, CountriesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country_codes"}}]}}]};
export const CountrySpecDocument: DocumentNode<CountrySpecQuery, CountrySpecQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CountrySpec"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country_spec"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"country_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency"}},{"kind":"Field","name":{"kind":"Name","value":"supported_payment_currencies"}},{"kind":"Field","name":{"kind":"Name","value":"supported_payment_methods"}},{"kind":"Field","name":{"kind":"Name","value":"supported_transfer_countries"}}]}}]}}]};
export const ServicesAgreementDocument: DocumentNode<ServicesAgreementQuery, ServicesAgreementQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServicesAgreement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markdowns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"Services Agreement","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}}]}},...MarkdownFragmentDoc.definitions]};
export const AgencyStripeAccountDocument: DocumentNode<AgencyStripeAccountQuery, AgencyStripeAccountQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_account"}}]}}]}}]}},...Stripe_AccountFragmentDoc.definitions]};
export const AgencyStripeAccountUpdateUrlDocument: DocumentNode<AgencyStripeAccountUpdateUrlQuery, AgencyStripeAccountUpdateUrlQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountUpdateUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"account_update_url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]};
export const AgencyStripeAccountBalanceDocument: DocumentNode<AgencyStripeAccountBalanceQuery, AgencyStripeAccountBalanceQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"connect_reserved"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}}]}}]}}]}}]}}]};
export const AgencyStripeAccountBalanceTransactionsDocument: DocumentNode<AgencyStripeAccountBalanceTransactionsQuery, AgencyStripeAccountBalanceTransactionsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalanceTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}}]}}]}}]}},...Balance_TransactionFragmentDoc.definitions]};
export const AgencyStripeAccountPaymentIntentsDocument: DocumentNode<AgencyStripeAccountPaymentIntentsQuery, AgencyStripeAccountPaymentIntentsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountPaymentIntents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}}]}}]}}]}},...Payment_IntentFragmentDoc.definitions]};
export const CustomerDocument: DocumentNode<CustomerQuery, CustomerQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Customer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}},...CustomerFragmentDoc.definitions]};
export const AgencyCustomersDocument: DocumentNode<AgencyCustomersQuery, AgencyCustomersQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}}]}},...CustomerFragmentDoc.definitions]};
export const AgencySubscriptionPlanDocument: DocumentNode<AgencySubscriptionPlanQuery, AgencySubscriptionPlanQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencySubscriptionPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription_plan"}}]}}]}}]}},...Subscription_PlanFragmentDoc.definitions]};
export const AgencyDocument: DocumentNode<AgencyQuery, AgencyQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Agency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}},...AgencyFragmentDoc.definitions]};
export const AgenciesDocument: DocumentNode<AgenciesQuery, AgenciesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Agencies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AgencyFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agencies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}},...AgencyFragmentDoc.definitions]};
export const CurrentUserAgenciesDocument: DocumentNode<CurrentUserAgenciesQuery, CurrentUserAgenciesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUserAgencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_account"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription_plan"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},...AgencyFragmentDoc.definitions,...Stripe_AccountFragmentDoc.definitions,...Subscription_PlanFragmentDoc.definitions,...MembershipFragmentDoc.definitions]};
export const SubdomainPublicDocument: DocumentNode<SubdomainPublicQuery, SubdomainPublicQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainPublic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}}]}}]}}]}},...ThemeFragmentDoc.definitions]};
export const AgencyProductsDocument: DocumentNode<AgencyProductsQuery, AgencyProductsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}}]}},...ProductFragmentDoc.definitions]};
export const ProductDocument: DocumentNode<ProductQuery, ProductQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Product"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}},...ProductFragmentDoc.definitions]};
export const ProductsDocument: DocumentNode<ProductsQuery, ProductsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Products"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}},...ProductFragmentDoc.definitions]};
export const OrderDocument: DocumentNode<OrderQuery, OrderQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}}]}}]}},...OrderFragmentDoc.definitions]};
export const OrdersDocument: DocumentNode<OrdersQuery, OrdersQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Orders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}}]}}]}},...OrderFragmentDoc.definitions]};
export const OrderItemDocument: DocumentNode<OrderItemQuery, OrderItemQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_item_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order_item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_item_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}}]}},...Order_ItemFragmentDoc.definitions]};
export const OrderItemsDocument: DocumentNode<OrderItemsQuery, OrderItemsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItemFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order_items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}}]}},...Order_ItemFragmentDoc.definitions]};
export const ProductAndAgencyFromUrlPartsDocument: DocumentNode<ProductAndAgencyFromUrlPartsQuery, ProductAndAgencyFromUrlPartsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductAndAgencyFromUrlParts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_url_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_url_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}}]}}]}}]}},...ProductFragmentDoc.definitions,...AgencyFragmentDoc.definitions]};
export const SubdomainAgencyDocument: DocumentNode<SubdomainAgencyQuery, SubdomainAgencyQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}}]}}]}},...AgencyFragmentDoc.definitions,...ProductFragmentDoc.definitions]};
export const SubdomainAgencyStripeAccountUpdateUrlDocument: DocumentNode<SubdomainAgencyStripeAccountUpdateUrlQuery, SubdomainAgencyStripeAccountUpdateUrlQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgencyStripeAccountUpdateUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account_update_url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]};
export const AgencyThankYouPageSettingDocument: DocumentNode<AgencyThankYouPageSettingQuery, AgencyThankYouPageSettingQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thank_you_page_setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]};
export const ProductThankYouPageSettingDocument: DocumentNode<ProductThankYouPageSettingQuery, ProductThankYouPageSettingQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thank_you_page_setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]};
export const AgencyPagesDocument: DocumentNode<AgencyPagesQuery, AgencyPagesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"page_definition_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}},...PageFragmentDoc.definitions]};
export const ProductPagesDocument: DocumentNode<ProductPagesQuery, ProductPagesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"page_definition_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}},...PageFragmentDoc.definitions]};
export const PageDocument: DocumentNode<PageQuery, PageQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Page"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}},...PageFragmentDoc.definitions]};
export const PageByUrlDocument: DocumentNode<PageByUrlQuery, PageByUrlQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageByUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_by_url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page"}}]}}]}},...PageFragmentDoc.definitions]};
export const PageBlockDocument: DocumentNode<PageBlockQuery, PageBlockQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block"}}]}}]}},...Page_BlockFragmentDoc.definitions]};
export const PageDefinitionDocument: DocumentNode<PageDefinitionQuery, PageDefinitionQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageDefinition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_definition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_definition_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_definition"}}]}}]}},...Page_DefinitionFragmentDoc.definitions]};
export const PageBlockDefinitionDocument: DocumentNode<PageBlockDefinitionQuery, PageBlockDefinitionQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageBlockDefinition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page_block_definition_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_block_definition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page_block_definition_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block_definition"}}]}}]}},...Page_Block_DefinitionFragmentDoc.definitions]};
export const PageDefinitionsByNameDocument: DocumentNode<PageDefinitionsByNameQuery, PageDefinitionsByNameQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageDefinitionsByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_definitions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_definition"}}]}}]}},...Page_DefinitionFragmentDoc.definitions]};
export const PageDefinitionByUrlPathDocument: DocumentNode<PageDefinitionByUrlPathQuery, PageDefinitionByUrlPathQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageDefinitionByUrlPath"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_definition_by_url_path"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url_path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_definition"}}]}}]}},...Page_DefinitionFragmentDoc.definitions]};
export const PageBlockDefinitionsByNameDocument: DocumentNode<PageBlockDefinitionsByNameQuery, PageBlockDefinitionsByNameQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageBlockDefinitionsByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page_block_definitions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"page_block_definition"}}]}}]}},...Page_Block_DefinitionFragmentDoc.definitions]};
export const CalculateTransactionFeeDocument: DocumentNode<CalculateTransactionFeeQuery, CalculateTransactionFeeQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalculateTransactionFee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription_plan_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription_plan_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"calculate_fee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}]}]}}]}}]};