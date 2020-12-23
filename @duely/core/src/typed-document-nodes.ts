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
  /** Date custom scalar type */
  Date: any;
};

export type Query = {
  __typename?: 'Query';
  country_codes?: Maybe<Array<Scalars['String']>>;
  current_user?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  agency?: Maybe<Agency>;
  agencies?: Maybe<Array<Agency>>;
  price?: Maybe<Price>;
  prices?: Maybe<Array<Price>>;
  stripe_account?: Maybe<StripeAccount>;
  service?: Maybe<Service>;
  services?: Maybe<Array<Service>>;
  service_variant?: Maybe<ServiceVariant>;
  service_variants?: Maybe<Array<ServiceVariant>>;
  subdomain?: Maybe<Subdomain>;
  subdomains?: Maybe<Array<Subdomain>>;
  image?: Maybe<Image>;
  images?: Maybe<Array<Image>>;
  markdown?: Maybe<Markdown>;
  markdowns?: Maybe<Array<Markdown>>;
  membership?: Maybe<Membership>;
  memberships?: Maybe<Array<Membership>>;
  theme?: Maybe<Theme>;
  themes?: Maybe<Array<Theme>>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  filter: UserFilter;
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


export type QueryServiceArgs = {
  id: Scalars['ID'];
};


export type QueryServicesArgs = {
  filter: ServiceFilter;
};


export type QueryService_VariantArgs = {
  id: Scalars['ID'];
};


export type QueryService_VariantsArgs = {
  filter: ServiceVariantFilter;
};


export type QuerySubdomainArgs = {
  id: Scalars['ID'];
};


export type QuerySubdomainsArgs = {
  filter: SubdomainFilter;
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

export type Mutation = {
  __typename?: 'Mutation';
  begin_visit: BeginVisitResult;
  end_visit: SimpleResult;
  log_in: LogInResult;
  log_out: SimpleResult;
  start_sign_up: SimpleResult;
  verify_sign_up: SimpleResult;
  start_password_reset: SimpleResult;
  verify_password_reset: SimpleResult;
  create_agency: CreateAgencyResult;
  delete_agency: DeleteAgencyResult;
  create_agency_thank_you_page_setting: AgencyThankYouPageSettingMutationResult;
  update_agency_thank_you_page_setting: AgencyThankYouPageSettingMutationResult;
  delete_agency_thank_you_page_setting: AgencyThankYouPageSettingMutationResult;
  create_price: PriceMutationResult;
  update_price: PriceMutationResult;
  delete_price: PriceMutationResult;
  create_stripe_checkout_session: CreateStripeCheckoutSessionResult;
  create_service: ServiceMutationResult;
  update_service: ServiceMutationResult;
  delete_service: ServiceMutationResult;
  create_service_thank_you_page_setting: ServiceThankYouPageSettingMutationResult;
  update_service_thank_you_page_setting: ServiceThankYouPageSettingMutationResult;
  delete_service_thank_you_page_setting: ServiceThankYouPageSettingMutationResult;
  create_service_variant: ServiceVariantMutationResult;
  update_service_variant: ServiceVariantMutationResult;
  delete_service_variant: ServiceVariantMutationResult;
  create_image: ImageMutationResult;
  update_image: ImageMutationResult;
  create_markdown: MarkdownMutationResult;
  update_markdown: MarkdownMutationResult;
  update_theme: UpdateThemeResult;
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


export type MutationCreate_AgencyArgs = {
  name: Scalars['String'];
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
  service_variant_id: Scalars['ID'];
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
  success_url?: Maybe<Scalars['String']>;
  cancel_url?: Maybe<Scalars['String']>;
};


export type MutationCreate_ServiceArgs = {
  agency_id: Scalars['ID'];
  name: Scalars['String'];
  url_name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  markdown_description_id?: Maybe<Scalars['ID']>;
  image_logo?: Maybe<ImageInput>;
  image_logo_id?: Maybe<Scalars['ID']>;
  image_hero?: Maybe<ImageInput>;
  image_hero_id?: Maybe<Scalars['ID']>;
  status?: Maybe<Scalars['String']>;
};


export type MutationUpdate_ServiceArgs = {
  service_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  url_name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  markdown_description_id?: Maybe<Scalars['ID']>;
  image_logo?: Maybe<ImageInput>;
  image_logo_id?: Maybe<Scalars['ID']>;
  image_hero?: Maybe<ImageInput>;
  image_hero_id?: Maybe<Scalars['ID']>;
  default_price_id?: Maybe<Scalars['ID']>;
  status?: Maybe<Scalars['String']>;
};


export type MutationDelete_ServiceArgs = {
  service_id: Scalars['ID'];
};


export type MutationCreate_Service_Thank_You_Page_SettingArgs = {
  service_id: Scalars['ID'];
  url: Scalars['String'];
};


export type MutationUpdate_Service_Thank_You_Page_SettingArgs = {
  setting_id: Scalars['ID'];
  url: Scalars['String'];
};


export type MutationDelete_Service_Thank_You_Page_SettingArgs = {
  setting_id: Scalars['ID'];
};


export type MutationCreate_Service_VariantArgs = {
  service_id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  markdown_description_id?: Maybe<Scalars['ID']>;
  image_logo?: Maybe<ImageInput>;
  image_logo_id?: Maybe<Scalars['ID']>;
  image_hero?: Maybe<ImageInput>;
  status?: Maybe<Scalars['String']>;
};


export type MutationUpdate_Service_VariantArgs = {
  service_variant_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  default_price_id?: Maybe<Scalars['ID']>;
  markdown_description_id?: Maybe<Scalars['ID']>;
  image_logo?: Maybe<ImageInput>;
  image_logo_id?: Maybe<Scalars['ID']>;
  image_hero?: Maybe<ImageInput>;
  status?: Maybe<Scalars['String']>;
};


export type MutationDelete_Service_VariantArgs = {
  service_variant_id: Scalars['ID'];
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
  created?: Maybe<Scalars['Date']>;
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
  canceled_at?: Maybe<Scalars['Date']>;
  cancellation_reason?: Maybe<Scalars['String']>;
  capture_method?: Maybe<Scalars['String']>;
  charges?: Maybe<Array<Maybe<Charge>>>;
  confirmation_method?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['Date']>;
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

export type Agency = Node & {
  __typename?: 'Agency';
  id: Scalars['ID'];
  name: Scalars['String'];
  stripe_account: StripeAccount;
  subdomain: Subdomain;
  theme: Theme;
  services?: Maybe<Array<Service>>;
  settings: AgencySettings;
};


export type AgencyServicesArgs = {
  filter?: Maybe<ServiceFilter>;
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
  service_variant: ServiceVariant;
};

export type PriceFilter = {
  service_variant_id?: Maybe<Scalars['ID']>;
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
  account_update_url: StripeAccountLink;
  balance: StripeBalance;
  balance_transactions: Array<BalanceTransaction>;
  payment_intents: Array<PaymentIntent>;
  customers: Array<StripeCustomer>;
  business_profile: BusinessProfile;
  business_type?: Maybe<Scalars['String']>;
  capabilities: StripeCapabilities;
  requirements: StripeRequirements;
  settings: StripeSettings;
  charges_enabled: Scalars['Boolean'];
  country: Scalars['String'];
  created: Scalars['Date'];
  default_currency?: Maybe<Scalars['String']>;
  details_submitted: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  payouts_enabled: Scalars['Boolean'];
};


export type StripeAccountBalance_TransactionsArgs = {
  payout_id?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
  available_on?: Maybe<Scalars['Date']>;
  created?: Maybe<Scalars['Date']>;
  currency?: Maybe<Scalars['String']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type StripeAccountPayment_IntentsArgs = {
  customer_id?: Maybe<Scalars['ID']>;
  created?: Maybe<Scalars['Date']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type StripeAccountCustomersArgs = {
  email?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['Date']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
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
  created: Scalars['Date'];
  expires_at: Scalars['Date'];
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
  created?: Maybe<Scalars['Date']>;
  currency?: Maybe<Scalars['String']>;
  delinquent?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  invoice_prefix?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  next_invoice_sequence?: Maybe<Scalars['Int']>;
  phone?: Maybe<Scalars['String']>;
  preferred_locales?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type BalanceTransaction = {
  __typename?: 'BalanceTransaction';
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  amount: Scalars['Int'];
  available_on: Scalars['Date'];
  created: Scalars['Date'];
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

export type Service = Node & {
  __typename?: 'Service';
  id: Scalars['ID'];
  name: Scalars['String'];
  url_name: Scalars['String'];
  status: Scalars['String'];
  agency: Agency;
  default_variant: ServiceVariant;
  variants?: Maybe<Array<ServiceVariant>>;
  settings: ServiceSettings;
};


export type ServiceVariantsArgs = {
  filter?: Maybe<ServiceVariantFilter>;
};

export type ServiceFilter = {
  name?: Maybe<Scalars['String']>;
  agency_id?: Maybe<Scalars['ID']>;
  url_name?: Maybe<Scalars['String']>;
};

export type ServiceMutationResult = MutationResult & {
  __typename?: 'ServiceMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  service?: Maybe<Service>;
};

export type ServiceSettings = {
  __typename?: 'ServiceSettings';
  id: Scalars['ID'];
  thank_you_page_setting?: Maybe<ServiceThankYouPageSetting>;
};

export type ServiceThankYouPageSetting = {
  __typename?: 'ServiceThankYouPageSetting';
  id: Scalars['ID'];
  url: Scalars['String'];
  agency_setting: AgencyThankYouPageSetting;
};

export type ServiceThankYouPageSettingMutationResult = MutationResult & {
  __typename?: 'ServiceThankYouPageSettingMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  setting?: Maybe<ServiceThankYouPageSetting>;
};

export type ServiceVariant = Node & {
  __typename?: 'ServiceVariant';
  id: Scalars['ID'];
  name: Scalars['String'];
  status: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  default_price?: Maybe<Price>;
  service: Service;
  prices?: Maybe<Array<Price>>;
  image_logo?: Maybe<Image>;
  image_hero?: Maybe<Image>;
  markdown_description?: Maybe<Markdown>;
};


export type ServiceVariantPricesArgs = {
  filter?: Maybe<PriceFilter>;
};

export type ServiceVariantFilter = {
  name?: Maybe<Scalars['String']>;
  service_id?: Maybe<Scalars['ID']>;
};

export type ServiceVariantMutationResult = MutationResult & {
  __typename?: 'ServiceVariantMutationResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  service_variant?: Maybe<ServiceVariant>;
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

export type CustomerFragment = (
  { __typename?: 'StripeCustomer' }
  & Pick<StripeCustomer, 'id' | 'id_ext' | 'balance' | 'created' | 'currency' | 'delinquent' | 'description' | 'email' | 'invoice_prefix' | 'name' | 'next_invoice_sequence' | 'phone' | 'preferred_locales'>
  & { address?: Maybe<(
    { __typename?: 'Address' }
    & AddressFragment
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
    & CustomerFragment
  )>, shipping?: Maybe<(
    { __typename?: 'Shipping' }
    & Pick<Shipping, 'carrier' | 'name' | 'phone' | 'tracking_number'>
    & { address?: Maybe<(
      { __typename?: 'Address' }
      & AddressFragment
    )> }
  )> }
);

export type Service_VariantFragment = (
  { __typename?: 'ServiceVariant' }
  & Pick<ServiceVariant, 'id' | 'name' | 'description' | 'duration' | 'status'>
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
  )> }
);

export type ServiceFragment = (
  { __typename?: 'Service' }
  & Pick<Service, 'id' | 'name' | 'url_name'>
  & { agency: (
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
  ), default_variant: (
    { __typename?: 'ServiceVariant' }
    & Service_VariantFragment
  ), variants?: Maybe<Array<(
    { __typename?: 'ServiceVariant' }
    & Service_VariantFragment
  )>>, settings: (
    { __typename?: 'ServiceSettings' }
    & Pick<ServiceSettings, 'id'>
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

export type AgencyFragment = (
  { __typename?: 'Agency' }
  & Pick<Agency, 'id' | 'name'>
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

export type CreateServiceMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  url_name: Scalars['String'];
  duration?: Maybe<Scalars['String']>;
  image_logo?: Maybe<ImageInput>;
  image_hero?: Maybe<ImageInput>;
  status?: Maybe<Scalars['String']>;
}>;


export type CreateServiceMutation = (
  { __typename?: 'Mutation' }
  & { create_service: (
    { __typename?: 'ServiceMutationResult' }
    & Pick<ServiceMutationResult, 'success' | 'message'>
    & { service?: Maybe<(
      { __typename?: 'Service' }
      & ServiceFragment
    )> }
  ) }
);

export type UpdateServiceMutationVariables = Exact<{
  service_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  url_name?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  default_price_id?: Maybe<Scalars['ID']>;
  image_logo?: Maybe<ImageInput>;
  image_hero?: Maybe<ImageInput>;
  status?: Maybe<Scalars['String']>;
}>;


export type UpdateServiceMutation = (
  { __typename?: 'Mutation' }
  & { update_service: (
    { __typename?: 'ServiceMutationResult' }
    & Pick<ServiceMutationResult, 'success' | 'message'>
    & { service?: Maybe<(
      { __typename?: 'Service' }
      & ServiceFragment
    )> }
  ) }
);

export type DeleteServiceMutationVariables = Exact<{
  service_id: Scalars['ID'];
}>;


export type DeleteServiceMutation = (
  { __typename?: 'Mutation' }
  & { delete_service: (
    { __typename?: 'ServiceMutationResult' }
    & Pick<ServiceMutationResult, 'success' | 'message'>
    & { service?: Maybe<(
      { __typename?: 'Service' }
      & Pick<Service, 'id'>
    )> }
  ) }
);

export type CreatePriceMutationVariables = Exact<{
  service_variant_id: Scalars['ID'];
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

export type CreateServiceThankYouPageSettingMutationVariables = Exact<{
  service_id: Scalars['ID'];
  url: Scalars['String'];
}>;


export type CreateServiceThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { create_service_thank_you_page_setting: (
    { __typename?: 'ServiceThankYouPageSettingMutationResult' }
    & Pick<ServiceThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'ServiceThankYouPageSetting' }
      & Pick<ServiceThankYouPageSetting, 'id' | 'url'>
    )> }
  ) }
);

export type UpdateServiceThankYouPageSettingMutationVariables = Exact<{
  setting_id: Scalars['ID'];
  url: Scalars['String'];
}>;


export type UpdateServiceThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { update_service_thank_you_page_setting: (
    { __typename?: 'ServiceThankYouPageSettingMutationResult' }
    & Pick<ServiceThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'ServiceThankYouPageSetting' }
      & Pick<ServiceThankYouPageSetting, 'id' | 'url'>
    )> }
  ) }
);

export type DeleteServiceThankYouPageSettingMutationVariables = Exact<{
  setting_id: Scalars['ID'];
}>;


export type DeleteServiceThankYouPageSettingMutation = (
  { __typename?: 'Mutation' }
  & { delete_service_thank_you_page_setting: (
    { __typename?: 'ServiceThankYouPageSettingMutationResult' }
    & Pick<ServiceThankYouPageSettingMutationResult, 'success' | 'message'>
    & { setting?: Maybe<(
      { __typename?: 'ServiceThankYouPageSetting' }
      & Pick<ServiceThankYouPageSetting, 'id' | 'url'>
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

export type ServicesAgreementQueryVariables = Exact<{ [key: string]: never; }>;


export type ServicesAgreementQuery = (
  { __typename?: 'Query' }
  & { markdowns?: Maybe<Array<(
    { __typename?: 'Markdown' }
    & MarkdownFragment
  )>> }
);

export type AgencyStripeAccountUpdateUrlQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountUpdateUrlQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & { stripe_account: (
      { __typename?: 'StripeAccount' }
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
  created?: Maybe<Scalars['Date']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountBalanceTransactionsQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
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
  created?: Maybe<Scalars['Date']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountPaymentIntentsQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
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

export type AgencyStripeAccountCustomersQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  created?: Maybe<Scalars['Date']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountCustomersQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & { stripe_account: (
      { __typename?: 'StripeAccount' }
      & Pick<StripeAccount, 'id'>
      & { customers: Array<(
        { __typename?: 'StripeCustomer' }
        & CustomerFragment
      )> }
    ) }
  )> }
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

export type AgencyServicesQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyServicesQuery = (
  { __typename?: 'Query' }
  & { agency?: Maybe<(
    { __typename?: 'Agency' }
    & Pick<Agency, 'id'>
    & { services?: Maybe<Array<(
      { __typename?: 'Service' }
      & ServiceFragment
    )>> }
  )> }
);

export type ServiceQueryVariables = Exact<{
  service_id: Scalars['ID'];
}>;


export type ServiceQuery = (
  { __typename?: 'Query' }
  & { service?: Maybe<(
    { __typename?: 'Service' }
    & ServiceFragment
  )> }
);

export type ServicesQueryVariables = Exact<{
  filter: ServiceFilter;
}>;


export type ServicesQuery = (
  { __typename?: 'Query' }
  & { services?: Maybe<Array<(
    { __typename?: 'Service' }
    & ServiceFragment
  )>> }
);

export type ServiceAndAgencyFromUrlPartsQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
  service_url_name: Scalars['String'];
}>;


export type ServiceAndAgencyFromUrlPartsQuery = (
  { __typename?: 'Query' }
  & { subdomains?: Maybe<Array<(
    { __typename?: 'Subdomain' }
    & Pick<Subdomain, 'id' | 'name'>
    & { agency: (
      { __typename?: 'Agency' }
      & Pick<Agency, 'id'>
      & { services?: Maybe<Array<(
        { __typename?: 'Service' }
        & { agency: (
          { __typename?: 'Agency' }
          & AgencyFragment
        ) }
        & ServiceFragment
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
      & { services?: Maybe<Array<(
        { __typename?: 'Service' }
        & ServiceFragment
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

export type ServiceThankYouPageSettingQueryVariables = Exact<{
  service_id: Scalars['ID'];
}>;


export type ServiceThankYouPageSettingQuery = (
  { __typename?: 'Query' }
  & { service?: Maybe<(
    { __typename?: 'Service' }
    & Pick<Service, 'id'>
    & { settings: (
      { __typename?: 'ServiceSettings' }
      & Pick<ServiceSettings, 'id'>
      & { thank_you_page_setting?: Maybe<(
        { __typename?: 'ServiceThankYouPageSetting' }
        & Pick<ServiceThankYouPageSetting, 'id' | 'url'>
      )> }
    ) }
  )> }
);

export const Stripe_AccountFragmentDoc: DocumentNode<Stripe_AccountFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_account"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"business_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mcc"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"product_description"}},{"kind":"Field","name":{"kind":"Name","value":"support_address"}},{"kind":"Field","name":{"kind":"Name","value":"support_email"}},{"kind":"Field","name":{"kind":"Name","value":"support_phone"}},{"kind":"Field","name":{"kind":"Name","value":"support_url"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"business_type"}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card_payments"}},{"kind":"Field","name":{"kind":"Name","value":"transfers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_deadline"}},{"kind":"Field","name":{"kind":"Name","value":"disabled_reason"}},{"kind":"Field","name":{"kind":"Name","value":"currently_due"}},{"kind":"Field","name":{"kind":"Name","value":"eventually_due"}},{"kind":"Field","name":{"kind":"Name","value":"past_due"}},{"kind":"Field","name":{"kind":"Name","value":"pending_verification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"primary_color"}},{"kind":"Field","name":{"kind":"Name","value":"secondary_color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"charges_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency"}},{"kind":"Field","name":{"kind":"Name","value":"details_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"payouts_enabled"}}]}}]};
export const Balance_TransactionFragmentDoc: DocumentNode<Balance_TransactionFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"balance_transaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"available_on"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"exchange_rate"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"fee_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"application"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"net"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reporting_category"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]};
export const AddressFragmentDoc: DocumentNode<AddressFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]};
export const ChargeFragmentDoc: DocumentNode<ChargeFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"charge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"authorization_code"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculated_statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"captured"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"disputed"}},{"kind":"Field","name":{"kind":"Name","value":"failure_code"}},{"kind":"Field","name":{"kind":"Name","value":"failure_message"}},{"kind":"Field","name":{"kind":"Name","value":"fraud_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_report"}},{"kind":"Field","name":{"kind":"Name","value":"user_report"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network_status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"risk_level"}},{"kind":"Field","name":{"kind":"Name","value":"risk_score"}},{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seller_message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_number"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_url"}},{"kind":"Field","name":{"kind":"Name","value":"refunded"}},{"kind":"Field","name":{"kind":"Name","value":"source_transfer"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}},...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions]};
export const CustomerFragmentDoc: DocumentNode<CustomerFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"delinquent"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_prefix"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"next_invoice_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"preferred_locales"}}]}},...AddressFragmentDoc.definitions]};
export const Payment_IntentFragmentDoc: DocumentNode<Payment_IntentFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"payment_intent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentIntent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"cancellation_reason"}},{"kind":"Field","name":{"kind":"Name","value":"capture_method"}},{"kind":"Field","name":{"kind":"Name","value":"charges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"charge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmation_method"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"on_behalf_of"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"setup_future_usage"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}},...ChargeFragmentDoc.definitions,...CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions]};
export const PriceFragmentDoc: DocumentNode<PriceFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Price"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval_count"}}]}}]};
export const ImageFragmentDoc: DocumentNode<ImageFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"image"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}}]};
export const MarkdownFragmentDoc: DocumentNode<MarkdownFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"markdown"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Markdown"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]};
export const Service_VariantFragmentDoc: DocumentNode<Service_VariantFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"service_variant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"default_price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"markdown_description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}}]}},...PriceFragmentDoc.definitions,...ImageFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]};
export const ServiceFragmentDoc: DocumentNode<ServiceFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"service"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Service"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url_name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service_variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service_variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},...Service_VariantFragmentDoc.definitions]};
export const ThemeFragmentDoc: DocumentNode<ThemeFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"theme"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Theme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"color_primary"}},{"kind":"Field","name":{"kind":"Name","value":"color_secondary"}},{"kind":"Field","name":{"kind":"Name","value":"color_accent"}},{"kind":"Field","name":{"kind":"Name","value":"color_background"}},{"kind":"Field","name":{"kind":"Name","value":"color_surface"}},{"kind":"Field","name":{"kind":"Name","value":"color_error"}},{"kind":"Field","name":{"kind":"Name","value":"color_success"}}]}},...ImageFragmentDoc.definitions]};
export const AgencyFragmentDoc: DocumentNode<AgencyFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"agency"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agency"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},...ThemeFragmentDoc.definitions]};
export const UserFragmentDoc: DocumentNode<UserFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"user"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}}]};
export const MembershipFragmentDoc: DocumentNode<MembershipFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Membership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},...UserFragmentDoc.definitions]};
export const SubdomainFragmentDoc: DocumentNode<SubdomainFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subdomain"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subdomain"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}},...AgencyFragmentDoc.definitions,...MembershipFragmentDoc.definitions]};
export const BeginVisitDocument: DocumentNode<BeginVisitMutation, BeginVisitMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BeginVisit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"begin_visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]};
export const EndVisitDocument: DocumentNode<EndVisitMutation, EndVisitMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndVisit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"end_visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const LogInDocument: DocumentNode<LogInMutation, LogInMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"log_in"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]};
export const LogOutDocument: DocumentNode<LogOutMutation, LogOutMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"log_out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const VerifyPasswordResetDocument: DocumentNode<VerifyPasswordResetMutation, VerifyPasswordResetMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verify_password_reset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verification_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const VerifySignUpDocument: DocumentNode<VerifySignUpMutation, VerifySignUpMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifySignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verify_sign_up"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verification_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verification_code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const StartPasswordResetDocument: DocumentNode<StartPasswordResetMutation, StartPasswordResetMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start_password_reset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirect_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const StartSignUpDocument: DocumentNode<StartSignUpMutation, StartSignUpMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start_sign_up"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirect_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirect_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]};
export const CreateAgencyDocument: DocumentNode<CreateAgencyMutation, CreateAgencyMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"return_url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdomain_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"country_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country_code"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"return_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"return_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_verification_url"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]};
export const CreateServiceDocument: DocumentNode<CreateServiceMutation, CreateServiceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_service"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service"}}]}}]}}]}},...ServiceFragmentDoc.definitions]};
export const UpdateServiceDocument: DocumentNode<UpdateServiceMutation, UpdateServiceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_price_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_service"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"service_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_price_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_price_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service"}}]}}]}}]}},...ServiceFragmentDoc.definitions]};
export const DeleteServiceDocument: DocumentNode<DeleteServiceMutation, DeleteServiceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_service"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"service_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]};
export const CreatePriceDocument: DocumentNode<CreatePriceMutation, CreatePriceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"service_variant_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval_count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_price"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"service_variant_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"service_variant_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"unit_amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"recurring_interval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval"}}},{"kind":"Argument","name":{"kind":"Name","value":"recurring_interval_count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval_count"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}}]}}]}},...PriceFragmentDoc.definitions]};
export const CreateAgencyThankYouPageSettingDocument: DocumentNode<CreateAgencyThankYouPageSettingMutation, CreateAgencyThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const UpdateAgencyThankYouPageSettingDocument: DocumentNode<UpdateAgencyThankYouPageSettingMutation, UpdateAgencyThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const DeleteAgencyThankYouPageSettingDocument: DocumentNode<DeleteAgencyThankYouPageSettingMutation, DeleteAgencyThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_agency_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const CreateServiceThankYouPageSettingDocument: DocumentNode<CreateServiceThankYouPageSettingMutation, CreateServiceThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateServiceThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_service_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"service_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const UpdateServiceThankYouPageSettingDocument: DocumentNode<UpdateServiceThankYouPageSettingMutation, UpdateServiceThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateServiceThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_service_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const DeleteServiceThankYouPageSettingDocument: DocumentNode<DeleteServiceThankYouPageSettingMutation, DeleteServiceThankYouPageSettingMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteServiceThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_service_thank_you_page_setting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const CurrentUserDocument: DocumentNode<CurrentUserQuery, CurrentUserQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}}]}},...UserFragmentDoc.definitions,...MembershipFragmentDoc.definitions]};
export const CountriesDocument: DocumentNode<CountriesQuery, CountriesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country_codes"}}]}}]};
export const ServicesAgreementDocument: DocumentNode<ServicesAgreementQuery, ServicesAgreementQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServicesAgreement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markdowns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"Services Agreement","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}}]}},...MarkdownFragmentDoc.definitions]};
export const AgencyStripeAccountUpdateUrlDocument: DocumentNode<AgencyStripeAccountUpdateUrlQuery, AgencyStripeAccountUpdateUrlQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountUpdateUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account_update_url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]};
export const AgencyStripeAccountBalanceDocument: DocumentNode<AgencyStripeAccountBalanceQuery, AgencyStripeAccountBalanceQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"connect_reserved"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}}]}}]}}]}}]}}]};
export const AgencyStripeAccountBalanceTransactionsDocument: DocumentNode<AgencyStripeAccountBalanceTransactionsQuery, AgencyStripeAccountBalanceTransactionsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalanceTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}}]}}]}}]}},...Balance_TransactionFragmentDoc.definitions]};
export const AgencyStripeAccountPaymentIntentsDocument: DocumentNode<AgencyStripeAccountPaymentIntentsQuery, AgencyStripeAccountPaymentIntentsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountPaymentIntents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}}]}}]}}]}},...Payment_IntentFragmentDoc.definitions]};
export const AgencyStripeAccountCustomersDocument: DocumentNode<AgencyStripeAccountCustomersQuery, AgencyStripeAccountCustomersQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}}]}},...CustomerFragmentDoc.definitions]};
export const CurrentUserAgenciesDocument: DocumentNode<CurrentUserAgenciesQuery, CurrentUserAgenciesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUserAgencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"membership"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},...AgencyFragmentDoc.definitions,...Stripe_AccountFragmentDoc.definitions,...MembershipFragmentDoc.definitions]};
export const SubdomainPublicDocument: DocumentNode<SubdomainPublicQuery, SubdomainPublicQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainPublic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}}]}}]}}]}},...ThemeFragmentDoc.definitions]};
export const AgencyServicesDocument: DocumentNode<AgencyServicesQuery, AgencyServicesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyServices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service"}}]}}]}}]}},...ServiceFragmentDoc.definitions]};
export const ServiceDocument: DocumentNode<ServiceQuery, ServiceQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Service"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service"}}]}}]}},...ServiceFragmentDoc.definitions]};
export const ServicesDocument: DocumentNode<ServicesQuery, ServicesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Services"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"services"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service"}}]}}]}},...ServiceFragmentDoc.definitions]};
export const ServiceAndAgencyFromUrlPartsDocument: DocumentNode<ServiceAndAgencyFromUrlPartsQuery, ServiceAndAgencyFromUrlPartsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServiceAndAgencyFromUrlParts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"service_url_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"services"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"service_url_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}}]}}]}}]}},...ServiceFragmentDoc.definitions,...AgencyFragmentDoc.definitions]};
export const SubdomainAgencyDocument: DocumentNode<SubdomainAgencyQuery, SubdomainAgencyQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"service"}}]}}]}}]}}]}},...AgencyFragmentDoc.definitions,...ServiceFragmentDoc.definitions]};
export const SubdomainAgencyStripeAccountUpdateUrlDocument: DocumentNode<SubdomainAgencyStripeAccountUpdateUrlQuery, SubdomainAgencyStripeAccountUpdateUrlQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgencyStripeAccountUpdateUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account_update_url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]};
export const AgencyThankYouPageSettingDocument: DocumentNode<AgencyThankYouPageSettingQuery, AgencyThankYouPageSettingQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thank_you_page_setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]};
export const ServiceThankYouPageSettingDocument: DocumentNode<ServiceThankYouPageSettingQuery, ServiceThankYouPageSettingQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServiceThankYouPageSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"service_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thank_you_page_setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]};