import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  Agent = 'AGENT',
  Client = 'CLIENT',
  Manager = 'MANAGER',
  Owner = 'OWNER',
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
  default_pricing_currency?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  livemode: Scalars['Boolean'];
  name: Scalars['String'];
  pages?: Maybe<Array<Page>>;
  products?: Maybe<Array<Product>>;
  settings: AgencySettings;
  stripe_account: StripeAccount;
  subdomain: Subdomain;
  subscription_plan: SubscriptionPlan;
  supported_payment_currencies: Array<Scalars['String']>;
  theme: Theme;
};


export type AgencyPagesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<PageFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type AgencyProductsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<ProductFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type AgencyStripe_AccountArgs = {
  livemode?: InputMaybe<Scalars['Boolean']>;
};

export type AgencyFilter = {
  name?: InputMaybe<Scalars['String']>;
};

export type AgencyMutationResult = MutationResult & {
  __typename?: 'AgencyMutationResult';
  agency?: Maybe<Agency>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type AgencySettings = {
  __typename?: 'AgencySettings';
  checkout_cancel_url?: Maybe<Scalars['String']>;
  checkout_success_url?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type AgencySettingsFilter = {
  agency_id?: InputMaybe<Scalars['ID']>;
};

export type AgencySettingsMutationResult = MutationResult & {
  __typename?: 'AgencySettingsMutationResult';
  message?: Maybe<Scalars['String']>;
  setting?: Maybe<AgencySettings>;
  success: Scalars['Boolean'];
};

export type BalanceTransaction = {
  __typename?: 'BalanceTransaction';
  amount: Scalars['Int'];
  available_on: Scalars['DateTime'];
  created: Scalars['DateTime'];
  currency: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  exchange_rate?: Maybe<Scalars['Float']>;
  fee: Scalars['Int'];
  fee_details?: Maybe<Array<BalanceTransactionFeeDetails>>;
  id: Scalars['ID'];
  net: Scalars['Int'];
  reporting_category: Scalars['String'];
  source: Scalars['String'];
  status: Scalars['String'];
  type: Scalars['String'];
};

export type BalanceTransactionFeeDetails = {
  __typename?: 'BalanceTransactionFeeDetails';
  amount: Scalars['Int'];
  application?: Maybe<Scalars['String']>;
  currency: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type BankAccount = Node & {
  __typename?: 'BankAccount';
  account_holder_name?: Maybe<Scalars['String']>;
  account_holder_type?: Maybe<Scalars['String']>;
  available_payout_methods?: Maybe<Array<Scalars['String']>>;
  bank_name?: Maybe<Scalars['String']>;
  country: Scalars['String'];
  currency: Scalars['String'];
  default_for_currency?: Maybe<Scalars['Boolean']>;
  fingerprint?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  last4: Scalars['String'];
  routing_number?: Maybe<Scalars['String']>;
  status: Scalars['String'];
};

export type BankAccountMutationResult = MutationResult & {
  __typename?: 'BankAccountMutationResult';
  bank_account?: Maybe<BankAccount>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type BeginVisitResult = MutationResult & {
  __typename?: 'BeginVisitResult';
  jwt?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
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
  id: Scalars['ID'];
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
  default_currency: Scalars['String'];
  id: Scalars['ID'];
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

export type Coupon = {
  __typename?: 'Coupon';
  amount_off?: Maybe<Scalars['Int']>;
  applies_to?: Maybe<CouponAppliesTo>;
  created?: Maybe<Scalars['DateTime']>;
  currency?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  duration_in_months?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  livemode?: Maybe<Scalars['Boolean']>;
  max_redemptions?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  percent_off?: Maybe<Scalars['Int']>;
  redeem_by?: Maybe<Scalars['DateTime']>;
  times_redeemed?: Maybe<Scalars['Int']>;
  valid?: Maybe<Scalars['Boolean']>;
};

export type CouponAppliesTo = {
  __typename?: 'CouponAppliesTo';
  products: Array<Scalars['String']>;
};

export type CouponAppliesToInput = {
  products: Array<Scalars['String']>;
};

export type CouponMutationResult = MutationResult & {
  __typename?: 'CouponMutationResult';
  coupon?: Maybe<Coupon>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CreateAgencyResult = MutationResult & {
  __typename?: 'CreateAgencyResult';
  agency?: Maybe<Agency>;
  message?: Maybe<Scalars['String']>;
  stripe_verification_url?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CreateStripeCheckoutSessionResult = MutationResult & {
  __typename?: 'CreateStripeCheckoutSessionResult';
  checkout_session_id?: Maybe<Scalars['String']>;
  checkout_session_url?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Credential = Node & {
  __typename?: 'Credential';
  agency: Agency;
  credential_type: CredentialType;
  data: Scalars['Json'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CredentialFilter = {
  agency_id?: InputMaybe<Scalars['ID']>;
  credential_type_id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type CredentialMutationResult = MutationResult & {
  __typename?: 'CredentialMutationResult';
  credential?: Maybe<Credential>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CredentialType = Node & {
  __typename?: 'CredentialType';
  fields?: Maybe<Array<FormField>>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CredentialTypeFilter = {
  form_id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Customer = {
  __typename?: 'Customer';
  default_stripe_customer: StripeCustomer;
  email_address: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  stripe_account: StripeAccount;
  stripe_customers: Array<StripeCustomer>;
  user?: Maybe<User>;
};


export type CustomerStripe_CustomersArgs = {
  created?: InputMaybe<Scalars['Int']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
};

export type CustomerFilter = {
  default_stripe_customer_id_ext?: InputMaybe<Scalars['ID']>;
  email_address?: InputMaybe<Scalars['String']>;
  stripe_account_id?: InputMaybe<Scalars['ID']>;
};

export type CustomerMutationResult = MutationResult & {
  __typename?: 'CustomerMutationResult';
  customer?: Maybe<Customer>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CustomerTaxId = {
  __typename?: 'CustomerTaxId';
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type Discount = {
  __typename?: 'Discount';
  checkout_session?: Maybe<Scalars['String']>;
  coupon?: Maybe<Coupon>;
  customer?: Maybe<StripeCustomer>;
  end?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  invoice?: Maybe<Invoice>;
  invoice_item?: Maybe<Scalars['String']>;
  promotion_code?: Maybe<Scalars['String']>;
  start: Scalars['DateTime'];
  subscription?: Maybe<Scalars['String']>;
};

export type ExchangeRate = {
  __typename?: 'ExchangeRate';
  currency: Scalars['String'];
  date: Scalars['DateTime'];
  rate_eur: Scalars['Float'];
};

export type FormField = Node & {
  __typename?: 'FormField';
  default?: Maybe<Scalars['Json']>;
  hint?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  label: Scalars['String'];
  name: Scalars['String'];
  prefix?: Maybe<Scalars['String']>;
  required: Scalars['Boolean'];
  suffix?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type FormFieldFilter = {
  form_id?: InputMaybe<Scalars['ID']>;
};

export type FraudDetails = {
  __typename?: 'FraudDetails';
  stripe_report?: Maybe<Scalars['String']>;
  user_report?: Maybe<Scalars['String']>;
};

export type Image = Node & {
  __typename?: 'Image';
  access: AccessLevel;
  agency?: Maybe<Agency>;
  color: Scalars['String'];
  data: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ImageFilter = {
  agency_id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ImageInput = {
  color: Scalars['String'];
  data: Scalars['String'];
  name: Scalars['String'];
};

export type ImageMutationResult = MutationResult & {
  __typename?: 'ImageMutationResult';
  image?: Maybe<Image>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Integration = {
  __typename?: 'Integration';
  agency: Agency;
  credential?: Maybe<Credential>;
  data: Scalars['Json'];
  id: Scalars['ID'];
  integration_config?: Maybe<IntegrationConfig>;
  integration_type: IntegrationType;
  product?: Maybe<Product>;
};

export type IntegrationConfig = Node & {
  __typename?: 'IntegrationConfig';
  agency: Agency;
  credential?: Maybe<Credential>;
  data: Scalars['Json'];
  id: Scalars['ID'];
  integration_type: IntegrationType;
  name: Scalars['String'];
};

export type IntegrationConfigFilter = {
  agency_id?: InputMaybe<Scalars['ID']>;
  integration_type_id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type IntegrationConfigMutationResult = MutationResult & {
  __typename?: 'IntegrationConfigMutationResult';
  integration_config?: Maybe<IntegrationConfig>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type IntegrationFilter = {
  agency_id?: InputMaybe<Scalars['ID']>;
  integration_config_id?: InputMaybe<Scalars['ID']>;
  integration_type_id?: InputMaybe<Scalars['ID']>;
  product_id?: InputMaybe<Scalars['ID']>;
};

export type IntegrationMutationResult = MutationResult & {
  __typename?: 'IntegrationMutationResult';
  integration?: Maybe<Integration>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type IntegrationType = Node & {
  __typename?: 'IntegrationType';
  automatic_order_management: Scalars['Boolean'];
  config_fields?: Maybe<Array<FormField>>;
  credential_type?: Maybe<CredentialType>;
  fields?: Maybe<Array<FormField>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  status: Scalars['String'];
  title: Scalars['String'];
};

export type IntegrationTypeFilter = {
  config_form_id?: InputMaybe<Scalars['ID']>;
  form_id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Invoice = {
  __typename?: 'Invoice';
  account_country?: Maybe<Scalars['String']>;
  account_name?: Maybe<Scalars['String']>;
  account_tax_ids?: Maybe<Array<Scalars['String']>>;
  amount_due: Scalars['Int'];
  amount_paid: Scalars['Int'];
  amount_remaining: Scalars['Int'];
  application_fee_amount?: Maybe<Scalars['Int']>;
  attempt_count: Scalars['Int'];
  attempted: Scalars['Boolean'];
  auto_advance?: Maybe<Scalars['Boolean']>;
  automatic_tax: InvoiceAutomaticTax;
  billing_reason?: Maybe<Scalars['String']>;
  charge?: Maybe<Charge>;
  collection_method?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  currency: Scalars['String'];
  custom_fields?: Maybe<Array<InvoiceCustomField>>;
  customer?: Maybe<StripeCustomer>;
  customer_address?: Maybe<Address>;
  customer_email?: Maybe<Scalars['String']>;
  customer_name?: Maybe<Scalars['String']>;
  customer_phone?: Maybe<Scalars['String']>;
  customer_shipping?: Maybe<InvoiceCustomerShipping>;
  customer_tax_exempt?: Maybe<Scalars['String']>;
  customer_tax_ids?: Maybe<Array<CustomerTaxId>>;
  default_payment_method?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  discount?: Maybe<Discount>;
  discounts?: Maybe<Array<Discount>>;
  due_date?: Maybe<Scalars['DateTime']>;
  ending_balance?: Maybe<Scalars['Int']>;
  footer?: Maybe<Scalars['String']>;
  hosted_invoice_url?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  invoice_pdf?: Maybe<Scalars['String']>;
  lines: Array<InvoiceLineItem>;
  livemode: Scalars['Boolean'];
  next_payment_attempt?: Maybe<Scalars['DateTime']>;
  number?: Maybe<Scalars['String']>;
  paid: Scalars['Boolean'];
  payment_intent?: Maybe<PaymentIntent>;
  period_end: Scalars['DateTime'];
  period_start: Scalars['DateTime'];
  post_payment_credit_notes_amount: Scalars['Int'];
  pre_payment_credit_notes_amount: Scalars['Int'];
  receipt_number?: Maybe<Scalars['String']>;
  starting_balance?: Maybe<Scalars['Int']>;
  statement_descriptor?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  status_transitions?: Maybe<InvoiceStatusTransitions>;
  subscription_proration_date?: Maybe<Scalars['DateTime']>;
  subtotal: Scalars['Int'];
  tax?: Maybe<Scalars['Int']>;
  total: Scalars['Int'];
  webhooks_delivered_at?: Maybe<Scalars['DateTime']>;
};


export type InvoiceLinesArgs = {
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
};

export type InvoiceAutomaticTax = {
  __typename?: 'InvoiceAutomaticTax';
  enabled: Scalars['Boolean'];
  status?: Maybe<Scalars['String']>;
};

export type InvoiceCustomField = {
  __typename?: 'InvoiceCustomField';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type InvoiceCustomerShipping = {
  __typename?: 'InvoiceCustomerShipping';
  address?: Maybe<Address>;
  carrier?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
};

export type InvoiceItem = {
  __typename?: 'InvoiceItem';
  amount: Scalars['Int'];
  currency: Scalars['String'];
  customer?: Maybe<StripeCustomer>;
  date: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  discountable: Scalars['Boolean'];
  discounts?: Maybe<Array<Discount>>;
  id: Scalars['ID'];
  invoice?: Maybe<Invoice>;
  livemode: Scalars['Boolean'];
  price?: Maybe<StripePrice>;
  proration: Scalars['Boolean'];
  quantity: Scalars['Int'];
  unit_amount?: Maybe<Scalars['Int']>;
  unit_amount_decimal?: Maybe<Scalars['String']>;
};

export type InvoiceItemInput = {
  amount?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  discountable?: InputMaybe<Scalars['Boolean']>;
  period?: InputMaybe<PeriodInput>;
  price?: InputMaybe<Scalars['ID']>;
  quantity?: InputMaybe<Scalars['Int']>;
  unit_amount?: InputMaybe<Scalars['Int']>;
  unit_amount_decimal?: InputMaybe<Scalars['String']>;
};

export type InvoiceItemMutationResult = MutationResult & {
  __typename?: 'InvoiceItemMutationResult';
  invoiceitem?: Maybe<InvoiceItem>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type InvoiceLineItem = {
  __typename?: 'InvoiceLineItem';
  amount: Scalars['Int'];
  currency: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  discount_amounts?: Maybe<Array<InvoiceLineItemDiscountAmount>>;
  discountable: Scalars['Boolean'];
  id: Scalars['ID'];
  invoice_item?: Maybe<Scalars['String']>;
  livemode: Scalars['Boolean'];
  price?: Maybe<StripePrice>;
  proration: Scalars['Boolean'];
  quantity?: Maybe<Scalars['Int']>;
  subscription?: Maybe<Scalars['String']>;
  subscription_item?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type InvoiceLineItemDiscountAmount = {
  __typename?: 'InvoiceLineItemDiscountAmount';
  amount?: Maybe<Scalars['Int']>;
  discount?: Maybe<Discount>;
};

export type InvoiceMutationResult = MutationResult & {
  __typename?: 'InvoiceMutationResult';
  invoice?: Maybe<Invoice>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type InvoiceStatusTransitions = {
  __typename?: 'InvoiceStatusTransitions';
  finalized_at?: Maybe<Scalars['DateTime']>;
  marked_uncollectible_at?: Maybe<Scalars['DateTime']>;
  paid_at?: Maybe<Scalars['DateTime']>;
  voided_at?: Maybe<Scalars['DateTime']>;
};

export type LineItem = {
  __typename?: 'LineItem';
  amount_subtotal: Scalars['Int'];
  amount_total: Scalars['Int'];
  currency: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  price?: Maybe<StripePrice>;
  quantity?: Maybe<Scalars['Int']>;
};

export type LogInResult = MutationResult & {
  __typename?: 'LogInResult';
  jwt?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Markdown = Node & {
  __typename?: 'Markdown';
  access: AccessLevel;
  agency?: Maybe<Agency>;
  data: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type MarkdownFilter = {
  agency_id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type MarkdownMutationResult = MutationResult & {
  __typename?: 'MarkdownMutationResult';
  markdown?: Maybe<Markdown>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Membership = Node & {
  __typename?: 'Membership';
  access: AccessLevel;
  id: Scalars['ID'];
  name: Scalars['String'];
  subdomain: Subdomain;
  user: User;
};

export type MembershipFilter = {
  access?: InputMaybe<AccessLevel>;
  subdomain_id?: InputMaybe<Scalars['ID']>;
  user_id?: InputMaybe<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  begin_visit: BeginVisitResult;
  cancel_subscription: SubscriptionMutationResult;
  create_agency: CreateAgencyResult;
  create_bank_account: BankAccountMutationResult;
  create_coupon: CouponMutationResult;
  create_credential: CredentialMutationResult;
  create_customer: CustomerMutationResult;
  create_image: ImageMutationResult;
  create_integration: IntegrationMutationResult;
  create_integration_config: IntegrationConfigMutationResult;
  create_invoice: InvoiceMutationResult;
  create_invoiceitem: InvoiceItemMutationResult;
  create_markdown: MarkdownMutationResult;
  create_page_block: PageBlockMutationResult;
  create_price: PriceMutationResult;
  create_product: ProductMutationResult;
  create_promotion_code: PromotionCodeMutationResult;
  create_stripe_checkout_session: CreateStripeCheckoutSessionResult;
  create_subscription: SubscriptionMutationResult;
  delete_agency: AgencyMutationResult;
  delete_bank_account: BankAccountMutationResult;
  delete_coupon: CouponMutationResult;
  delete_customer: CustomerMutationResult;
  delete_invoice: InvoiceMutationResult;
  delete_invoiceitem: InvoiceItemMutationResult;
  delete_page_block: PageBlockMutationResult;
  delete_price: PriceMutationResult;
  delete_product: ProductMutationResult;
  end_visit: SimpleResult;
  finalize_invoice: InvoiceMutationResult;
  log_in: LogInResult;
  log_out: SimpleResult;
  mark_invoice_uncollectible: InvoiceMutationResult;
  start_password_reset: SimpleResult;
  start_sign_up: SimpleResult;
  update_agency: AgencyMutationResult;
  update_agency_settings: AgencySettingsMutationResult;
  update_bank_account: BankAccountMutationResult;
  update_coupon: CouponMutationResult;
  update_credential: CredentialMutationResult;
  update_customer: CustomerMutationResult;
  update_image: ImageMutationResult;
  update_integration: IntegrationMutationResult;
  update_integration_config: IntegrationConfigMutationResult;
  update_invoice: InvoiceMutationResult;
  update_invoiceitem: InvoiceItemMutationResult;
  update_markdown: MarkdownMutationResult;
  update_order: OrderMutationResult;
  update_order_item: OrderItemMutationResult;
  update_page: PageMutationResult;
  update_page_block: PageBlockMutationResult;
  update_price: PriceMutationResult;
  update_product: ProductMutationResult;
  update_product_settings: ProductSettingsMutationResult;
  update_promotion_code: PromotionCodeMutationResult;
  update_theme: UpdateThemeResult;
  verify_password_reset: SimpleResult;
  verify_sign_up: SimpleResult;
  void_invoice: InvoiceMutationResult;
};


export type MutationCancel_SubscriptionArgs = {
  cancel_at?: InputMaybe<Scalars['Int']>;
  cancel_at_period_end?: InputMaybe<Scalars['Boolean']>;
  invoice_now?: InputMaybe<Scalars['Boolean']>;
  prorate?: InputMaybe<Scalars['Boolean']>;
  stripe_account_id: Scalars['ID'];
  subscription_id: Scalars['ID'];
};


export type MutationCreate_AgencyArgs = {
  country_code: Scalars['String'];
  default_currency?: InputMaybe<Scalars['String']>;
  default_pricing_currency?: InputMaybe<Scalars['String']>;
  image_logo: ImageInput;
  livemode: Scalars['Boolean'];
  name: Scalars['String'];
  return_url: Scalars['String'];
  subdomain_name: Scalars['String'];
};


export type MutationCreate_Bank_AccountArgs = {
  account_holder_name?: InputMaybe<Scalars['String']>;
  account_holder_type?: InputMaybe<Scalars['String']>;
  account_number: Scalars['String'];
  country: Scalars['String'];
  currency: Scalars['String'];
  default_for_currency?: InputMaybe<Scalars['Boolean']>;
  routing_number?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationCreate_CouponArgs = {
  amount_off?: InputMaybe<Scalars['Int']>;
  applies_to?: InputMaybe<CouponAppliesToInput>;
  currency?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  duration_in_months?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  max_redemptions?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  percent_off?: InputMaybe<Scalars['Int']>;
  redeem_by?: InputMaybe<Scalars['Int']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationCreate_CredentialArgs = {
  agency_id?: InputMaybe<Scalars['ID']>;
  credential_type_id: Scalars['ID'];
  data: Scalars['Json'];
  name: Scalars['String'];
};


export type MutationCreate_CustomerArgs = {
  email_address: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationCreate_ImageArgs = {
  access?: InputMaybe<AccessLevel>;
  agency_id?: InputMaybe<Scalars['ID']>;
  color: Scalars['String'];
  data: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreate_IntegrationArgs = {
  agency_id: Scalars['ID'];
  credential_id?: InputMaybe<Scalars['ID']>;
  data: Scalars['Json'];
  integration_config_id?: InputMaybe<Scalars['ID']>;
  integration_type_id: Scalars['ID'];
  product_id?: InputMaybe<Scalars['ID']>;
};


export type MutationCreate_Integration_ConfigArgs = {
  agency_id: Scalars['ID'];
  credential_id?: InputMaybe<Scalars['ID']>;
  data: Scalars['Json'];
  integration_type_id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationCreate_InvoiceArgs = {
  auto_advance?: InputMaybe<Scalars['Boolean']>;
  collection_method?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  customer: Scalars['ID'];
  days_until_due?: InputMaybe<Scalars['Int']>;
  default_payment_method?: InputMaybe<Scalars['ID']>;
  default_source?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  due_date?: InputMaybe<Scalars['Int']>;
  footer?: InputMaybe<Scalars['String']>;
  items?: InputMaybe<Array<InvoiceItemInput>>;
  stripe_account_id: Scalars['ID'];
  subscription?: InputMaybe<Scalars['ID']>;
};


export type MutationCreate_InvoiceitemArgs = {
  amount?: InputMaybe<Scalars['Int']>;
  currency?: InputMaybe<Scalars['String']>;
  customer: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  discountable?: InputMaybe<Scalars['Boolean']>;
  invoice?: InputMaybe<Scalars['ID']>;
  period?: InputMaybe<PeriodInput>;
  price?: InputMaybe<Scalars['ID']>;
  quantity?: InputMaybe<Scalars['Int']>;
  stripe_account_id: Scalars['ID'];
  unit_amount?: InputMaybe<Scalars['Int']>;
  unit_amount_decimal?: InputMaybe<Scalars['String']>;
};


export type MutationCreate_MarkdownArgs = {
  access?: InputMaybe<AccessLevel>;
  agency_id?: InputMaybe<Scalars['ID']>;
  data: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreate_Page_BlockArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  data: Scalars['Json'];
  page_block_definition_id: Scalars['ID'];
  page_id: Scalars['ID'];
};


export type MutationCreate_PriceArgs = {
  currency: Scalars['String'];
  product_id: Scalars['ID'];
  recurring_interval?: InputMaybe<Scalars['String']>;
  recurring_interval_count?: InputMaybe<Scalars['Int']>;
  recurring_iterations?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['String']>;
  unit_amount: Scalars['Int'];
};


export type MutationCreate_ProductArgs = {
  agency_id: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  image_hero?: InputMaybe<ImageInput>;
  image_logo?: InputMaybe<ImageInput>;
  image_logo_id?: InputMaybe<Scalars['ID']>;
  markdown_description_id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  status?: InputMaybe<Scalars['String']>;
  url_name: Scalars['String'];
};


export type MutationCreate_Promotion_CodeArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  code?: InputMaybe<Scalars['String']>;
  coupon: Scalars['String'];
  customer?: InputMaybe<Scalars['String']>;
  expires_at?: InputMaybe<Scalars['Int']>;
  max_redemptions?: InputMaybe<Scalars['Int']>;
  restrictions?: InputMaybe<PromotionCodeRestrictionsInput>;
  stripe_account_id: Scalars['ID'];
};


export type MutationCreate_Stripe_Checkout_SessionArgs = {
  allow_promotion_codes?: InputMaybe<Scalars['Boolean']>;
  cancel_url?: InputMaybe<Scalars['String']>;
  coupon_id?: InputMaybe<Scalars['ID']>;
  livemode: Scalars['Boolean'];
  price_id: Scalars['ID'];
  promotion_code_id?: InputMaybe<Scalars['ID']>;
  success_url?: InputMaybe<Scalars['String']>;
};


export type MutationCreate_SubscriptionArgs = {
  backdate_start_date?: InputMaybe<Scalars['Int']>;
  billing_cycle_anchor?: InputMaybe<Scalars['Int']>;
  cancel_at?: InputMaybe<Scalars['Int']>;
  cancel_at_period_end?: InputMaybe<Scalars['Boolean']>;
  collection_method?: InputMaybe<Scalars['String']>;
  coupon?: InputMaybe<Scalars['ID']>;
  customer: Scalars['ID'];
  days_until_due?: InputMaybe<Scalars['Int']>;
  default_payment_method?: InputMaybe<Scalars['String']>;
  default_source?: InputMaybe<Scalars['String']>;
  items: Array<SubscriptionItemInput>;
  payment_behaviour?: InputMaybe<Scalars['String']>;
  promotion_code?: InputMaybe<Scalars['ID']>;
  proration_behaviour?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
  trial_end?: InputMaybe<Scalars['Int']>;
  trial_from_plan?: InputMaybe<Scalars['Boolean']>;
  trial_period_days?: InputMaybe<Scalars['Int']>;
};


export type MutationDelete_AgencyArgs = {
  agency_id: Scalars['ID'];
};


export type MutationDelete_Bank_AccountArgs = {
  bank_account_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type MutationDelete_CouponArgs = {
  coupon_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type MutationDelete_CustomerArgs = {
  customer_id: Scalars['ID'];
};


export type MutationDelete_InvoiceArgs = {
  invoice_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type MutationDelete_InvoiceitemArgs = {
  invoiceitem_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type MutationDelete_Page_BlockArgs = {
  page_block_id: Scalars['ID'];
};


export type MutationDelete_PriceArgs = {
  price_id: Scalars['ID'];
};


export type MutationDelete_ProductArgs = {
  product_id: Scalars['ID'];
};


export type MutationFinalize_InvoiceArgs = {
  invoice_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type MutationLog_InArgs = {
  email_address: Scalars['String'];
  password: Scalars['String'];
  recaptcha_token?: InputMaybe<Scalars['String']>;
};


export type MutationMark_Invoice_UncollectibleArgs = {
  invoice_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type MutationStart_Password_ResetArgs = {
  email_address: Scalars['String'];
  redirect_url?: InputMaybe<Scalars['String']>;
};


export type MutationStart_Sign_UpArgs = {
  email_address: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  recaptcha_token?: InputMaybe<Scalars['String']>;
  redirect_url?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_AgencyArgs = {
  agency_id: Scalars['ID'];
  default_currency?: InputMaybe<Scalars['String']>;
  default_pricing_currency?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_Agency_SettingsArgs = {
  checkout_cancel_url?: InputMaybe<Scalars['String']>;
  checkout_success_url?: InputMaybe<Scalars['String']>;
  setting_id: Scalars['ID'];
};


export type MutationUpdate_Bank_AccountArgs = {
  account_holder_name?: InputMaybe<Scalars['String']>;
  account_holder_type?: InputMaybe<Scalars['String']>;
  bank_account_id: Scalars['ID'];
  default_for_currency?: InputMaybe<Scalars['Boolean']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationUpdate_CouponArgs = {
  coupon_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationUpdate_CredentialArgs = {
  credential_id: Scalars['ID'];
  data: Scalars['Json'];
};


export type MutationUpdate_CustomerArgs = {
  customer_id: Scalars['ID'];
  email_address?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_ImageArgs = {
  access?: InputMaybe<AccessLevel>;
  color?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<Scalars['String']>;
  image_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_IntegrationArgs = {
  credential_id?: InputMaybe<Scalars['ID']>;
  data?: InputMaybe<Scalars['Json']>;
  integration_id: Scalars['ID'];
};


export type MutationUpdate_Integration_ConfigArgs = {
  credential_id?: InputMaybe<Scalars['ID']>;
  data?: InputMaybe<Scalars['Json']>;
  integration_config_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_InvoiceArgs = {
  auto_advance?: InputMaybe<Scalars['Boolean']>;
  collection_method?: InputMaybe<Scalars['String']>;
  days_until_due?: InputMaybe<Scalars['Int']>;
  default_payment_method?: InputMaybe<Scalars['ID']>;
  default_source?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  due_date?: InputMaybe<Scalars['Int']>;
  footer?: InputMaybe<Scalars['String']>;
  invoice_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
  subscription?: InputMaybe<Scalars['ID']>;
};


export type MutationUpdate_InvoiceitemArgs = {
  amount?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  discountable?: InputMaybe<Scalars['Boolean']>;
  invoiceitem_id: Scalars['ID'];
  period?: InputMaybe<PeriodInput>;
  price?: InputMaybe<Scalars['ID']>;
  quantity?: InputMaybe<Scalars['Int']>;
  stripe_account_id: Scalars['ID'];
  unit_amount?: InputMaybe<Scalars['Int']>;
  unit_amount_decimal?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_MarkdownArgs = {
  access?: InputMaybe<AccessLevel>;
  data?: InputMaybe<Scalars['String']>;
  markdown_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_OrderArgs = {
  order_id: Scalars['ID'];
  processed_at?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_Order_ItemArgs = {
  order_item_id: Scalars['ID'];
  processed_at?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_PageArgs = {
  access?: InputMaybe<AccessLevel>;
  page_id: Scalars['ID'];
};


export type MutationUpdate_Page_BlockArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  data?: InputMaybe<Scalars['Json']>;
  page_block_id: Scalars['ID'];
};


export type MutationUpdate_PriceArgs = {
  price_id: Scalars['ID'];
  status: Scalars['String'];
};


export type MutationUpdate_ProductArgs = {
  default_price_id?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  image_hero?: InputMaybe<ImageInput>;
  image_logo?: InputMaybe<ImageInput>;
  image_logo_id?: InputMaybe<Scalars['ID']>;
  markdown_description_id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  product_id: Scalars['ID'];
  status?: InputMaybe<Scalars['String']>;
  url_name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdate_Product_SettingsArgs = {
  checkout_cancel_url?: InputMaybe<Scalars['String']>;
  checkout_success_url?: InputMaybe<Scalars['String']>;
  setting_id: Scalars['ID'];
};


export type MutationUpdate_Promotion_CodeArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  promotion_code_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type MutationUpdate_ThemeArgs = {
  color_accent?: InputMaybe<Scalars['String']>;
  color_background?: InputMaybe<Scalars['String']>;
  color_error?: InputMaybe<Scalars['String']>;
  color_primary?: InputMaybe<Scalars['String']>;
  color_secondary?: InputMaybe<Scalars['String']>;
  color_success?: InputMaybe<Scalars['String']>;
  color_surface?: InputMaybe<Scalars['String']>;
  image_hero_id?: InputMaybe<Scalars['ID']>;
  image_logo_id?: InputMaybe<Scalars['ID']>;
  theme_id: Scalars['ID'];
};


export type MutationVerify_Password_ResetArgs = {
  password: Scalars['String'];
  verification_code: Scalars['String'];
};


export type MutationVerify_Sign_UpArgs = {
  verification_code: Scalars['String'];
};


export type MutationVoid_InvoiceArgs = {
  invoice_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};

export type MutationResult = {
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Node = {
  id: Scalars['ID'];
};

export type Order = {
  __typename?: 'Order';
  customer: Customer;
  error?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  items: Array<OrderItem>;
  ordered_at: Scalars['DateTime'];
  processed_at?: Maybe<Scalars['DateTime']>;
  state: Scalars['String'];
  stripe_account: StripeAccount;
  stripe_checkout_session: StripeCheckoutSession;
};


export type OrderCustomerArgs = {
  token?: InputMaybe<Scalars['String']>;
};


export type OrderItemsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<OrderItemFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type OrderStripe_Checkout_SessionArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type OrderFilter = {
  customer_id?: InputMaybe<Scalars['ID']>;
  stripe_account_id?: InputMaybe<Scalars['ID']>;
  stripe_checkout_session_id_ext?: InputMaybe<Scalars['ID']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  error?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  order: Order;
  price: Price;
  processed_at?: Maybe<Scalars['DateTime']>;
  state: Scalars['String'];
  stripe_line_item_id_ext: Scalars['String'];
};


export type OrderItemOrderArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type OrderItemFilter = {
  order_id?: InputMaybe<Scalars['ID']>;
  stripe_line_item_id_ext?: InputMaybe<Scalars['ID']>;
};

export type OrderItemMutationResult = MutationResult & {
  __typename?: 'OrderItemMutationResult';
  message?: Maybe<Scalars['String']>;
  order_item?: Maybe<OrderItem>;
  success: Scalars['Boolean'];
};

export type OrderMutationResult = MutationResult & {
  __typename?: 'OrderMutationResult';
  message?: Maybe<Scalars['String']>;
  order?: Maybe<Order>;
  success: Scalars['Boolean'];
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
  access: AccessLevel;
  agency: Agency;
  blocks: Array<PageBlock>;
  definition: PageDefinition;
  id: Scalars['ID'];
  product?: Maybe<Product>;
  url_path: Scalars['String'];
};

export type PageBlock = {
  __typename?: 'PageBlock';
  data: Scalars['Json'];
  definition: PageBlockDefinition;
  id: Scalars['ID'];
  page: Page;
};

export type PageBlockDefinition = Node & {
  __typename?: 'PageBlockDefinition';
  fields: Array<FormField>;
  id: Scalars['ID'];
  name: Scalars['String'];
  page: PageDefinition;
};

export type PageBlockDefinitionFilter = {
  name?: InputMaybe<Scalars['String']>;
  page_definition_id?: InputMaybe<Scalars['ID']>;
};

export type PageBlockFilter = {
  page_block_definition_id?: InputMaybe<Scalars['ID']>;
  page_id?: InputMaybe<Scalars['ID']>;
};

export type PageBlockMutationResult = MutationResult & {
  __typename?: 'PageBlockMutationResult';
  message?: Maybe<Scalars['String']>;
  page_block?: Maybe<PageBlock>;
  success: Scalars['Boolean'];
};

export type PageDefinition = Node & {
  __typename?: 'PageDefinition';
  blocks: Array<PageBlockDefinition>;
  id: Scalars['ID'];
  name: Scalars['String'];
  url_path: Scalars['String'];
};

export type PageDefinitionFilter = {
  name?: InputMaybe<Scalars['String']>;
  url_path?: InputMaybe<Scalars['String']>;
};

export type PageFilter = {
  agency_id?: InputMaybe<Scalars['ID']>;
  page_definition_id?: InputMaybe<Scalars['ID']>;
  product_id?: InputMaybe<Scalars['ID']>;
  url_path?: InputMaybe<Scalars['String']>;
};

export type PageMutationResult = MutationResult & {
  __typename?: 'PageMutationResult';
  message?: Maybe<Scalars['String']>;
  page?: Maybe<Page>;
  success: Scalars['Boolean'];
};

export type PaymentIntent = {
  __typename?: 'PaymentIntent';
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
  id: Scalars['ID'];
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

export type PeriodInput = {
  end: Scalars['Int'];
  start: Scalars['Int'];
};

export type Price = Node & {
  __typename?: 'Price';
  active: Scalars['Boolean'];
  currency: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  product: Product;
  recurring_interval?: Maybe<Scalars['String']>;
  recurring_interval_count?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
  type: Scalars['String'];
  unit_amount: Scalars['Int'];
};

export type PriceFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  product_id?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type PriceMutationResult = MutationResult & {
  __typename?: 'PriceMutationResult';
  message?: Maybe<Scalars['String']>;
  price?: Maybe<Price>;
  success: Scalars['Boolean'];
};

export type Product = Node & {
  __typename?: 'Product';
  active: Scalars['Boolean'];
  agency: Agency;
  default_price?: Maybe<Price>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image_hero?: Maybe<Image>;
  image_logo?: Maybe<Image>;
  integrations?: Maybe<Array<Integration>>;
  markdown_description?: Maybe<Markdown>;
  name: Scalars['String'];
  pages?: Maybe<Array<Page>>;
  prices?: Maybe<Array<Price>>;
  settings: ProductSettings;
  status: Scalars['String'];
  url_name: Scalars['String'];
};


export type ProductPagesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<PageFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type ProductPricesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<PriceFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type ProductFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  agency_id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  url_name?: InputMaybe<Scalars['String']>;
};

export type ProductMutationResult = MutationResult & {
  __typename?: 'ProductMutationResult';
  message?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  success: Scalars['Boolean'];
};

export type ProductSettings = {
  __typename?: 'ProductSettings';
  checkout_cancel_url?: Maybe<Scalars['String']>;
  checkout_success_url?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type ProductSettingsFilter = {
  product_id?: InputMaybe<Scalars['ID']>;
};

export type ProductSettingsMutationResult = MutationResult & {
  __typename?: 'ProductSettingsMutationResult';
  message?: Maybe<Scalars['String']>;
  setting?: Maybe<ProductSettings>;
  success: Scalars['Boolean'];
};

export type PromotionCode = {
  __typename?: 'PromotionCode';
  active: Scalars['Boolean'];
  code: Scalars['String'];
  coupon: Coupon;
  created: Scalars['DateTime'];
  customer?: Maybe<StripeCustomer>;
  expires_at?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  livemode: Scalars['Boolean'];
  max_redemptions?: Maybe<Scalars['Int']>;
  restrictions?: Maybe<PromotionCodeRestrictions>;
  times_redeemed: Scalars['Int'];
};

export type PromotionCodeMutationResult = MutationResult & {
  __typename?: 'PromotionCodeMutationResult';
  message?: Maybe<Scalars['String']>;
  promotion_code?: Maybe<PromotionCode>;
  success: Scalars['Boolean'];
};

export type PromotionCodeRestrictions = {
  __typename?: 'PromotionCodeRestrictions';
  first_time_transaction: Scalars['Boolean'];
  minimum_amount?: Maybe<Scalars['Int']>;
  minimum_amount_currency?: Maybe<Scalars['String']>;
};

export type PromotionCodeRestrictionsInput = {
  first_time_transaction: Scalars['Boolean'];
  minimum_amount?: InputMaybe<Scalars['Int']>;
  minimum_amount_currency?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  agencies?: Maybe<Array<Agency>>;
  agencies_settings?: Maybe<Array<AgencySettings>>;
  agency?: Maybe<Agency>;
  agency_settings?: Maybe<AgencySettings>;
  charge?: Maybe<Charge>;
  charges: Array<Charge>;
  count_agencies: Scalars['Int'];
  count_agencies_settings: Scalars['Int'];
  count_credential_types: Scalars['Int'];
  count_credentials: Scalars['Int'];
  count_customers: Scalars['Int'];
  count_form_fields: Scalars['Int'];
  count_images: Scalars['Int'];
  count_integration_configs: Scalars['Int'];
  count_integration_types: Scalars['Int'];
  count_integrations: Scalars['Int'];
  count_memberships: Scalars['Int'];
  count_order_items: Scalars['Int'];
  count_orders: Scalars['Int'];
  count_page_block_definitions: Scalars['Int'];
  count_page_blocks: Scalars['Int'];
  count_page_definitions: Scalars['Int'];
  count_pages: Scalars['Int'];
  count_prices: Scalars['Int'];
  count_products: Scalars['Int'];
  count_products_settings: Scalars['Int'];
  count_subdomains: Scalars['Int'];
  count_subscription_plans: Scalars['Int'];
  count_themes: Scalars['Int'];
  count_transaction_fees: Scalars['Int'];
  count_users: Scalars['Int'];
  country_codes: Array<Scalars['String']>;
  country_spec?: Maybe<CountrySpec>;
  coupon?: Maybe<Coupon>;
  credential?: Maybe<Credential>;
  credential_type?: Maybe<CredentialType>;
  credential_types?: Maybe<Array<CredentialType>>;
  credentials?: Maybe<Array<Credential>>;
  current_user?: Maybe<User>;
  customer?: Maybe<Customer>;
  customers?: Maybe<Array<Customer>>;
  exchange_rate?: Maybe<ExchangeRate>;
  form_field?: Maybe<FormField>;
  form_fields?: Maybe<Array<FormField>>;
  image?: Maybe<Image>;
  images?: Maybe<Array<Image>>;
  integration?: Maybe<Integration>;
  integration_config?: Maybe<IntegrationConfig>;
  integration_configs?: Maybe<Array<IntegrationConfig>>;
  integration_type?: Maybe<IntegrationType>;
  integration_types?: Maybe<Array<IntegrationType>>;
  integrations?: Maybe<Array<Integration>>;
  invoice?: Maybe<Invoice>;
  invoiceitem?: Maybe<InvoiceItem>;
  markdown?: Maybe<Markdown>;
  markdowns?: Maybe<Array<Markdown>>;
  membership?: Maybe<Membership>;
  memberships?: Maybe<Array<Membership>>;
  order?: Maybe<Order>;
  order_item?: Maybe<OrderItem>;
  order_items?: Maybe<Array<OrderItem>>;
  orders?: Maybe<Array<Order>>;
  page?: Maybe<Page>;
  page_block?: Maybe<PageBlock>;
  page_block_definition?: Maybe<PageBlockDefinition>;
  page_block_definitions?: Maybe<Array<PageBlockDefinition>>;
  page_blocks?: Maybe<Array<PageBlock>>;
  page_by_url?: Maybe<Page>;
  page_definition?: Maybe<PageDefinition>;
  page_definition_by_url_path?: Maybe<PageDefinition>;
  page_definitions?: Maybe<Array<PageDefinition>>;
  pages?: Maybe<Array<Page>>;
  payment_intent?: Maybe<PaymentIntent>;
  payment_intents: Array<PaymentIntent>;
  price?: Maybe<Price>;
  prices?: Maybe<Array<Price>>;
  product?: Maybe<Product>;
  product_settings?: Maybe<ProductSettings>;
  products?: Maybe<Array<Product>>;
  products_settings?: Maybe<Array<ProductSettings>>;
  promotion_code?: Maybe<PromotionCode>;
  promotion_codes: Array<PromotionCode>;
  stripe_account?: Maybe<StripeAccount>;
  subdomain?: Maybe<Subdomain>;
  subdomains?: Maybe<Array<Subdomain>>;
  subscription?: Maybe<StripeSubscription>;
  subscription_item?: Maybe<SubscriptionItem>;
  subscription_items: Array<SubscriptionItem>;
  subscription_plan?: Maybe<SubscriptionPlan>;
  subscription_plans?: Maybe<Array<SubscriptionPlan>>;
  subscriptions: Array<StripeSubscription>;
  theme?: Maybe<Theme>;
  themes?: Maybe<Array<Theme>>;
  transaction_fee?: Maybe<TransactionFee>;
  transaction_fees?: Maybe<Array<TransactionFee>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryAgenciesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: AgencyFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryAgencies_SettingsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: AgencySettingsFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryAgencyArgs = {
  id: Scalars['ID'];
};


export type QueryAgency_SettingsArgs = {
  id: Scalars['ID'];
};


export type QueryChargeArgs = {
  charge_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type QueryChargesArgs = {
  created?: InputMaybe<Scalars['Int']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  payment_intent?: InputMaybe<Scalars['ID']>;
  starting_after?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type QueryCount_AgenciesArgs = {
  filter: AgencyFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Agencies_SettingsArgs = {
  filter: AgencySettingsFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Credential_TypesArgs = {
  filter: CredentialTypeFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_CredentialsArgs = {
  filter: CredentialFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_CustomersArgs = {
  filter: CustomerFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Form_FieldsArgs = {
  filter: FormFieldFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_ImagesArgs = {
  filter: ImageFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Integration_ConfigsArgs = {
  filter: IntegrationConfigFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Integration_TypesArgs = {
  filter: IntegrationTypeFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_IntegrationsArgs = {
  filter: IntegrationFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_MembershipsArgs = {
  filter: MembershipFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Order_ItemsArgs = {
  filter: OrderItemFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_OrdersArgs = {
  filter: OrderFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Page_Block_DefinitionsArgs = {
  filter: PageBlockDefinitionFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Page_BlocksArgs = {
  filter: PageBlockFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Page_DefinitionsArgs = {
  filter: PageDefinitionFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_PagesArgs = {
  filter: PageFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_PricesArgs = {
  filter: PriceFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_ProductsArgs = {
  filter: ProductFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Products_SettingsArgs = {
  filter: ProductSettingsFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_SubdomainsArgs = {
  filter: SubdomainFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Subscription_PlansArgs = {
  filter: SubscriptionPlanFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_ThemesArgs = {
  filter: ThemeFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_Transaction_FeesArgs = {
  filter: TransactionFeeFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCount_UsersArgs = {
  filter: UserFilter;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCountry_SpecArgs = {
  country_code: Scalars['ID'];
};


export type QueryCouponArgs = {
  coupon_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type QueryCredentialArgs = {
  id: Scalars['ID'];
};


export type QueryCredential_TypeArgs = {
  id: Scalars['ID'];
};


export type QueryCredential_TypesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: CredentialTypeFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCredentialsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: CredentialFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCustomerArgs = {
  id: Scalars['ID'];
  stripe_account_id?: InputMaybe<Scalars['ID']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryCustomersArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: CustomerFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryExchange_RateArgs = {
  currency: Scalars['String'];
};


export type QueryForm_FieldArgs = {
  id: Scalars['ID'];
};


export type QueryForm_FieldsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: FormFieldFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryImageArgs = {
  id: Scalars['ID'];
};


export type QueryImagesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: ImageFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryIntegrationArgs = {
  id: Scalars['ID'];
};


export type QueryIntegration_ConfigArgs = {
  id: Scalars['ID'];
};


export type QueryIntegration_ConfigsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: IntegrationConfigFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryIntegration_TypeArgs = {
  id: Scalars['ID'];
};


export type QueryIntegration_TypesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: IntegrationTypeFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryIntegrationsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: IntegrationFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryInvoiceArgs = {
  invoice_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type QueryInvoiceitemArgs = {
  invoiceitem_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type QueryMarkdownArgs = {
  id: Scalars['ID'];
};


export type QueryMarkdownsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: MarkdownFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryMembershipArgs = {
  id: Scalars['ID'];
};


export type QueryMembershipsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: MembershipFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
  token?: InputMaybe<Scalars['String']>;
};


export type QueryOrder_ItemArgs = {
  id: Scalars['ID'];
  token?: InputMaybe<Scalars['String']>;
};


export type QueryOrder_ItemsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: OrderItemFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryOrdersArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: OrderFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryPageArgs = {
  id: Scalars['ID'];
};


export type QueryPage_BlockArgs = {
  id: Scalars['ID'];
};


export type QueryPage_Block_DefinitionArgs = {
  id: Scalars['ID'];
};


export type QueryPage_Block_DefinitionsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: PageBlockDefinitionFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryPage_BlocksArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: PageBlockFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryPage_By_UrlArgs = {
  url: Scalars['String'];
};


export type QueryPage_DefinitionArgs = {
  id: Scalars['ID'];
};


export type QueryPage_Definition_By_Url_PathArgs = {
  url_path: Scalars['String'];
};


export type QueryPage_DefinitionsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: PageDefinitionFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryPagesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: PageFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryPayment_IntentArgs = {
  payment_intent_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type QueryPayment_IntentsArgs = {
  created?: InputMaybe<Scalars['Int']>;
  customer?: InputMaybe<Scalars['ID']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type QueryPriceArgs = {
  id: Scalars['ID'];
};


export type QueryPricesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: PriceFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryProductArgs = {
  id: Scalars['ID'];
};


export type QueryProduct_SettingsArgs = {
  id: Scalars['ID'];
};


export type QueryProductsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: ProductFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryProducts_SettingsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: ProductSettingsFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryPromotion_CodeArgs = {
  promotion_code_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
};


export type QueryPromotion_CodesArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  code?: InputMaybe<Scalars['String']>;
  coupon?: InputMaybe<Scalars['String']>;
  customer?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type QueryStripe_AccountArgs = {
  id: Scalars['ID'];
};


export type QuerySubdomainArgs = {
  id: Scalars['ID'];
};


export type QuerySubdomainsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: SubdomainFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QuerySubscriptionArgs = {
  stripe_account_id: Scalars['ID'];
  subscription_id: Scalars['ID'];
};


export type QuerySubscription_ItemArgs = {
  stripe_account_id: Scalars['ID'];
  subscription_item_id: Scalars['ID'];
};


export type QuerySubscription_ItemsArgs = {
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
  subscription: Scalars['ID'];
};


export type QuerySubscription_PlanArgs = {
  id: Scalars['ID'];
};


export type QuerySubscription_PlansArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: SubscriptionPlanFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QuerySubscriptionsArgs = {
  collection_method?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Int']>;
  current_period_end?: InputMaybe<TimeStampFilter>;
  current_period_start?: InputMaybe<TimeStampFilter>;
  customer?: InputMaybe<Scalars['ID']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['ID']>;
  starting_after?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type QueryThemeArgs = {
  id: Scalars['ID'];
};


export type QueryThemesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: ThemeFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryTransaction_FeeArgs = {
  id: Scalars['ID'];
};


export type QueryTransaction_FeesArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: TransactionFeeFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter: UserFilter;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type SessionAfterExpiration = {
  __typename?: 'SessionAfterExpiration';
  recovery?: Maybe<SessionAfterExpirationRecovery>;
};

export type SessionAfterExpirationRecovery = {
  __typename?: 'SessionAfterExpirationRecovery';
  allow_promotion_codes?: Maybe<Scalars['Boolean']>;
  expires_at?: Maybe<Scalars['DateTime']>;
  url?: Maybe<Scalars['String']>;
};

export type SessionAutomaticTax = {
  __typename?: 'SessionAutomaticTax';
  enabled: Scalars['Boolean'];
  status?: Maybe<Scalars['String']>;
};

export type SessionConsent = {
  __typename?: 'SessionConsent';
  promotions?: Maybe<Scalars['String']>;
};

export type SessionConsentCollection = {
  __typename?: 'SessionConsentCollection';
  promotions?: Maybe<Scalars['String']>;
};

export type SessionCustomerDetails = {
  __typename?: 'SessionCustomerDetails';
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  tax_exempt?: Maybe<Scalars['String']>;
  tax_ids?: Maybe<Array<Maybe<SessionCustomerDetailsTaxId>>>;
};

export type SessionCustomerDetailsTaxId = {
  __typename?: 'SessionCustomerDetailsTaxId';
  type: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type SessionPhoneNumberCollection = {
  __typename?: 'SessionPhoneNumberCollection';
  enabled?: Maybe<Scalars['Boolean']>;
};

export type SessionShipping = {
  __typename?: 'SessionShipping';
  address?: Maybe<Address>;
  carrier?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
};

export type SessionShippingAddressCollection = {
  __typename?: 'SessionShippingAddressCollection';
  allowed_countries: Array<Scalars['String']>;
};

export type SessionShippingOption = {
  __typename?: 'SessionShippingOption';
  shipping_amount: Scalars['Int'];
};

export type SessionTaxIdCollection = {
  __typename?: 'SessionTaxIdCollection';
  enabled?: Maybe<Scalars['Boolean']>;
};

export type SessionTotalDetails = {
  __typename?: 'SessionTotalDetails';
  amount_discount: Scalars['Int'];
  amount_shipping?: Maybe<Scalars['Int']>;
  amount_tax: Scalars['Int'];
  breakdown?: Maybe<SessionTotalDetailsBreakdown>;
};

export type SessionTotalDetailsBreakdown = {
  __typename?: 'SessionTotalDetailsBreakdown';
  discounts: Array<SessionTotalDetailsBreakdownDiscount>;
  taxes: Array<SessionTotalDetailsBreakdownTax>;
};

export type SessionTotalDetailsBreakdownDiscount = {
  __typename?: 'SessionTotalDetailsBreakdownDiscount';
  amount: Scalars['Int'];
};

export type SessionTotalDetailsBreakdownTax = {
  __typename?: 'SessionTotalDetailsBreakdownTax';
  amount: Scalars['Int'];
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
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type StripeAccount = {
  __typename?: 'StripeAccount';
  account_update_url: StripeAccountLink;
  balance: StripeBalance;
  balance_transactions: Array<BalanceTransaction>;
  bank_accounts: Array<BankAccount>;
  business_profile: BusinessProfile;
  business_type?: Maybe<Scalars['String']>;
  capabilities: StripeCapabilities;
  charges: Array<Charge>;
  charges_enabled: Scalars['Boolean'];
  country: Scalars['String'];
  coupons: Array<Coupon>;
  created: Scalars['DateTime'];
  customers: Array<Customer>;
  default_currency?: Maybe<Scalars['String']>;
  details_submitted: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  invoiceitems: Array<InvoiceItem>;
  invoices: Array<Invoice>;
  livemode: Scalars['Boolean'];
  payment_intents: Array<PaymentIntent>;
  payouts_enabled: Scalars['Boolean'];
  requirements: StripeRequirements;
  settings: StripeSettings;
  subscriptions: Array<StripeSubscription>;
};


export type StripeAccountBalance_TransactionsArgs = {
  available_on?: InputMaybe<Scalars['Int']>;
  created?: InputMaybe<Scalars['Int']>;
  currency?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  payout_id?: InputMaybe<Scalars['ID']>;
  starting_after?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type StripeAccountBank_AccountsArgs = {
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
};


export type StripeAccountChargesArgs = {
  created?: InputMaybe<Scalars['Int']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  payment_intent?: InputMaybe<Scalars['ID']>;
  starting_after?: InputMaybe<Scalars['String']>;
};


export type StripeAccountCouponsArgs = {
  created?: InputMaybe<Scalars['Int']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
};


export type StripeAccountCustomersArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CustomerFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type StripeAccountInvoiceitemsArgs = {
  created?: InputMaybe<Scalars['Int']>;
  customer?: InputMaybe<Scalars['ID']>;
  ending_before?: InputMaybe<Scalars['String']>;
  invoice?: InputMaybe<Scalars['ID']>;
  limit?: InputMaybe<Scalars['Int']>;
  pending?: InputMaybe<Scalars['Boolean']>;
  starting_after?: InputMaybe<Scalars['String']>;
};


export type StripeAccountInvoicesArgs = {
  collection_method?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Int']>;
  customer?: InputMaybe<Scalars['ID']>;
  due_date?: InputMaybe<Scalars['Int']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  subscription?: InputMaybe<Scalars['ID']>;
};


export type StripeAccountPayment_IntentsArgs = {
  created?: InputMaybe<Scalars['Int']>;
  customer?: InputMaybe<Scalars['ID']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
};


export type StripeAccountSubscriptionsArgs = {
  collection_method?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Int']>;
  current_period_end?: InputMaybe<TimeStampFilter>;
  current_period_start?: InputMaybe<TimeStampFilter>;
  customer?: InputMaybe<Scalars['ID']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['ID']>;
  starting_after?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type StripeAccountLink = {
  __typename?: 'StripeAccountLink';
  created: Scalars['Int'];
  expires_at: Scalars['Int'];
  type: Scalars['String'];
  url: Scalars['String'];
};

export type StripeBalance = {
  __typename?: 'StripeBalance';
  available: Array<StripeCurrencyBalance>;
  connect_reserved?: Maybe<Array<StripeCurrencyBalance>>;
  instant_available?: Maybe<Array<StripeCurrencyBalance>>;
  pending: Array<StripeCurrencyBalance>;
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
  after_expiration?: Maybe<SessionAfterExpiration>;
  allow_promotion_codes?: Maybe<Scalars['Boolean']>;
  amount_subtotal?: Maybe<Scalars['Int']>;
  amount_total?: Maybe<Scalars['Int']>;
  automatic_tax?: Maybe<SessionAutomaticTax>;
  billing_address_collection?: Maybe<Scalars['String']>;
  cancel_url?: Maybe<Scalars['String']>;
  client_reference_id?: Maybe<Scalars['String']>;
  consent?: Maybe<SessionConsent>;
  consent_collection?: Maybe<SessionConsentCollection>;
  currency?: Maybe<Scalars['String']>;
  customer?: Maybe<StripeCustomer>;
  customer_details?: Maybe<SessionCustomerDetails>;
  customer_email?: Maybe<Scalars['String']>;
  expires_at?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  line_items: Array<LineItem>;
  livemode?: Maybe<Scalars['Boolean']>;
  locale?: Maybe<Scalars['String']>;
  mode?: Maybe<Scalars['String']>;
  payment_intent?: Maybe<PaymentIntent>;
  payment_method_types?: Maybe<Array<Maybe<Scalars['String']>>>;
  payment_status?: Maybe<Scalars['String']>;
  phone_number_collection?: Maybe<SessionPhoneNumberCollection>;
  shipping?: Maybe<Shipping>;
  shipping_address_collection?: Maybe<SessionShippingAddressCollection>;
  shipping_options: Array<SessionShippingOption>;
  status?: Maybe<Scalars['String']>;
  submit_type?: Maybe<Scalars['String']>;
  subscription?: Maybe<StripeSubscription>;
  success_url: Scalars['String'];
  tax_id_collection?: Maybe<SessionTaxIdCollection>;
  total_details?: Maybe<SessionTotalDetails>;
  url?: Maybe<Scalars['String']>;
};


export type StripeCheckoutSessionLine_ItemsArgs = {
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
};

export type StripeCurrencyBalance = {
  __typename?: 'StripeCurrencyBalance';
  amount: Scalars['Int'];
  currency: Scalars['String'];
  source_types: StripeBalanceSource;
};

export type StripeCustomer = {
  __typename?: 'StripeCustomer';
  address?: Maybe<Address>;
  balance?: Maybe<Scalars['Int']>;
  created?: Maybe<Scalars['DateTime']>;
  currency?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
  delinquent?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  invoice_prefix?: Maybe<Scalars['String']>;
  invoiceitems: Array<InvoiceItem>;
  invoices: Array<Invoice>;
  name?: Maybe<Scalars['String']>;
  next_invoice_sequence?: Maybe<Scalars['Int']>;
  payment_intents: Array<PaymentIntent>;
  phone?: Maybe<Scalars['String']>;
  preferred_locales?: Maybe<Array<Maybe<Scalars['String']>>>;
  subscriptions: Array<StripeSubscription>;
};


export type StripeCustomerInvoiceitemsArgs = {
  created?: InputMaybe<Scalars['Int']>;
  ending_before?: InputMaybe<Scalars['String']>;
  invoice?: InputMaybe<Scalars['ID']>;
  limit?: InputMaybe<Scalars['Int']>;
  pending?: InputMaybe<Scalars['Boolean']>;
  starting_after?: InputMaybe<Scalars['String']>;
};


export type StripeCustomerInvoicesArgs = {
  collection_method?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Int']>;
  due_date?: InputMaybe<Scalars['Int']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  subscription?: InputMaybe<Scalars['ID']>;
};


export type StripeCustomerPayment_IntentsArgs = {
  created?: InputMaybe<Scalars['Int']>;
  customer?: InputMaybe<Scalars['ID']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
};


export type StripeCustomerSubscriptionsArgs = {
  collection_method?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Int']>;
  current_period_end?: InputMaybe<TimeStampFilter>;
  current_period_start?: InputMaybe<TimeStampFilter>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['ID']>;
  starting_after?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type StripePrice = {
  __typename?: 'StripePrice';
  active: Scalars['Boolean'];
  billing_scheme: Scalars['String'];
  created?: Maybe<Scalars['DateTime']>;
  currency: Scalars['String'];
  id: Scalars['String'];
  livemode: Scalars['Boolean'];
  lookup_key?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  product?: Maybe<StripeProduct>;
  recurring?: Maybe<StripePriceRecurring>;
  tax_behavior?: Maybe<Scalars['String']>;
  tiers?: Maybe<Array<StripePriceTier>>;
  tiers_mode?: Maybe<Scalars['String']>;
  transform_quantity?: Maybe<StripePriceTransformQuantity>;
  type: Scalars['String'];
  unit_amount?: Maybe<Scalars['Int']>;
  unit_amount_decimal?: Maybe<Scalars['String']>;
};

export type StripePriceRecurring = {
  __typename?: 'StripePriceRecurring';
  aggregate_usage?: Maybe<Scalars['String']>;
  interval: Scalars['String'];
  interval_count: Scalars['Int'];
  trial_period_days?: Maybe<Scalars['Int']>;
  usage_type?: Maybe<Scalars['String']>;
};

export type StripePriceTier = {
  __typename?: 'StripePriceTier';
  flat_amount?: Maybe<Scalars['Int']>;
  flat_amount_decimal?: Maybe<Scalars['String']>;
  unit_amount?: Maybe<Scalars['Int']>;
  unit_amount_decimal?: Maybe<Scalars['String']>;
  up_to?: Maybe<Scalars['Int']>;
};

export type StripePriceTransformQuantity = {
  __typename?: 'StripePriceTransformQuantity';
  divide_by?: Maybe<Scalars['Int']>;
  round?: Maybe<Scalars['String']>;
};

export type StripeProduct = {
  __typename?: 'StripeProduct';
  active: Scalars['Boolean'];
  attributes?: Maybe<Array<Scalars['String']>>;
  caption?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  deactivate_on?: Maybe<Array<Scalars['String']>>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images: Array<Scalars['String']>;
  livemode: Scalars['Boolean'];
  name: Scalars['String'];
  package_dimensions?: Maybe<StripeProductPackageDimensions>;
  shippable?: Maybe<Scalars['Boolean']>;
  statement_descriptor?: Maybe<Scalars['String']>;
  tax_code?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  unit_label?: Maybe<Scalars['String']>;
  updated: Scalars['DateTime'];
  url?: Maybe<Scalars['String']>;
};

export type StripeProductPackageDimensions = {
  __typename?: 'StripeProductPackageDimensions';
  height: Scalars['Int'];
  length: Scalars['Int'];
  weight: Scalars['Int'];
  width: Scalars['Int'];
};

export type StripeRequirements = {
  __typename?: 'StripeRequirements';
  current_deadline?: Maybe<Scalars['String']>;
  currently_due: Array<Maybe<Scalars['String']>>;
  disabled_reason?: Maybe<Scalars['String']>;
  eventually_due: Array<Maybe<Scalars['String']>>;
  past_due: Array<Maybe<Scalars['String']>>;
  pending_verification: Array<Maybe<Scalars['String']>>;
};

export type StripeSettings = {
  __typename?: 'StripeSettings';
  branding?: Maybe<StripeBranding>;
};

export type StripeSubscription = {
  __typename?: 'StripeSubscription';
  application_fee_percent?: Maybe<Scalars['Int']>;
  automatic_tax: SubscriptionAutomaticTax;
  billing_cycle_anchor: Scalars['DateTime'];
  billing_thresholds?: Maybe<SubscriptionBillingThresholds>;
  cancel_at?: Maybe<Scalars['DateTime']>;
  cancel_at_period_end: Scalars['Boolean'];
  canceled_at?: Maybe<Scalars['DateTime']>;
  collection_method: Scalars['String'];
  created: Scalars['DateTime'];
  current_period_end: Scalars['DateTime'];
  current_period_start: Scalars['DateTime'];
  customer?: Maybe<StripeCustomer>;
  days_until_due?: Maybe<Scalars['Int']>;
  discount?: Maybe<Discount>;
  ended_at?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  items: Array<SubscriptionItem>;
  latest_invoice?: Maybe<Invoice>;
  livemode: Scalars['Boolean'];
  next_pending_invoice_item_invoice?: Maybe<Scalars['DateTime']>;
  pause_collection?: Maybe<SubscriptionPauseCollection>;
  payment_settings?: Maybe<SubscriptionPaymentSettings>;
  pending_invoice_item_interval?: Maybe<Scalars['String']>;
  pending_update?: Maybe<SubscriptionPendingUpdate>;
  start_date: Scalars['DateTime'];
  status: Scalars['String'];
  trial_end?: Maybe<Scalars['DateTime']>;
  trial_start?: Maybe<Scalars['DateTime']>;
};


export type StripeSubscriptionItemsArgs = {
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
};

export type Subdomain = Node & {
  __typename?: 'Subdomain';
  agency: Agency;
  id: Scalars['ID'];
  memberships: Array<Membership>;
  name: Scalars['String'];
};


export type SubdomainMembershipsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MembershipFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type SubdomainFilter = {
  name?: InputMaybe<Scalars['String']>;
};

export type SubscriptionAcssDebit = {
  __typename?: 'SubscriptionAcssDebit';
  mandate_options?: Maybe<SubscriptionAcssDebitMandateOptions>;
  verification_method?: Maybe<Scalars['String']>;
};

export type SubscriptionAcssDebitMandateOptions = {
  __typename?: 'SubscriptionAcssDebitMandateOptions';
  transaction_type?: Maybe<Scalars['String']>;
};

export type SubscriptionAutomaticTax = {
  __typename?: 'SubscriptionAutomaticTax';
  enabled: Scalars['Boolean'];
};

export type SubscriptionBancontact = {
  __typename?: 'SubscriptionBancontact';
  preferred_language: Scalars['String'];
};

export type SubscriptionBillingThresholds = {
  __typename?: 'SubscriptionBillingThresholds';
  amount_gte?: Maybe<Scalars['Int']>;
  reset_billing_cycle_anchor?: Maybe<Scalars['Boolean']>;
};

export type SubscriptionCard = {
  __typename?: 'SubscriptionCard';
  request_three_d_secure?: Maybe<Scalars['String']>;
};

export type SubscriptionItem = {
  __typename?: 'SubscriptionItem';
  billing_thresholds?: Maybe<SubscriptionItemBillingThresholds>;
  created: Scalars['DateTime'];
  id: Scalars['ID'];
  price?: Maybe<StripePrice>;
  quantity?: Maybe<Scalars['Int']>;
  subscription: StripeSubscription;
};

export type SubscriptionItemBillingThresholds = {
  __typename?: 'SubscriptionItemBillingThresholds';
  usage_gte?: Maybe<Scalars['Int']>;
};

export type SubscriptionItemInput = {
  price: Scalars['ID'];
  quantity?: InputMaybe<Scalars['Int']>;
};

export type SubscriptionMutationResult = MutationResult & {
  __typename?: 'SubscriptionMutationResult';
  message?: Maybe<Scalars['String']>;
  subscription?: Maybe<StripeSubscription>;
  success: Scalars['Boolean'];
};

export type SubscriptionPauseCollection = {
  __typename?: 'SubscriptionPauseCollection';
  behavior: Scalars['String'];
  resumes_at?: Maybe<Scalars['Int']>;
};

export type SubscriptionPaymentMethodOptions = {
  __typename?: 'SubscriptionPaymentMethodOptions';
  acss_debit?: Maybe<SubscriptionAcssDebit>;
  bancontact?: Maybe<SubscriptionBancontact>;
  card?: Maybe<SubscriptionCard>;
};

export type SubscriptionPaymentSettings = {
  __typename?: 'SubscriptionPaymentSettings';
  payment_method_options?: Maybe<SubscriptionPaymentMethodOptions>;
  payment_method_types?: Maybe<Array<Scalars['String']>>;
};

export type SubscriptionPendingUpdate = {
  __typename?: 'SubscriptionPendingUpdate';
  billing_cycle_anchor?: Maybe<Scalars['Int']>;
  expires_at: Scalars['Int'];
  subscription_items: Array<SubscriptionItem>;
  trial_end?: Maybe<Scalars['Int']>;
  trial_from_plan?: Maybe<Scalars['Boolean']>;
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  calculate_fee: Scalars['Int'];
  fee_percent_for_subscriptions: Scalars['Float'];
  id: Scalars['ID'];
  name: Scalars['String'];
  transaction_fees: Array<TransactionFee>;
};


export type SubscriptionPlanCalculate_FeeArgs = {
  amount: Scalars['Int'];
  currency: Scalars['String'];
};

export type SubscriptionPlanFilter = {
  name?: InputMaybe<Scalars['String']>;
};

export type Theme = Node & {
  __typename?: 'Theme';
  agency: Agency;
  color_accent?: Maybe<Scalars['String']>;
  color_background?: Maybe<Scalars['String']>;
  color_error?: Maybe<Scalars['String']>;
  color_primary?: Maybe<Scalars['String']>;
  color_secondary?: Maybe<Scalars['String']>;
  color_success?: Maybe<Scalars['String']>;
  color_surface?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image_hero?: Maybe<Image>;
  image_logo?: Maybe<Image>;
  name: Scalars['String'];
};

export type ThemeFilter = {
  agency_id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type TimeStampFilter = {
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
};

export type TransactionFee = {
  __typename?: 'TransactionFee';
  currency: Scalars['String'];
  data: Scalars['Json'];
  fixed_amount: Scalars['Int'];
  id: Scalars['ID'];
  percentage: Scalars['Float'];
  subscription_plan: SubscriptionPlan;
  transaction_amount_upper_bound: Scalars['Int'];
};

export type TransactionFeeFilter = {
  subscription_plan_id?: InputMaybe<Scalars['ID']>;
};

export type UpdateThemeResult = MutationResult & {
  __typename?: 'UpdateThemeResult';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  theme?: Maybe<Theme>;
};

export type User = Node & {
  __typename?: 'User';
  email_address: Scalars['String'];
  id: Scalars['ID'];
  memberships: Array<Membership>;
  name: Scalars['String'];
};


export type UserMembershipsArgs = {
  after_id?: InputMaybe<Scalars['ID']>;
  before_id?: InputMaybe<Scalars['ID']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MembershipFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type UserFilter = {
  email_address?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Stripe_AccountFragment = { __typename?: 'StripeAccount', id: string, id_ext: string, business_type?: string | null, charges_enabled: boolean, country: string, created: any, default_currency?: string | null, details_submitted: boolean, email?: string | null, payouts_enabled: boolean, business_profile: { __typename?: 'BusinessProfile', mcc?: string | null, name?: string | null, product_description?: string | null, support_address?: string | null, support_email?: string | null, support_phone?: string | null, support_url?: string | null, url?: string | null }, capabilities: { __typename?: 'StripeCapabilities', card_payments?: string | null, transfers?: string | null }, requirements: { __typename?: 'StripeRequirements', current_deadline?: string | null, disabled_reason?: string | null, currently_due: Array<string | null>, eventually_due: Array<string | null>, past_due: Array<string | null>, pending_verification: Array<string | null> }, settings: { __typename?: 'StripeSettings', branding?: { __typename?: 'StripeBranding', icon?: string | null, logo?: string | null, primary_color?: string | null, secondary_color?: string | null } | null } };

export type AddressFragment = { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null };

export type UserFragment = { __typename?: 'User', id: string, name: string, email_address: string };

export type MarkdownFragment = { __typename?: 'Markdown', id: string, name: string, data: string };

export type ImageFragment = { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel };

export type ThemeFragment = { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null };

export type PriceFragment = { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null };

export type Balance_TransactionFragment = { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null };

export type Stripe_CustomerFragment = { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null };

export type SubscriptionFragment = { __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, latest_invoice?: { __typename?: 'Invoice', id: string } | null, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null };

export type Subscription_ItemFragment = { __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } };

export type CouponFragment = { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null };

export type Promotion_CodeFragment = { __typename?: 'PromotionCode', id: string, active: boolean, code: string, created: any, expires_at?: any | null, livemode: boolean, max_redemptions?: number | null, times_redeemed: number, coupon: { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null }, customer?: { __typename?: 'StripeCustomer', id: string } | null, restrictions?: { __typename?: 'PromotionCodeRestrictions', first_time_transaction: boolean, minimum_amount?: number | null, minimum_amount_currency?: string | null } | null };

export type ChargeFragment = { __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null };

export type Payment_IntentFragment = { __typename?: 'PaymentIntent', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, canceled_at?: any | null, cancellation_reason?: string | null, capture_method?: string | null, confirmation_method?: string | null, created?: any | null, currency?: string | null, description?: string | null, invoice?: string | null, on_behalf_of?: string | null, payment_method?: string | null, payment_method_types?: Array<string | null> | null, receipt_email?: string | null, setup_future_usage?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer_group?: string | null, charges?: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null> | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null };

export type ProductFragment = { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null };

export type Product_SettingsFragment = { __typename?: 'ProductSettings', id: string, checkout_success_url?: string | null, checkout_cancel_url?: string | null };

export type MembershipFragment = { __typename?: 'Membership', id: string, access: AccessLevel, user: { __typename?: 'User', id: string, name: string, email_address: string }, subdomain: { __typename?: 'Subdomain', id: string, agency: { __typename?: 'Agency', id: string } } };

export type Transaction_FeeFragment = { __typename?: 'TransactionFee', id: string, percentage: number, fixed_amount: number, currency: string, transaction_amount_upper_bound: number, data: any, subscription_plan: { __typename?: 'SubscriptionPlan', id: string } };

export type Subscription_PlanFragment = { __typename?: 'SubscriptionPlan', id: string, name: string, transaction_fees: Array<{ __typename?: 'TransactionFee', id: string, percentage: number, fixed_amount: number, currency: string, transaction_amount_upper_bound: number, data: any, subscription_plan: { __typename?: 'SubscriptionPlan', id: string } }> };

export type AgencyFragment = { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: string | null, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } };

export type Agency_SettingsFragment = { __typename?: 'AgencySettings', id: string, checkout_success_url?: string | null, checkout_cancel_url?: string | null };

export type CustomerFragment = { __typename?: 'Customer', id: string, name?: string | null, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }>, user?: { __typename?: 'User', id: string, name: string, email_address: string } | null };

export type SubdomainFragment = { __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: string | null, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } }, memberships: Array<{ __typename?: 'Membership', id: string, access: AccessLevel, user: { __typename?: 'User', id: string, name: string, email_address: string }, subdomain: { __typename?: 'Subdomain', id: string, agency: { __typename?: 'Agency', id: string } } }> };

export type Form_FieldFragment = { __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null };

export type Credential_TypeFragment = { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null };

export type CredentialFragment = { __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } };

export type IntegrationFragment = { __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, product?: { __typename?: 'Product', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: { __typename?: 'IntegrationConfig', id: string } | null };

export type Integration_ConfigFragment = { __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string } };

export type Integration_TypeFragment = { __typename?: 'IntegrationType', id: string, name: string, title: string, status: string, automatic_order_management: boolean, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null, config_fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null, credential_type?: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } | null };

export type Page_DefinitionFragment = { __typename?: 'PageDefinition', id: string, name: string, url_path: string };

export type Page_Block_DefinitionFragment = { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> };

export type PageFragment = { __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: { __typename?: 'Product', id: string } | null, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } }> };

export type Page_BlockFragment = { __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } };

export type Line_ItemFragment = { __typename?: 'LineItem', id: string, amount_subtotal: number, amount_total: number, currency: string, description: string, quantity?: number | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null };

export type Stripe_PriceFragment = { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null };

export type Stripe_ProductFragment = { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null };

export type Stripe_Checkout_SessionFragment = { __typename?: 'StripeCheckoutSession', id: string, allow_promotion_codes?: boolean | null, amount_subtotal?: number | null, amount_total?: number | null, billing_address_collection?: string | null, cancel_url?: string | null, client_reference_id?: string | null, currency?: string | null, customer_email?: string | null, expires_at?: any | null, livemode?: boolean | null, locale?: string | null, mode?: string | null, payment_method_types?: Array<string | null> | null, payment_status?: string | null, status?: string | null, submit_type?: string | null, success_url: string, url?: string | null, after_expiration?: { __typename?: 'SessionAfterExpiration', recovery?: { __typename?: 'SessionAfterExpirationRecovery', allow_promotion_codes?: boolean | null, expires_at?: any | null, url?: string | null } | null } | null, automatic_tax?: { __typename?: 'SessionAutomaticTax', enabled: boolean, status?: string | null } | null, consent?: { __typename?: 'SessionConsent', promotions?: string | null } | null, consent_collection?: { __typename?: 'SessionConsentCollection', promotions?: string | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_details?: { __typename?: 'SessionCustomerDetails', email?: string | null, phone?: string | null, tax_exempt?: string | null, tax_ids?: Array<{ __typename?: 'SessionCustomerDetailsTaxId', type: string, value?: string | null } | null> | null } | null, line_items: Array<{ __typename?: 'LineItem', id: string, amount_subtotal: number, amount_total: number, currency: string, description: string, quantity?: number | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null }>, payment_intent?: { __typename?: 'PaymentIntent', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, canceled_at?: any | null, cancellation_reason?: string | null, capture_method?: string | null, confirmation_method?: string | null, created?: any | null, currency?: string | null, description?: string | null, invoice?: string | null, on_behalf_of?: string | null, payment_method?: string | null, payment_method_types?: Array<string | null> | null, receipt_email?: string | null, setup_future_usage?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer_group?: string | null, charges?: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null> | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null } | null, phone_number_collection?: { __typename?: 'SessionPhoneNumberCollection', enabled?: boolean | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, shipping_address_collection?: { __typename?: 'SessionShippingAddressCollection', allowed_countries: Array<string> } | null, shipping_options: Array<{ __typename?: 'SessionShippingOption', shipping_amount: number }>, subscription?: { __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, latest_invoice?: { __typename?: 'Invoice', id: string } | null, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null } | null, tax_id_collection?: { __typename?: 'SessionTaxIdCollection', enabled?: boolean | null } | null, total_details?: { __typename?: 'SessionTotalDetails', amount_discount: number, amount_shipping?: number | null, amount_tax: number, breakdown?: { __typename?: 'SessionTotalDetailsBreakdown', discounts: Array<{ __typename?: 'SessionTotalDetailsBreakdownDiscount', amount: number }>, taxes: Array<{ __typename?: 'SessionTotalDetailsBreakdownTax', amount: number }> } | null } | null };

export type DiscountFragment = { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null };

export type InvoiceFragment = { __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null };

export type Invoice_Line_ItemFragment = { __typename?: 'InvoiceLineItem', id: string, amount: number, currency: string, description?: string | null, discountable: boolean, invoice_item?: string | null, livemode: boolean, proration: boolean, quantity?: number | null, subscription?: string | null, subscription_item?: string | null, type: string, discount_amounts?: Array<{ __typename?: 'InvoiceLineItemDiscountAmount', amount?: number | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null }> | null, price?: { __typename?: 'StripePrice', id: string } | null };

export type InvoiceitemFragment = { __typename?: 'InvoiceItem', id: string, amount: number, currency: string, date: any, description?: string | null, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: number | null, unit_amount_decimal?: string | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discounts?: Array<{ __typename?: 'Discount', id: string }> | null, invoice?: { __typename?: 'Invoice', id: string } | null, price?: { __typename?: 'StripePrice', id: string } | null };

export type Order_ItemFragment = { __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: string | null, processed_at?: any | null, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } } };

export type OrderFragment = { __typename?: 'Order', id: string, state: string, error?: string | null, ordered_at: any, processed_at?: any | null };

export type Bank_AccountFragment = { __typename?: 'BankAccount', id: string, account_holder_name?: string | null, account_holder_type?: string | null, available_payout_methods?: Array<string> | null, bank_name?: string | null, country: string, currency: string, default_for_currency?: boolean | null, fingerprint?: string | null, last4: string, routing_number?: string | null, status: string };

export type BeginVisitMutationVariables = Exact<{ [key: string]: never; }>;


export type BeginVisitMutation = { __typename?: 'Mutation', begin_visit: { __typename?: 'BeginVisitResult', success: boolean, message?: string | null, jwt?: string | null } };

export type EndVisitMutationVariables = Exact<{ [key: string]: never; }>;


export type EndVisitMutation = { __typename?: 'Mutation', end_visit: { __typename?: 'SimpleResult', success: boolean, message?: string | null } };

export type LogInMutationVariables = Exact<{
  email_address: Scalars['String'];
  password: Scalars['String'];
  recaptcha_token?: InputMaybe<Scalars['String']>;
}>;


export type LogInMutation = { __typename?: 'Mutation', log_in: { __typename?: 'LogInResult', success: boolean, message?: string | null, jwt?: string | null } };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename?: 'Mutation', log_out: { __typename?: 'SimpleResult', success: boolean, message?: string | null } };

export type VerifyPasswordResetMutationVariables = Exact<{
  verification_code: Scalars['String'];
  password: Scalars['String'];
}>;


export type VerifyPasswordResetMutation = { __typename?: 'Mutation', verify_password_reset: { __typename?: 'SimpleResult', success: boolean, message?: string | null } };

export type VerifySignUpMutationVariables = Exact<{
  verification_code: Scalars['String'];
}>;


export type VerifySignUpMutation = { __typename?: 'Mutation', verify_sign_up: { __typename?: 'SimpleResult', success: boolean, message?: string | null } };

export type StartPasswordResetMutationVariables = Exact<{
  email_address: Scalars['String'];
  redirect_url?: InputMaybe<Scalars['String']>;
}>;


export type StartPasswordResetMutation = { __typename?: 'Mutation', start_password_reset: { __typename?: 'SimpleResult', success: boolean, message?: string | null } };

export type StartSignUpMutationVariables = Exact<{
  email_address: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  redirect_url?: InputMaybe<Scalars['String']>;
  recaptcha_token?: InputMaybe<Scalars['String']>;
}>;


export type StartSignUpMutation = { __typename?: 'Mutation', start_sign_up: { __typename?: 'SimpleResult', success: boolean, message?: string | null } };

export type CreateAgencyMutationVariables = Exact<{
  name: Scalars['String'];
  livemode: Scalars['Boolean'];
  subdomain_name: Scalars['String'];
  country_code: Scalars['String'];
  image_logo: ImageInput;
  return_url: Scalars['String'];
}>;


export type CreateAgencyMutation = { __typename?: 'Mutation', create_agency: { __typename?: 'CreateAgencyResult', stripe_verification_url?: string | null, message?: string | null, success: boolean, agency?: { __typename?: 'Agency', id: string, name: string, subdomain: { __typename?: 'Subdomain', id: string, name: string } } | null } };

export type UpdateAgencyMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  default_pricing_currency?: InputMaybe<Scalars['String']>;
}>;


export type UpdateAgencyMutation = { __typename?: 'Mutation', update_agency: { __typename?: 'AgencyMutationResult', message?: string | null, success: boolean, agency?: { __typename?: 'Agency', id: string, name: string, default_pricing_currency?: string | null } | null } };

export type UpdateThemeMutationVariables = Exact<{
  theme_id: Scalars['ID'];
  image_logo_id?: InputMaybe<Scalars['ID']>;
  image_hero_id?: InputMaybe<Scalars['ID']>;
  color_primary?: InputMaybe<Scalars['String']>;
  color_secondary?: InputMaybe<Scalars['String']>;
  color_accent?: InputMaybe<Scalars['String']>;
  color_background?: InputMaybe<Scalars['String']>;
  color_surface?: InputMaybe<Scalars['String']>;
  color_error?: InputMaybe<Scalars['String']>;
  color_success?: InputMaybe<Scalars['String']>;
}>;


export type UpdateThemeMutation = { __typename?: 'Mutation', update_theme: { __typename?: 'UpdateThemeResult', message?: string | null, success: boolean, theme?: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } | null } };

export type CreateImageMutationVariables = Exact<{
  agency_id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['String'];
  color: Scalars['String'];
  access?: InputMaybe<AccessLevel>;
}>;


export type CreateImageMutation = { __typename?: 'Mutation', create_image: { __typename?: 'ImageMutationResult', success: boolean, message?: string | null, image?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } };

export type UpdateImageMutationVariables = Exact<{
  image_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  access?: InputMaybe<AccessLevel>;
}>;


export type UpdateImageMutation = { __typename?: 'Mutation', update_image: { __typename?: 'ImageMutationResult', success: boolean, message?: string | null, image?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } };

export type CreateProductMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  url_name: Scalars['String'];
  duration?: InputMaybe<Scalars['String']>;
  image_logo?: InputMaybe<ImageInput>;
  image_hero?: InputMaybe<ImageInput>;
  status?: InputMaybe<Scalars['String']>;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', create_product: { __typename?: 'ProductMutationResult', success: boolean, message?: string | null, product?: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } | null } };

export type UpdateProductMutationVariables = Exact<{
  product_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  url_name?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  default_price_id?: InputMaybe<Scalars['ID']>;
  image_logo?: InputMaybe<ImageInput>;
  image_hero?: InputMaybe<ImageInput>;
  status?: InputMaybe<Scalars['String']>;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', update_product: { __typename?: 'ProductMutationResult', success: boolean, message?: string | null, product?: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } | null } };

export type DeleteProductMutationVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', delete_product: { __typename?: 'ProductMutationResult', success: boolean, message?: string | null, product?: { __typename?: 'Product', id: string } | null } };

export type CreatePriceMutationVariables = Exact<{
  product_id: Scalars['ID'];
  unit_amount: Scalars['Int'];
  currency: Scalars['String'];
  recurring_interval?: InputMaybe<Scalars['String']>;
  recurring_interval_count?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['String']>;
}>;


export type CreatePriceMutation = { __typename?: 'Mutation', create_price: { __typename?: 'PriceMutationResult', success: boolean, message?: string | null, price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null } };

export type CreateCouponMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  amount_off?: InputMaybe<Scalars['Int']>;
  currency?: InputMaybe<Scalars['String']>;
  percent_off?: InputMaybe<Scalars['Int']>;
  duration?: InputMaybe<Scalars['String']>;
  duration_in_months?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  applies_to?: InputMaybe<CouponAppliesToInput>;
  max_redemptions?: InputMaybe<Scalars['Int']>;
  redeem_by?: InputMaybe<Scalars['Int']>;
}>;


export type CreateCouponMutation = { __typename?: 'Mutation', create_coupon: { __typename?: 'CouponMutationResult', success: boolean, message?: string | null, coupon?: { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null } | null } };

export type UpdateCouponMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  coupon_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
}>;


export type UpdateCouponMutation = { __typename?: 'Mutation', update_coupon: { __typename?: 'CouponMutationResult', success: boolean, message?: string | null, coupon?: { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null } | null } };

export type DeleteCouponMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  coupon_id: Scalars['ID'];
}>;


export type DeleteCouponMutation = { __typename?: 'Mutation', delete_coupon: { __typename?: 'CouponMutationResult', success: boolean, message?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null } };

export type CreatePromotionCodeMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  coupon: Scalars['String'];
  active?: InputMaybe<Scalars['Boolean']>;
  code?: InputMaybe<Scalars['String']>;
  customer?: InputMaybe<Scalars['String']>;
  expires_at?: InputMaybe<Scalars['Int']>;
  max_redemptions?: InputMaybe<Scalars['Int']>;
  restrictions?: InputMaybe<PromotionCodeRestrictionsInput>;
}>;


export type CreatePromotionCodeMutation = { __typename?: 'Mutation', create_promotion_code: { __typename?: 'PromotionCodeMutationResult', success: boolean, message?: string | null, promotion_code?: { __typename?: 'PromotionCode', id: string, active: boolean, code: string, created: any, expires_at?: any | null, livemode: boolean, max_redemptions?: number | null, times_redeemed: number, coupon: { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null }, customer?: { __typename?: 'StripeCustomer', id: string } | null, restrictions?: { __typename?: 'PromotionCodeRestrictions', first_time_transaction: boolean, minimum_amount?: number | null, minimum_amount_currency?: string | null } | null } | null } };

export type UpdatePromotionCodeMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  promotion_code_id: Scalars['ID'];
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdatePromotionCodeMutation = { __typename?: 'Mutation', update_promotion_code: { __typename?: 'PromotionCodeMutationResult', success: boolean, message?: string | null, promotion_code?: { __typename?: 'PromotionCode', id: string, active: boolean, code: string, created: any, expires_at?: any | null, livemode: boolean, max_redemptions?: number | null, times_redeemed: number, coupon: { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null }, customer?: { __typename?: 'StripeCustomer', id: string } | null, restrictions?: { __typename?: 'PromotionCodeRestrictions', first_time_transaction: boolean, minimum_amount?: number | null, minimum_amount_currency?: string | null } | null } | null } };

export type CreateSubscriptionMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  customer: Scalars['ID'];
  items: Array<SubscriptionItemInput> | SubscriptionItemInput;
  cancel_at_period_end?: InputMaybe<Scalars['Boolean']>;
  default_payment_method?: InputMaybe<Scalars['String']>;
  payment_behaviour?: InputMaybe<Scalars['String']>;
  backdate_start_date?: InputMaybe<Scalars['Int']>;
  billing_cycle_anchor?: InputMaybe<Scalars['Int']>;
  cancel_at?: InputMaybe<Scalars['Int']>;
  collection_method?: InputMaybe<Scalars['String']>;
  coupon?: InputMaybe<Scalars['ID']>;
  days_until_due?: InputMaybe<Scalars['Int']>;
  default_source?: InputMaybe<Scalars['String']>;
  promotion_code?: InputMaybe<Scalars['ID']>;
  proration_behaviour?: InputMaybe<Scalars['String']>;
  trial_end?: InputMaybe<Scalars['Int']>;
  trial_from_plan?: InputMaybe<Scalars['Boolean']>;
  trial_period_days?: InputMaybe<Scalars['Int']>;
}>;


export type CreateSubscriptionMutation = { __typename?: 'Mutation', create_subscription: { __typename?: 'SubscriptionMutationResult', success: boolean, message?: string | null, subscription?: { __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, latest_invoice?: { __typename?: 'Invoice', id: string } | null, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null } | null } };

export type CancelSubscriptionMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  subscription_id: Scalars['ID'];
  cancel_at_period_end?: InputMaybe<Scalars['Boolean']>;
  cancel_at?: InputMaybe<Scalars['Int']>;
  invoice_now?: InputMaybe<Scalars['Boolean']>;
  prorate?: InputMaybe<Scalars['Boolean']>;
}>;


export type CancelSubscriptionMutation = { __typename?: 'Mutation', cancel_subscription: { __typename?: 'SubscriptionMutationResult', success: boolean, message?: string | null, subscription?: { __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, latest_invoice?: { __typename?: 'Invoice', id: string } | null, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null } | null } };

export type CreateInvoiceMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  customer: Scalars['ID'];
  auto_advance?: InputMaybe<Scalars['Boolean']>;
  collection_method?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  footer?: InputMaybe<Scalars['String']>;
  subscription?: InputMaybe<Scalars['ID']>;
  days_until_due?: InputMaybe<Scalars['Int']>;
  default_payment_method?: InputMaybe<Scalars['ID']>;
  default_source?: InputMaybe<Scalars['ID']>;
  due_date?: InputMaybe<Scalars['Int']>;
  currency?: InputMaybe<Scalars['String']>;
  items?: InputMaybe<Array<InvoiceItemInput> | InvoiceItemInput>;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', create_invoice: { __typename?: 'InvoiceMutationResult', success: boolean, message?: string | null, invoice?: { __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null } | null } };

export type UpdateInvoiceMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
  auto_advance?: InputMaybe<Scalars['Boolean']>;
  collection_method?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  footer?: InputMaybe<Scalars['String']>;
  subscription?: InputMaybe<Scalars['ID']>;
  days_until_due?: InputMaybe<Scalars['Int']>;
  default_payment_method?: InputMaybe<Scalars['ID']>;
  default_source?: InputMaybe<Scalars['ID']>;
  due_date?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateInvoiceMutation = { __typename?: 'Mutation', update_invoice: { __typename?: 'InvoiceMutationResult', success: boolean, message?: string | null, invoice?: { __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null } | null } };

export type DeleteInvoiceMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
}>;


export type DeleteInvoiceMutation = { __typename?: 'Mutation', delete_invoice: { __typename?: 'InvoiceMutationResult', success: boolean, message?: string | null, invoice?: { __typename?: 'Invoice', id: string } | null } };

export type VoidInvoiceMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
}>;


export type VoidInvoiceMutation = { __typename?: 'Mutation', void_invoice: { __typename?: 'InvoiceMutationResult', success: boolean, message?: string | null, invoice?: { __typename?: 'Invoice', id: string } | null } };

export type FinalizeInvoiceMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
}>;


export type FinalizeInvoiceMutation = { __typename?: 'Mutation', finalize_invoice: { __typename?: 'InvoiceMutationResult', success: boolean, message?: string | null, invoice?: { __typename?: 'Invoice', id: string } | null } };

export type MarkInvoiceUncollectibleMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
}>;


export type MarkInvoiceUncollectibleMutation = { __typename?: 'Mutation', mark_invoice_uncollectible: { __typename?: 'InvoiceMutationResult', success: boolean, message?: string | null, invoice?: { __typename?: 'Invoice', id: string } | null } };

export type CreateInvoiceItemMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  customer: Scalars['ID'];
  invoice?: InputMaybe<Scalars['ID']>;
  amount?: InputMaybe<Scalars['Int']>;
  currency?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  period?: InputMaybe<PeriodInput>;
  price?: InputMaybe<Scalars['ID']>;
  discountable?: InputMaybe<Scalars['Boolean']>;
  quantity?: InputMaybe<Scalars['Int']>;
  unit_amount?: InputMaybe<Scalars['Int']>;
  unit_amount_decimal?: InputMaybe<Scalars['String']>;
}>;


export type CreateInvoiceItemMutation = { __typename?: 'Mutation', create_invoiceitem: { __typename?: 'InvoiceItemMutationResult', success: boolean, message?: string | null, invoiceitem?: { __typename?: 'InvoiceItem', id: string, amount: number, currency: string, date: any, description?: string | null, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: number | null, unit_amount_decimal?: string | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discounts?: Array<{ __typename?: 'Discount', id: string }> | null, invoice?: { __typename?: 'Invoice', id: string } | null, price?: { __typename?: 'StripePrice', id: string } | null } | null } };

export type UpdateInvoiceItemMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoiceitem_id: Scalars['ID'];
  amount?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  period?: InputMaybe<PeriodInput>;
  price?: InputMaybe<Scalars['ID']>;
  discountable?: InputMaybe<Scalars['Boolean']>;
  quantity?: InputMaybe<Scalars['Int']>;
  unit_amount?: InputMaybe<Scalars['Int']>;
  unit_amount_decimal?: InputMaybe<Scalars['String']>;
}>;


export type UpdateInvoiceItemMutation = { __typename?: 'Mutation', update_invoiceitem: { __typename?: 'InvoiceItemMutationResult', success: boolean, message?: string | null, invoiceitem?: { __typename?: 'InvoiceItem', id: string, amount: number, currency: string, date: any, description?: string | null, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: number | null, unit_amount_decimal?: string | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discounts?: Array<{ __typename?: 'Discount', id: string }> | null, invoice?: { __typename?: 'Invoice', id: string } | null, price?: { __typename?: 'StripePrice', id: string } | null } | null } };

export type DeleteInvoiceItemMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoiceitem_id: Scalars['ID'];
}>;


export type DeleteInvoiceItemMutation = { __typename?: 'Mutation', delete_invoiceitem: { __typename?: 'InvoiceItemMutationResult', success: boolean, message?: string | null, invoiceitem?: { __typename?: 'InvoiceItem', id: string } | null } };

export type CreateCustomerMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  email_address: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', create_customer: { __typename?: 'CustomerMutationResult', success: boolean, message?: string | null, customer?: { __typename?: 'Customer', id: string, name?: string | null, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }>, user?: { __typename?: 'User', id: string, name: string, email_address: string } | null } | null } };

export type UpdateCustomerMutationVariables = Exact<{
  customer_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  email_address?: InputMaybe<Scalars['String']>;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', update_customer: { __typename?: 'CustomerMutationResult', success: boolean, message?: string | null, customer?: { __typename?: 'Customer', id: string, name?: string | null, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }>, user?: { __typename?: 'User', id: string, name: string, email_address: string } | null } | null } };

export type DeleteCustomerMutationVariables = Exact<{
  customer_id: Scalars['ID'];
}>;


export type DeleteCustomerMutation = { __typename?: 'Mutation', delete_customer: { __typename?: 'CustomerMutationResult', success: boolean, message?: string | null, customer?: { __typename?: 'Customer', id: string } | null } };

export type CreateBankAccountMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  country: Scalars['String'];
  currency: Scalars['String'];
  account_number: Scalars['String'];
  account_holder_name?: InputMaybe<Scalars['String']>;
  account_holder_type?: InputMaybe<Scalars['String']>;
  routing_number?: InputMaybe<Scalars['String']>;
  default_for_currency?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateBankAccountMutation = { __typename?: 'Mutation', create_bank_account: { __typename?: 'BankAccountMutationResult', success: boolean, message?: string | null, bank_account?: { __typename?: 'BankAccount', id: string, account_holder_name?: string | null, account_holder_type?: string | null, available_payout_methods?: Array<string> | null, bank_name?: string | null, country: string, currency: string, default_for_currency?: boolean | null, fingerprint?: string | null, last4: string, routing_number?: string | null, status: string } | null } };

export type UpdateBankAccountMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  bank_account_id: Scalars['ID'];
  account_holder_name?: InputMaybe<Scalars['String']>;
  account_holder_type?: InputMaybe<Scalars['String']>;
  default_for_currency?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateBankAccountMutation = { __typename?: 'Mutation', update_bank_account: { __typename?: 'BankAccountMutationResult', success: boolean, message?: string | null, bank_account?: { __typename?: 'BankAccount', id: string, account_holder_name?: string | null, account_holder_type?: string | null, available_payout_methods?: Array<string> | null, bank_name?: string | null, country: string, currency: string, default_for_currency?: boolean | null, fingerprint?: string | null, last4: string, routing_number?: string | null, status: string } | null } };

export type DeleteBankAccountMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  bank_account_id: Scalars['ID'];
}>;


export type DeleteBankAccountMutation = { __typename?: 'Mutation', delete_bank_account: { __typename?: 'BankAccountMutationResult', success: boolean, message?: string | null, bank_account?: { __typename?: 'BankAccount', id: string } | null } };

export type UpdateAgencySettingsMutationVariables = Exact<{
  setting_id: Scalars['ID'];
  checkout_success_url?: InputMaybe<Scalars['String']>;
  checkout_cancel_url?: InputMaybe<Scalars['String']>;
}>;


export type UpdateAgencySettingsMutation = { __typename?: 'Mutation', update_agency_settings: { __typename?: 'AgencySettingsMutationResult', success: boolean, message?: string | null, setting?: { __typename?: 'AgencySettings', id: string, checkout_success_url?: string | null, checkout_cancel_url?: string | null } | null } };

export type UpdateProductSettingsMutationVariables = Exact<{
  setting_id: Scalars['ID'];
  checkout_success_url?: InputMaybe<Scalars['String']>;
  checkout_cancel_url?: InputMaybe<Scalars['String']>;
}>;


export type UpdateProductSettingsMutation = { __typename?: 'Mutation', update_product_settings: { __typename?: 'ProductSettingsMutationResult', success: boolean, message?: string | null, setting?: { __typename?: 'ProductSettings', id: string, checkout_success_url?: string | null, checkout_cancel_url?: string | null } | null } };

export type UpdatePageMutationVariables = Exact<{
  page_id: Scalars['ID'];
  access?: InputMaybe<AccessLevel>;
}>;


export type UpdatePageMutation = { __typename?: 'Mutation', update_page: { __typename?: 'PageMutationResult', success: boolean, message?: string | null, page?: { __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: { __typename?: 'Product', id: string } | null, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } }> } | null } };

export type CreatePageBlockMutationVariables = Exact<{
  page_id: Scalars['ID'];
  page_block_definition_id: Scalars['ID'];
  data: Scalars['Json'];
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type CreatePageBlockMutation = { __typename?: 'Mutation', create_page_block: { __typename?: 'PageBlockMutationResult', success: boolean, message?: string | null, page_block?: { __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } } | null } };

export type UpdatePageBlockMutationVariables = Exact<{
  page_block_id: Scalars['ID'];
  data: Scalars['Json'];
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type UpdatePageBlockMutation = { __typename?: 'Mutation', update_page_block: { __typename?: 'PageBlockMutationResult', success: boolean, message?: string | null, page_block?: { __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } } | null } };

export type DeletePageBlockMutationVariables = Exact<{
  page_block_id: Scalars['ID'];
}>;


export type DeletePageBlockMutation = { __typename?: 'Mutation', delete_page_block: { __typename?: 'PageBlockMutationResult', success: boolean, message?: string | null, page_block?: { __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } } | null } };

export type CreateCredentialMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  credential_type_id: Scalars['ID'];
  data: Scalars['Json'];
  name: Scalars['String'];
}>;


export type CreateCredentialMutation = { __typename?: 'Mutation', create_credential: { __typename?: 'CredentialMutationResult', success: boolean, message?: string | null, credential?: { __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } } | null } };

export type UpdateCredentialMutationVariables = Exact<{
  credential_id: Scalars['ID'];
  data: Scalars['Json'];
}>;


export type UpdateCredentialMutation = { __typename?: 'Mutation', update_credential: { __typename?: 'CredentialMutationResult', success: boolean, message?: string | null, credential?: { __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } } | null } };

export type CreateIntegrationMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  integration_type_id: Scalars['ID'];
  credential_id?: InputMaybe<Scalars['ID']>;
  product_id?: InputMaybe<Scalars['ID']>;
  integration_config_id?: InputMaybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type CreateIntegrationMutation = { __typename?: 'Mutation', create_integration: { __typename?: 'IntegrationMutationResult', success: boolean, message?: string | null, integration?: { __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, product?: { __typename?: 'Product', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: { __typename?: 'IntegrationConfig', id: string } | null } | null } };

export type UpdateIntegrationMutationVariables = Exact<{
  integration_id: Scalars['ID'];
  credential_id?: InputMaybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type UpdateIntegrationMutation = { __typename?: 'Mutation', update_integration: { __typename?: 'IntegrationMutationResult', success: boolean, message?: string | null, integration?: { __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, product?: { __typename?: 'Product', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: { __typename?: 'IntegrationConfig', id: string } | null } | null } };

export type CreateIntegrationConfigMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  integration_type_id: Scalars['ID'];
  credential_id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['Json'];
}>;


export type CreateIntegrationConfigMutation = { __typename?: 'Mutation', create_integration_config: { __typename?: 'IntegrationConfigMutationResult', success: boolean, message?: string | null, integration_config?: { __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string } } | null } };

export type UpdateIntegrationConfigMutationVariables = Exact<{
  integration_config_id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  credential_id?: InputMaybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type UpdateIntegrationConfigMutation = { __typename?: 'Mutation', update_integration_config: { __typename?: 'IntegrationConfigMutationResult', success: boolean, message?: string | null, integration_config?: { __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string } } | null } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', current_user?: { __typename?: 'User', id: string, name: string, email_address: string, memberships: Array<{ __typename?: 'Membership', id: string, access: AccessLevel, user: { __typename?: 'User', id: string, name: string, email_address: string }, subdomain: { __typename?: 'Subdomain', id: string, agency: { __typename?: 'Agency', id: string } } }> } | null };

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { __typename?: 'Query', country_codes: Array<string> };

export type CountrySpecQueryVariables = Exact<{
  country_code: Scalars['ID'];
}>;


export type CountrySpecQuery = { __typename?: 'Query', country_spec?: { __typename?: 'CountrySpec', id: string, default_currency: string, supported_payment_currencies: Array<string>, supported_payment_methods: Array<string>, supported_transfer_countries: Array<string> } | null };

export type ThemeQueryVariables = Exact<{
  theme_id: Scalars['ID'];
}>;


export type ThemeQuery = { __typename?: 'Query', theme?: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } | null };

export type ThemesQueryVariables = Exact<{
  filter: ThemeFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type ThemesQuery = { __typename?: 'Query', themes?: Array<{ __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null }> | null };

export type MarkdownQueryVariables = Exact<{
  markdown_id: Scalars['ID'];
}>;


export type MarkdownQuery = { __typename?: 'Query', markdown?: { __typename?: 'Markdown', id: string, name: string, data: string } | null };

export type MarkdownsQueryVariables = Exact<{
  filter: MarkdownFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type MarkdownsQuery = { __typename?: 'Query', markdowns?: Array<{ __typename?: 'Markdown', id: string, name: string, data: string }> | null };

export type ImageQueryVariables = Exact<{
  image_id: Scalars['ID'];
}>;


export type ImageQuery = { __typename?: 'Query', image?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null };

export type ImagesQueryVariables = Exact<{
  filter: ImageFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type ImagesQuery = { __typename?: 'Query', images?: Array<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> | null };

export type AgencyStripeAccountQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, id_ext: string, business_type?: string | null, charges_enabled: boolean, country: string, created: any, default_currency?: string | null, details_submitted: boolean, email?: string | null, payouts_enabled: boolean, business_profile: { __typename?: 'BusinessProfile', mcc?: string | null, name?: string | null, product_description?: string | null, support_address?: string | null, support_email?: string | null, support_phone?: string | null, support_url?: string | null, url?: string | null }, capabilities: { __typename?: 'StripeCapabilities', card_payments?: string | null, transfers?: string | null }, requirements: { __typename?: 'StripeRequirements', current_deadline?: string | null, disabled_reason?: string | null, currently_due: Array<string | null>, eventually_due: Array<string | null>, past_due: Array<string | null>, pending_verification: Array<string | null> }, settings: { __typename?: 'StripeSettings', branding?: { __typename?: 'StripeBranding', icon?: string | null, logo?: string | null, primary_color?: string | null, secondary_color?: string | null } | null } } } | null };

export type AgencyStripeAccountUpdateUrlQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountUpdateUrlQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, account_update_url: { __typename?: 'StripeAccountLink', url: string } } } | null };

export type AgencyStripeAccountBalanceQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountBalanceQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, balance: { __typename?: 'StripeBalance', available: Array<{ __typename?: 'StripeCurrencyBalance', amount: number, currency: string, source_types: { __typename?: 'StripeBalanceSource', card?: number | null, bank_account?: number | null } }>, pending: Array<{ __typename?: 'StripeCurrencyBalance', amount: number, currency: string, source_types: { __typename?: 'StripeBalanceSource', card?: number | null, bank_account?: number | null } }>, connect_reserved?: Array<{ __typename?: 'StripeCurrencyBalance', amount: number, currency: string, source_types: { __typename?: 'StripeBalanceSource', card?: number | null, bank_account?: number | null } }> | null } } } | null };

export type AgencyStripeAccountBalanceTransactionsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  created?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountBalanceTransactionsQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, balance_transactions: Array<{ __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null }> } } | null };

export type AgencyStripeAccountPaymentIntentsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  created?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountPaymentIntentsQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, payment_intents: Array<{ __typename?: 'PaymentIntent', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, canceled_at?: any | null, cancellation_reason?: string | null, capture_method?: string | null, confirmation_method?: string | null, created?: any | null, currency?: string | null, description?: string | null, invoice?: string | null, on_behalf_of?: string | null, payment_method?: string | null, payment_method_types?: Array<string | null> | null, receipt_email?: string | null, setup_future_usage?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer_group?: string | null, charges?: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null> | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null }> } } | null };

export type AgencyStripeAccountChargesQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  created?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  payment_intent?: InputMaybe<Scalars['ID']>;
}>;


export type AgencyStripeAccountChargesQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, charges: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null }> } } | null };

export type CustomerPaymentIntentsQueryVariables = Exact<{
  customer_id: Scalars['ID'];
}>;


export type CustomerPaymentIntentsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', id: string, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, payment_intents: Array<{ __typename?: 'PaymentIntent', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, canceled_at?: any | null, cancellation_reason?: string | null, capture_method?: string | null, confirmation_method?: string | null, created?: any | null, currency?: string | null, description?: string | null, invoice?: string | null, on_behalf_of?: string | null, payment_method?: string | null, payment_method_types?: Array<string | null> | null, receipt_email?: string | null, setup_future_usage?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer_group?: string | null, charges?: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null> | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null }> }> } | null };

export type AgencyStripeAccountBankAccountsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountBankAccountsQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, bank_accounts: Array<{ __typename?: 'BankAccount', id: string, account_holder_name?: string | null, account_holder_type?: string | null, available_payout_methods?: Array<string> | null, bank_name?: string | null, country: string, currency: string, default_for_currency?: boolean | null, fingerprint?: string | null, last4: string, routing_number?: string | null, status: string }> } } | null };

export type AgencyStripeAccountCouponsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountCouponsQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, coupons: Array<{ __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null }> } } | null };

export type CouponQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  coupon_id: Scalars['ID'];
}>;


export type CouponQuery = { __typename?: 'Query', coupon?: { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null } | null };

export type PromotionCodeQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  promotion_code_id: Scalars['ID'];
}>;


export type PromotionCodeQuery = { __typename?: 'Query', promotion_code?: { __typename?: 'PromotionCode', id: string, active: boolean, code: string, created: any, expires_at?: any | null, livemode: boolean, max_redemptions?: number | null, times_redeemed: number, coupon: { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null }, customer?: { __typename?: 'StripeCustomer', id: string } | null, restrictions?: { __typename?: 'PromotionCodeRestrictions', first_time_transaction: boolean, minimum_amount?: number | null, minimum_amount_currency?: string | null } | null } | null };

export type PromotionCodesQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  active?: InputMaybe<Scalars['Boolean']>;
  code?: InputMaybe<Scalars['String']>;
  coupon?: InputMaybe<Scalars['String']>;
  customer?: InputMaybe<Scalars['String']>;
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type PromotionCodesQuery = { __typename?: 'Query', promotion_codes: Array<{ __typename?: 'PromotionCode', id: string, active: boolean, code: string, created: any, expires_at?: any | null, livemode: boolean, max_redemptions?: number | null, times_redeemed: number, coupon: { __typename?: 'Coupon', id: string, amount_off?: number | null, created?: any | null, currency?: string | null, duration?: string | null, duration_in_months?: number | null, livemode?: boolean | null, max_redemptions?: number | null, name?: string | null, percent_off?: number | null, redeem_by?: any | null, times_redeemed?: number | null, valid?: boolean | null, applies_to?: { __typename?: 'CouponAppliesTo', products: Array<string> } | null }, customer?: { __typename?: 'StripeCustomer', id: string } | null, restrictions?: { __typename?: 'PromotionCodeRestrictions', first_time_transaction: boolean, minimum_amount?: number | null, minimum_amount_currency?: string | null } | null }> };

export type AgencyStripeAccountSubscriptionsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  customer?: InputMaybe<Scalars['ID']>;
  price?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
  collection_method?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Int']>;
  current_period_start?: InputMaybe<TimeStampFilter>;
  current_period_end?: InputMaybe<TimeStampFilter>;
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountSubscriptionsQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, subscriptions: Array<{ __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, latest_invoice?: { __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null } | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null }> } } | null };

export type CustomerSubscriptionsQueryVariables = Exact<{
  customer_id: Scalars['ID'];
}>;


export type CustomerSubscriptionsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', id: string, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, subscriptions: Array<{ __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, latest_invoice?: { __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null } | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null }> }> } | null };

export type SubscriptionQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  subscription_id: Scalars['ID'];
}>;


export type SubscriptionQuery = { __typename?: 'Query', subscription?: { __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, latest_invoice?: { __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null } | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null } | null };

export type ChargeQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  charge_id: Scalars['ID'];
}>;


export type ChargeQuery = { __typename?: 'Query', charge?: { __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null };

export type PaymentIntentQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  payment_intent_id: Scalars['ID'];
}>;


export type PaymentIntentQuery = { __typename?: 'Query', payment_intent?: { __typename?: 'PaymentIntent', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, canceled_at?: any | null, cancellation_reason?: string | null, capture_method?: string | null, confirmation_method?: string | null, created?: any | null, currency?: string | null, description?: string | null, invoice?: string | null, on_behalf_of?: string | null, payment_method?: string | null, payment_method_types?: Array<string | null> | null, receipt_email?: string | null, setup_future_usage?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer_group?: string | null, charges?: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null> | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null } | null };

export type InvoiceItemQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoiceitem_id: Scalars['ID'];
}>;


export type InvoiceItemQuery = { __typename?: 'Query', invoiceitem?: { __typename?: 'InvoiceItem', id: string, amount: number, currency: string, date: any, description?: string | null, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: number | null, unit_amount_decimal?: string | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discounts?: Array<{ __typename?: 'Discount', id: string }> | null, invoice?: { __typename?: 'Invoice', id: string } | null, price?: { __typename?: 'StripePrice', id: string } | null } | null };

export type AgencyStripeAccountInvoicesQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  customer?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
  subscription?: InputMaybe<Scalars['ID']>;
  collection_method?: InputMaybe<Scalars['String']>;
  due_date?: InputMaybe<Scalars['Int']>;
  created?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountInvoicesQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, invoices: Array<{ __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null }> } } | null };

export type CustomerInvoicesQueryVariables = Exact<{
  customer_id: Scalars['ID'];
}>;


export type CustomerInvoicesQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', id: string, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, invoices: Array<{ __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null }> }> } | null };

export type AgencyStripeAccountInvoiceItemsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  customer?: InputMaybe<Scalars['ID']>;
  invoice?: InputMaybe<Scalars['ID']>;
  pending?: InputMaybe<Scalars['Boolean']>;
  created?: InputMaybe<Scalars['Int']>;
  starting_after?: InputMaybe<Scalars['String']>;
  ending_before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountInvoiceItemsQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, invoiceitems: Array<{ __typename?: 'InvoiceItem', id: string, amount: number, currency: string, date: any, description?: string | null, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: number | null, unit_amount_decimal?: string | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discounts?: Array<{ __typename?: 'Discount', id: string }> | null, invoice?: { __typename?: 'Invoice', id: string } | null, price?: { __typename?: 'StripePrice', id: string } | null }> } } | null };

export type InvoiceQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
}>;


export type InvoiceQuery = { __typename?: 'Query', invoice?: { __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null } | null };

export type CustomerQueryVariables = Exact<{
  customer_id: Scalars['ID'];
  stripe_account_id?: InputMaybe<Scalars['ID']>;
}>;


export type CustomerQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', id: string, name?: string | null, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }>, user?: { __typename?: 'User', id: string, name: string, email_address: string } | null } | null };

export type AgencyCustomersQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  filter?: InputMaybe<CustomerFilter>;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type AgencyCustomersQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, customers: Array<{ __typename?: 'Customer', id: string, name?: string | null, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }>, user?: { __typename?: 'User', id: string, name: string, email_address: string } | null }> } } | null };

export type CustomersQueryVariables = Exact<{
  filter: CustomerFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type CustomersQuery = { __typename?: 'Query', customers?: Array<{ __typename?: 'Customer', id: string, name?: string | null, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null }>, user?: { __typename?: 'User', id: string, name: string, email_address: string } | null }> | null };

export type CountCustomersQueryVariables = Exact<{
  filter: CustomerFilter;
  token?: InputMaybe<Scalars['String']>;
}>;


export type CountCustomersQuery = { __typename?: 'Query', count_customers: number };

export type AgencySubscriptionPlanQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencySubscriptionPlanQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, subscription_plan: { __typename?: 'SubscriptionPlan', id: string, name: string, transaction_fees: Array<{ __typename?: 'TransactionFee', id: string, percentage: number, fixed_amount: number, currency: string, transaction_amount_upper_bound: number, data: any, subscription_plan: { __typename?: 'SubscriptionPlan', id: string } }> } } | null };

export type AgencyQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: string | null, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } } | null };

export type AgenciesQueryVariables = Exact<{
  filter: AgencyFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type AgenciesQuery = { __typename?: 'Query', agencies?: Array<{ __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: string | null, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } }> | null };

export type CurrentUserAgenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserAgenciesQuery = { __typename?: 'Query', current_user?: { __typename?: 'User', id: string, memberships: Array<{ __typename?: 'Membership', id: string, access: AccessLevel, subdomain: { __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: string | null, stripe_account: { __typename?: 'StripeAccount', id: string, id_ext: string, business_type?: string | null, charges_enabled: boolean, country: string, created: any, default_currency?: string | null, details_submitted: boolean, email?: string | null, payouts_enabled: boolean, business_profile: { __typename?: 'BusinessProfile', mcc?: string | null, name?: string | null, product_description?: string | null, support_address?: string | null, support_email?: string | null, support_phone?: string | null, support_url?: string | null, url?: string | null }, capabilities: { __typename?: 'StripeCapabilities', card_payments?: string | null, transfers?: string | null }, requirements: { __typename?: 'StripeRequirements', current_deadline?: string | null, disabled_reason?: string | null, currently_due: Array<string | null>, eventually_due: Array<string | null>, past_due: Array<string | null>, pending_verification: Array<string | null> }, settings: { __typename?: 'StripeSettings', branding?: { __typename?: 'StripeBranding', icon?: string | null, logo?: string | null, primary_color?: string | null, secondary_color?: string | null } | null } }, subscription_plan: { __typename?: 'SubscriptionPlan', id: string, name: string, transaction_fees: Array<{ __typename?: 'TransactionFee', id: string, percentage: number, fixed_amount: number, currency: string, transaction_amount_upper_bound: number, data: any, subscription_plan: { __typename?: 'SubscriptionPlan', id: string } }> }, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } }, memberships: Array<{ __typename?: 'Membership', id: string, access: AccessLevel, user: { __typename?: 'User', id: string, name: string, email_address: string }, subdomain: { __typename?: 'Subdomain', id: string, agency: { __typename?: 'Agency', id: string } } }> }, user: { __typename?: 'User', id: string } }> } | null };

export type SubdomainPublicQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainPublicQuery = { __typename?: 'Query', subdomains?: Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, name: string, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } } }> | null };

export type ProductQueryVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type ProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } | null };

export type ProductsQueryVariables = Exact<{
  filter: ProductFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type ProductsQuery = { __typename?: 'Query', products?: Array<{ __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null }> | null };

export type CountProductsQueryVariables = Exact<{
  filter: ProductFilter;
  token?: InputMaybe<Scalars['String']>;
}>;


export type CountProductsQuery = { __typename?: 'Query', count_products: number };

export type OrderDetailsQueryVariables = Exact<{
  order_id: Scalars['ID'];
  token?: InputMaybe<Scalars['String']>;
}>;


export type OrderDetailsQuery = { __typename?: 'Query', order?: { __typename?: 'Order', id: string, state: string, error?: string | null, ordered_at: any, processed_at?: any | null, items: Array<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: string | null, processed_at?: any | null, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } } }>, customer: { __typename?: 'Customer', id: string, name?: string | null, email_address: string }, stripe_checkout_session: { __typename?: 'StripeCheckoutSession', id: string, allow_promotion_codes?: boolean | null, amount_subtotal?: number | null, amount_total?: number | null, billing_address_collection?: string | null, cancel_url?: string | null, client_reference_id?: string | null, currency?: string | null, customer_email?: string | null, expires_at?: any | null, livemode?: boolean | null, locale?: string | null, mode?: string | null, payment_method_types?: Array<string | null> | null, payment_status?: string | null, status?: string | null, submit_type?: string | null, success_url: string, url?: string | null, payment_intent?: { __typename?: 'PaymentIntent', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, canceled_at?: any | null, cancellation_reason?: string | null, capture_method?: string | null, confirmation_method?: string | null, created?: any | null, currency?: string | null, description?: string | null, invoice?: string | null, on_behalf_of?: string | null, payment_method?: string | null, payment_method_types?: Array<string | null> | null, receipt_email?: string | null, setup_future_usage?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer_group?: string | null, charges?: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null> | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null } | null, subscription?: { __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, latest_invoice?: { __typename?: 'Invoice', id: string, account_country?: string | null, account_name?: string | null, account_tax_ids?: Array<string> | null, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount?: number | null, attempt_count: number, attempted: boolean, auto_advance?: boolean | null, billing_reason?: string | null, collection_method?: string | null, created: any, currency: string, customer_email?: string | null, customer_name?: string | null, customer_phone?: string | null, customer_tax_exempt?: string | null, default_payment_method?: string | null, description?: string | null, due_date?: any | null, ending_balance?: number | null, footer?: string | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, livemode: boolean, next_payment_attempt?: any | null, number?: string | null, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: string | null, starting_balance?: number | null, statement_descriptor?: string | null, status?: string | null, subscription_proration_date?: any | null, subtotal: number, tax?: number | null, total: number, webhooks_delivered_at?: any | null, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: string | null }, charge?: { __typename?: 'Charge', id: string } | null, custom_fields?: Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }> | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer_shipping?: { __typename?: 'InvoiceCustomerShipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer_tax_ids?: Array<{ __typename?: 'CustomerTaxId', type?: string | null, value?: string | null }> | null, discount?: { __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null } | null, discounts?: Array<{ __typename?: 'Discount', id: string, checkout_session?: string | null, end?: any | null, invoice_item?: string | null, promotion_code?: string | null, start: any, subscription?: string | null, coupon?: { __typename?: 'Coupon', id: string } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, invoice?: { __typename?: 'Invoice', id: string } | null }> | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null, status_transitions?: { __typename?: 'InvoiceStatusTransitions', finalized_at?: any | null, marked_uncollectible_at?: any | null, paid_at?: any | null, voided_at?: any | null } | null } | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null } | null, after_expiration?: { __typename?: 'SessionAfterExpiration', recovery?: { __typename?: 'SessionAfterExpirationRecovery', allow_promotion_codes?: boolean | null, expires_at?: any | null, url?: string | null } | null } | null, automatic_tax?: { __typename?: 'SessionAutomaticTax', enabled: boolean, status?: string | null } | null, consent?: { __typename?: 'SessionConsent', promotions?: string | null } | null, consent_collection?: { __typename?: 'SessionConsentCollection', promotions?: string | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_details?: { __typename?: 'SessionCustomerDetails', email?: string | null, phone?: string | null, tax_exempt?: string | null, tax_ids?: Array<{ __typename?: 'SessionCustomerDetailsTaxId', type: string, value?: string | null } | null> | null } | null, line_items: Array<{ __typename?: 'LineItem', id: string, amount_subtotal: number, amount_total: number, currency: string, description: string, quantity?: number | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null }>, phone_number_collection?: { __typename?: 'SessionPhoneNumberCollection', enabled?: boolean | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, shipping_address_collection?: { __typename?: 'SessionShippingAddressCollection', allowed_countries: Array<string> } | null, shipping_options: Array<{ __typename?: 'SessionShippingOption', shipping_amount: number }>, tax_id_collection?: { __typename?: 'SessionTaxIdCollection', enabled?: boolean | null } | null, total_details?: { __typename?: 'SessionTotalDetails', amount_discount: number, amount_shipping?: number | null, amount_tax: number, breakdown?: { __typename?: 'SessionTotalDetailsBreakdown', discounts: Array<{ __typename?: 'SessionTotalDetailsBreakdownDiscount', amount: number }>, taxes: Array<{ __typename?: 'SessionTotalDetailsBreakdownTax', amount: number }> } | null } | null } } | null };

export type OrderQueryVariables = Exact<{
  order_id: Scalars['ID'];
  token?: InputMaybe<Scalars['String']>;
}>;


export type OrderQuery = { __typename?: 'Query', order?: { __typename?: 'Order', id: string, state: string, error?: string | null, ordered_at: any, processed_at?: any | null, items: Array<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: string | null, processed_at?: any | null, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } } }>, customer: { __typename?: 'Customer', id: string, name?: string | null, email_address: string }, stripe_checkout_session: { __typename?: 'StripeCheckoutSession', id: string, allow_promotion_codes?: boolean | null, amount_subtotal?: number | null, amount_total?: number | null, billing_address_collection?: string | null, cancel_url?: string | null, client_reference_id?: string | null, currency?: string | null, customer_email?: string | null, expires_at?: any | null, livemode?: boolean | null, locale?: string | null, mode?: string | null, payment_method_types?: Array<string | null> | null, payment_status?: string | null, status?: string | null, submit_type?: string | null, success_url: string, url?: string | null, after_expiration?: { __typename?: 'SessionAfterExpiration', recovery?: { __typename?: 'SessionAfterExpirationRecovery', allow_promotion_codes?: boolean | null, expires_at?: any | null, url?: string | null } | null } | null, automatic_tax?: { __typename?: 'SessionAutomaticTax', enabled: boolean, status?: string | null } | null, consent?: { __typename?: 'SessionConsent', promotions?: string | null } | null, consent_collection?: { __typename?: 'SessionConsentCollection', promotions?: string | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_details?: { __typename?: 'SessionCustomerDetails', email?: string | null, phone?: string | null, tax_exempt?: string | null, tax_ids?: Array<{ __typename?: 'SessionCustomerDetailsTaxId', type: string, value?: string | null } | null> | null } | null, line_items: Array<{ __typename?: 'LineItem', id: string, amount_subtotal: number, amount_total: number, currency: string, description: string, quantity?: number | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null }>, payment_intent?: { __typename?: 'PaymentIntent', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, canceled_at?: any | null, cancellation_reason?: string | null, capture_method?: string | null, confirmation_method?: string | null, created?: any | null, currency?: string | null, description?: string | null, invoice?: string | null, on_behalf_of?: string | null, payment_method?: string | null, payment_method_types?: Array<string | null> | null, receipt_email?: string | null, setup_future_usage?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer_group?: string | null, charges?: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null> | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null } | null, phone_number_collection?: { __typename?: 'SessionPhoneNumberCollection', enabled?: boolean | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, shipping_address_collection?: { __typename?: 'SessionShippingAddressCollection', allowed_countries: Array<string> } | null, shipping_options: Array<{ __typename?: 'SessionShippingOption', shipping_amount: number }>, subscription?: { __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, latest_invoice?: { __typename?: 'Invoice', id: string } | null, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null } | null, tax_id_collection?: { __typename?: 'SessionTaxIdCollection', enabled?: boolean | null } | null, total_details?: { __typename?: 'SessionTotalDetails', amount_discount: number, amount_shipping?: number | null, amount_tax: number, breakdown?: { __typename?: 'SessionTotalDetailsBreakdown', discounts: Array<{ __typename?: 'SessionTotalDetailsBreakdownDiscount', amount: number }>, taxes: Array<{ __typename?: 'SessionTotalDetailsBreakdownTax', amount: number }> } | null } | null } } | null };

export type OrdersQueryVariables = Exact<{
  filter: OrderFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type OrdersQuery = { __typename?: 'Query', orders?: Array<{ __typename?: 'Order', id: string, state: string, error?: string | null, ordered_at: any, processed_at?: any | null, items: Array<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: string | null, processed_at?: any | null, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } } }>, customer: { __typename?: 'Customer', id: string, name?: string | null, email_address: string }, stripe_checkout_session: { __typename?: 'StripeCheckoutSession', id: string, allow_promotion_codes?: boolean | null, amount_subtotal?: number | null, amount_total?: number | null, billing_address_collection?: string | null, cancel_url?: string | null, client_reference_id?: string | null, currency?: string | null, customer_email?: string | null, expires_at?: any | null, livemode?: boolean | null, locale?: string | null, mode?: string | null, payment_method_types?: Array<string | null> | null, payment_status?: string | null, status?: string | null, submit_type?: string | null, success_url: string, url?: string | null, after_expiration?: { __typename?: 'SessionAfterExpiration', recovery?: { __typename?: 'SessionAfterExpirationRecovery', allow_promotion_codes?: boolean | null, expires_at?: any | null, url?: string | null } | null } | null, automatic_tax?: { __typename?: 'SessionAutomaticTax', enabled: boolean, status?: string | null } | null, consent?: { __typename?: 'SessionConsent', promotions?: string | null } | null, consent_collection?: { __typename?: 'SessionConsentCollection', promotions?: string | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, customer_details?: { __typename?: 'SessionCustomerDetails', email?: string | null, phone?: string | null, tax_exempt?: string | null, tax_ids?: Array<{ __typename?: 'SessionCustomerDetailsTaxId', type: string, value?: string | null } | null> | null } | null, line_items: Array<{ __typename?: 'LineItem', id: string, amount_subtotal: number, amount_total: number, currency: string, description: string, quantity?: number | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null }>, payment_intent?: { __typename?: 'PaymentIntent', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, canceled_at?: any | null, cancellation_reason?: string | null, capture_method?: string | null, confirmation_method?: string | null, created?: any | null, currency?: string | null, description?: string | null, invoice?: string | null, on_behalf_of?: string | null, payment_method?: string | null, payment_method_types?: Array<string | null> | null, receipt_email?: string | null, setup_future_usage?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer_group?: string | null, charges?: Array<{ __typename?: 'Charge', id: string, amount: number, amount_capturable?: number | null, amount_received?: number | null, application_fee_amount?: number | null, authorization_code?: string | null, calculated_statement_descriptor?: string | null, captured?: boolean | null, created?: any | null, currency?: string | null, description?: string | null, disputed?: boolean | null, failure_code?: string | null, failure_message?: string | null, invoice?: string | null, order?: string | null, paid?: boolean | null, payment_method?: string | null, receipt_email?: string | null, receipt_number?: string | null, receipt_url?: string | null, refunded?: boolean | null, source_transfer?: string | null, statement_descriptor?: string | null, statement_descriptor_suffix?: string | null, status?: string | null, transfer?: string | null, transfer_group?: string | null, balance_transaction?: { __typename?: 'BalanceTransaction', id: string, amount: number, available_on: any, created: any, exchange_rate?: number | null, currency: string, description?: string | null, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: string | null, currency: string, description?: string | null, type: string }> | null } | null, billing_details?: { __typename?: 'BillingDetails', email?: string | null, name?: string | null, phone?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, fraud_details?: { __typename?: 'FraudDetails', stripe_report?: string | null, user_report?: string | null } | null, outcome?: { __typename?: 'Outcome', network_status?: string | null, reason?: string | null, risk_level?: string | null, risk_score?: number | null, seller_message?: string | null, type?: string | null, rule?: { __typename?: 'OutcomeRule', action?: string | null, id?: string | null, predicate?: string | null } | null } | null, payment_intent?: { __typename?: 'PaymentIntent', id: string } | null } | null> | null, customer?: { __typename?: 'StripeCustomer', id: string, balance?: number | null, created?: any | null, currency?: string | null, delinquent?: boolean | null, description?: string | null, email?: string | null, invoice_prefix?: string | null, name?: string | null, next_invoice_sequence?: number | null, phone?: string | null, preferred_locales?: Array<string | null> | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, customer?: { __typename?: 'Customer', id: string } | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null } | null, phone_number_collection?: { __typename?: 'SessionPhoneNumberCollection', enabled?: boolean | null } | null, shipping?: { __typename?: 'Shipping', carrier?: string | null, name?: string | null, phone?: string | null, tracking_number?: string | null, address?: { __typename?: 'Address', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null, shipping_address_collection?: { __typename?: 'SessionShippingAddressCollection', allowed_countries: Array<string> } | null, shipping_options: Array<{ __typename?: 'SessionShippingOption', shipping_amount: number }>, subscription?: { __typename?: 'StripeSubscription', id: string, application_fee_percent?: number | null, billing_cycle_anchor: any, cancel_at?: any | null, cancel_at_period_end: boolean, canceled_at?: any | null, collection_method: string, created: any, current_period_end: any, current_period_start: any, days_until_due?: number | null, ended_at?: any | null, livemode: boolean, next_pending_invoice_item_invoice?: any | null, pending_invoice_item_interval?: string | null, start_date: any, status: string, trial_end?: any | null, trial_start?: any | null, automatic_tax: { __typename?: 'SubscriptionAutomaticTax', enabled: boolean }, billing_thresholds?: { __typename?: 'SubscriptionBillingThresholds', amount_gte?: number | null, reset_billing_cycle_anchor?: boolean | null } | null, customer?: { __typename?: 'StripeCustomer', id: string } | null, discount?: { __typename?: 'Discount', id: string } | null, items: Array<{ __typename?: 'SubscriptionItem', id: string, created: any, quantity?: number | null, billing_thresholds?: { __typename?: 'SubscriptionItemBillingThresholds', usage_gte?: number | null } | null, price?: { __typename?: 'StripePrice', id: string, active: boolean, billing_scheme: string, created?: any | null, currency: string, livemode: boolean, lookup_key?: string | null, nickname?: string | null, tax_behavior?: string | null, tiers_mode?: string | null, type: string, unit_amount?: number | null, unit_amount_decimal?: string | null, product?: { __typename?: 'StripeProduct', id: string, active: boolean, attributes?: Array<string> | null, caption?: string | null, created: any, deactivate_on?: Array<string> | null, description?: string | null, images: Array<string>, livemode: boolean, name: string, shippable?: boolean | null, statement_descriptor?: string | null, tax_code?: string | null, type: string, unit_label?: string | null, updated: any, url?: string | null, package_dimensions?: { __typename?: 'StripeProductPackageDimensions', height: number, length: number, weight: number, width: number } | null } | null, recurring?: { __typename?: 'StripePriceRecurring', aggregate_usage?: string | null, interval: string, interval_count: number, trial_period_days?: number | null, usage_type?: string | null } | null, tiers?: Array<{ __typename?: 'StripePriceTier', flat_amount?: number | null, flat_amount_decimal?: string | null, unit_amount?: number | null, unit_amount_decimal?: string | null, up_to?: number | null }> | null, transform_quantity?: { __typename?: 'StripePriceTransformQuantity', divide_by?: number | null, round?: string | null } | null } | null, subscription: { __typename?: 'StripeSubscription', id: string } }>, latest_invoice?: { __typename?: 'Invoice', id: string } | null, pause_collection?: { __typename?: 'SubscriptionPauseCollection', behavior: string } | null, payment_settings?: { __typename?: 'SubscriptionPaymentSettings', payment_method_types?: Array<string> | null, payment_method_options?: { __typename?: 'SubscriptionPaymentMethodOptions', acss_debit?: { __typename?: 'SubscriptionAcssDebit', verification_method?: string | null, mandate_options?: { __typename?: 'SubscriptionAcssDebitMandateOptions', transaction_type?: string | null } | null } | null, card?: { __typename?: 'SubscriptionCard', request_three_d_secure?: string | null } | null, bancontact?: { __typename?: 'SubscriptionBancontact', preferred_language: string } | null } | null } | null, pending_update?: { __typename?: 'SubscriptionPendingUpdate', billing_cycle_anchor?: number | null, trial_end?: number | null, expires_at: number, trial_from_plan?: boolean | null } | null } | null, tax_id_collection?: { __typename?: 'SessionTaxIdCollection', enabled?: boolean | null } | null, total_details?: { __typename?: 'SessionTotalDetails', amount_discount: number, amount_shipping?: number | null, amount_tax: number, breakdown?: { __typename?: 'SessionTotalDetailsBreakdown', discounts: Array<{ __typename?: 'SessionTotalDetailsBreakdownDiscount', amount: number }>, taxes: Array<{ __typename?: 'SessionTotalDetailsBreakdownTax', amount: number }> } | null } | null } }> | null };

export type CountOrdersQueryVariables = Exact<{
  filter: OrderFilter;
  token?: InputMaybe<Scalars['String']>;
}>;


export type CountOrdersQuery = { __typename?: 'Query', count_orders: number };

export type OrderItemQueryVariables = Exact<{
  order_item_id: Scalars['ID'];
  token?: InputMaybe<Scalars['String']>;
}>;


export type OrderItemQuery = { __typename?: 'Query', order_item?: { __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: string | null, processed_at?: any | null, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } } } | null };

export type OrderItemsQueryVariables = Exact<{
  filter: OrderItemFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type OrderItemsQuery = { __typename?: 'Query', order_items?: Array<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: string | null, processed_at?: any | null, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, agency: { __typename?: 'Agency', id: string }, integrations?: Array<{ __typename?: 'Integration', id: string }> | null } } }> | null };

export type ProductAndAgencyFromUrlPartsQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
  product_url_name: Scalars['String'];
}>;


export type ProductAndAgencyFromUrlPartsQuery = { __typename?: 'Query', subdomains?: Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, products?: Array<{ __typename?: 'Product', id: string, name: string, url_name: string, description?: string | null, duration?: string | null, status: string, active: boolean, agency: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: string | null, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } }, default_price?: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null } | null, prices?: Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: string | null, recurring_interval_count?: number | null }> | null, image_logo?: { __typename?: 'Image', id: string } | null, image_hero?: { __typename?: 'Image', id: string } | null, markdown_description?: { __typename?: 'Markdown', id: string, name: string, data: string } | null, integrations?: Array<{ __typename?: 'Integration', id: string }> | null }> | null } }> | null };

export type SubdomainAgencyQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyQuery = { __typename?: 'Query', subdomains?: Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: string | null, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } } }> | null };

export type SubdomainAgencyExtendedQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyExtendedQuery = { __typename?: 'Query', subdomains?: Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', supported_payment_currencies: Array<string>, id: string, name: string, livemode: boolean, default_pricing_currency?: string | null, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: string | null, color_secondary?: string | null, color_accent?: string | null, color_background?: string | null, color_surface?: string | null, color_error?: string | null, color_success?: string | null, image_logo?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null, image_hero?: { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel } | null } } }> | null };

export type SubdomainAgencyStripeAccountUpdateUrlQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyStripeAccountUpdateUrlQuery = { __typename?: 'Query', subdomains?: Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', account_update_url: { __typename?: 'StripeAccountLink', url: string } } } }> | null };

export type AgencySettingsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencySettingsQuery = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: string, settings: { __typename?: 'AgencySettings', id: string, checkout_success_url?: string | null, checkout_cancel_url?: string | null } } | null };

export type ProductSettingsQueryVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type ProductSettingsQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, settings: { __typename?: 'ProductSettings', id: string, checkout_success_url?: string | null, checkout_cancel_url?: string | null } } | null };

export type AgencyPagesQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  page_definition_id?: InputMaybe<Scalars['ID']>;
}>;


export type AgencyPagesQuery = { __typename?: 'Query', pages?: Array<{ __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: { __typename?: 'Product', id: string } | null, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } }> }> | null };

export type ProductPagesQueryVariables = Exact<{
  product_id: Scalars['ID'];
  page_definition_id?: InputMaybe<Scalars['ID']>;
}>;


export type ProductPagesQuery = { __typename?: 'Query', pages?: Array<{ __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: { __typename?: 'Product', id: string } | null, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } }> }> | null };

export type PageQueryVariables = Exact<{
  page_id: Scalars['ID'];
}>;


export type PageQuery = { __typename?: 'Query', page?: { __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: { __typename?: 'Product', id: string } | null, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } }> } | null };

export type PageByUrlQueryVariables = Exact<{
  url: Scalars['String'];
}>;


export type PageByUrlQuery = { __typename?: 'Query', page_by_url?: { __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: { __typename?: 'Product', id: string } | null, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } }> } | null };

export type PageBlockQueryVariables = Exact<{
  page_block_id: Scalars['ID'];
}>;


export type PageBlockQuery = { __typename?: 'Query', page_block?: { __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } } | null };

export type PageDefinitionQueryVariables = Exact<{
  page_definition_id: Scalars['ID'];
}>;


export type PageDefinitionQuery = { __typename?: 'Query', page_definition?: { __typename?: 'PageDefinition', id: string, name: string, url_path: string } | null };

export type PageBlockDefinitionQueryVariables = Exact<{
  page_block_definition_id: Scalars['ID'];
}>;


export type PageBlockDefinitionQuery = { __typename?: 'Query', page_block_definition?: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> } | null };

export type PageDefinitionsByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type PageDefinitionsByNameQuery = { __typename?: 'Query', page_definitions?: Array<{ __typename?: 'PageDefinition', id: string, name: string, url_path: string }> | null };

export type PageDefinitionByUrlPathQueryVariables = Exact<{
  url_path: Scalars['String'];
}>;


export type PageDefinitionByUrlPathQuery = { __typename?: 'Query', page_definition_by_url_path?: { __typename?: 'PageDefinition', id: string, name: string, url_path: string } | null };

export type PageBlockDefinitionsByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type PageBlockDefinitionsByNameQuery = { __typename?: 'Query', page_block_definitions?: Array<{ __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> }> | null };

export type CalculateTransactionFeeQueryVariables = Exact<{
  subscription_plan_id: Scalars['ID'];
  amount: Scalars['Int'];
  currency: Scalars['String'];
}>;


export type CalculateTransactionFeeQuery = { __typename?: 'Query', subscription_plan?: { __typename?: 'SubscriptionPlan', id: string, calculate_fee: number } | null };

export type FormFieldQueryVariables = Exact<{
  form_field_id: Scalars['ID'];
}>;


export type FormFieldQuery = { __typename?: 'Query', form_field?: { __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null } | null };

export type FormFieldsQueryVariables = Exact<{
  filter: FormFieldFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type FormFieldsQuery = { __typename?: 'Query', form_fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null };

export type CredentialQueryVariables = Exact<{
  credential_id: Scalars['ID'];
}>;


export type CredentialQuery = { __typename?: 'Query', credential?: { __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } } | null };

export type CredentialsQueryVariables = Exact<{
  filter: CredentialFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type CredentialsQuery = { __typename?: 'Query', credentials?: Array<{ __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } }> | null };

export type CredentialTypeQueryVariables = Exact<{
  credential_type_id: Scalars['ID'];
}>;


export type CredentialTypeQuery = { __typename?: 'Query', credential_type?: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } | null };

export type CredentialTypesQueryVariables = Exact<{
  filter: CredentialTypeFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type CredentialTypesQuery = { __typename?: 'Query', credential_types?: Array<{ __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null }> | null };

export type IntegrationQueryVariables = Exact<{
  integration_id: Scalars['ID'];
}>;


export type IntegrationQuery = { __typename?: 'Query', integration?: { __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, product?: { __typename?: 'Product', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: { __typename?: 'IntegrationConfig', id: string } | null } | null };

export type IntegrationsQueryVariables = Exact<{
  filter: IntegrationFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type IntegrationsQuery = { __typename?: 'Query', integrations?: Array<{ __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, product?: { __typename?: 'Product', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: { __typename?: 'IntegrationConfig', id: string } | null }> | null };

export type IntegrationConfigQueryVariables = Exact<{
  integration_config_id: Scalars['ID'];
}>;


export type IntegrationConfigQuery = { __typename?: 'Query', integration_config?: { __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string } } | null };

export type IntegrationConfigsQueryVariables = Exact<{
  filter: IntegrationConfigFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type IntegrationConfigsQuery = { __typename?: 'Query', integration_configs?: Array<{ __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: { __typename?: 'Credential', id: string } | null, integration_type: { __typename?: 'IntegrationType', id: string } }> | null };

export type IntegrationTypeQueryVariables = Exact<{
  integration_type_id: Scalars['ID'];
}>;


export type IntegrationTypeQuery = { __typename?: 'Query', integration_type?: { __typename?: 'IntegrationType', id: string, name: string, title: string, status: string, automatic_order_management: boolean, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null, config_fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null, credential_type?: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } | null } | null };

export type IntegrationTypesQueryVariables = Exact<{
  filter: IntegrationTypeFilter;
  token?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
  order_by?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  before_id?: InputMaybe<Scalars['ID']>;
  after_id?: InputMaybe<Scalars['ID']>;
}>;


export type IntegrationTypesQuery = { __typename?: 'Query', integration_types?: Array<{ __typename?: 'IntegrationType', id: string, name: string, title: string, status: string, automatic_order_management: boolean, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null, config_fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null, credential_type?: { __typename?: 'CredentialType', id: string, name: string, fields?: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: string | null, prefix?: string | null, suffix?: string | null, required: boolean, default?: any | null }> | null } | null }> | null };

export const Stripe_AccountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_account"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"business_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mcc"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"product_description"}},{"kind":"Field","name":{"kind":"Name","value":"support_address"}},{"kind":"Field","name":{"kind":"Name","value":"support_email"}},{"kind":"Field","name":{"kind":"Name","value":"support_phone"}},{"kind":"Field","name":{"kind":"Name","value":"support_url"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"business_type"}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card_payments"}},{"kind":"Field","name":{"kind":"Name","value":"transfers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_deadline"}},{"kind":"Field","name":{"kind":"Name","value":"disabled_reason"}},{"kind":"Field","name":{"kind":"Name","value":"currently_due"}},{"kind":"Field","name":{"kind":"Name","value":"eventually_due"}},{"kind":"Field","name":{"kind":"Name","value":"past_due"}},{"kind":"Field","name":{"kind":"Name","value":"pending_verification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"primary_color"}},{"kind":"Field","name":{"kind":"Name","value":"secondary_color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"charges_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency"}},{"kind":"Field","name":{"kind":"Name","value":"details_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"payouts_enabled"}}]}}]} as unknown as DocumentNode<Stripe_AccountFragment, unknown>;
export const CouponFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"coupon"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount_off"}},{"kind":"Field","name":{"kind":"Name","value":"applies_to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"duration_in_months"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"max_redemptions"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"percent_off"}},{"kind":"Field","name":{"kind":"Name","value":"redeem_by"}},{"kind":"Field","name":{"kind":"Name","value":"times_redeemed"}},{"kind":"Field","name":{"kind":"Name","value":"valid"}}]}}]} as unknown as DocumentNode<CouponFragment, unknown>;
export const Promotion_CodeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"promotion_code"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PromotionCode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"coupon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"max_redemptions"}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_time_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_amount"}},{"kind":"Field","name":{"kind":"Name","value":"minimum_amount_currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"times_redeemed"}}]}}]} as unknown as DocumentNode<Promotion_CodeFragment, unknown>;
export const Product_SettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"product_settings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductSettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_success_url"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_cancel_url"}}]}}]} as unknown as DocumentNode<Product_SettingsFragment, unknown>;
export const Transaction_FeeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"transaction_fee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionFee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"transaction_amount_upper_bound"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Transaction_FeeFragment, unknown>;
export const Subscription_PlanFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subscription_plan"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionPlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"transaction_fees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"transaction_fee"}}]}}]}}]} as unknown as DocumentNode<Subscription_PlanFragment, unknown>;
export const Agency_SettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"agency_settings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AgencySettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_success_url"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_cancel_url"}}]}}]} as unknown as DocumentNode<Agency_SettingsFragment, unknown>;
export const AddressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]} as unknown as DocumentNode<AddressFragment, unknown>;
export const Stripe_CustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"delinquent"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_prefix"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"next_invoice_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"preferred_locales"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Stripe_CustomerFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"user"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const CustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_stripe_customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"user"}}]}}]}}]} as unknown as DocumentNode<CustomerFragment, unknown>;
export const ImageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"image"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}}]} as unknown as DocumentNode<ImageFragment, unknown>;
export const ThemeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"theme"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Theme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"color_primary"}},{"kind":"Field","name":{"kind":"Name","value":"color_secondary"}},{"kind":"Field","name":{"kind":"Name","value":"color_accent"}},{"kind":"Field","name":{"kind":"Name","value":"color_background"}},{"kind":"Field","name":{"kind":"Name","value":"color_surface"}},{"kind":"Field","name":{"kind":"Name","value":"color_error"}},{"kind":"Field","name":{"kind":"Name","value":"color_success"}}]}}]} as unknown as DocumentNode<ThemeFragment, unknown>;
export const AgencyFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"agency"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agency"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"subdomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_pricing_currency"}}]}}]} as unknown as DocumentNode<AgencyFragment, unknown>;
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
export const Stripe_ProductFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"deactivate_on"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"package_dimensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippable"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"tax_code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unit_label"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<Stripe_ProductFragment, unknown>;
export const Stripe_PriceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"billing_scheme"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"lookup_key"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recurring"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate_usage"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"interval_count"}},{"kind":"Field","name":{"kind":"Name","value":"trial_period_days"}},{"kind":"Field","name":{"kind":"Name","value":"usage_type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax_behavior"}},{"kind":"Field","name":{"kind":"Name","value":"tiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flat_amount"}},{"kind":"Field","name":{"kind":"Name","value":"flat_amount_decimal"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount_decimal"}},{"kind":"Field","name":{"kind":"Name","value":"up_to"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tiers_mode"}},{"kind":"Field","name":{"kind":"Name","value":"transform_quantity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"divide_by"}},{"kind":"Field","name":{"kind":"Name","value":"round"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount_decimal"}}]}}]} as unknown as DocumentNode<Stripe_PriceFragment, unknown>;
export const Line_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"line_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]} as unknown as DocumentNode<Line_ItemFragment, unknown>;
export const Balance_TransactionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"balance_transaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"available_on"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"exchange_rate"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"fee_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"application"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"net"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reporting_category"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<Balance_TransactionFragment, unknown>;
export const ChargeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"charge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"authorization_code"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculated_statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"captured"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"disputed"}},{"kind":"Field","name":{"kind":"Name","value":"failure_code"}},{"kind":"Field","name":{"kind":"Name","value":"failure_message"}},{"kind":"Field","name":{"kind":"Name","value":"fraud_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_report"}},{"kind":"Field","name":{"kind":"Name","value":"user_report"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network_status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"risk_level"}},{"kind":"Field","name":{"kind":"Name","value":"risk_score"}},{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seller_message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_number"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_url"}},{"kind":"Field","name":{"kind":"Name","value":"refunded"}},{"kind":"Field","name":{"kind":"Name","value":"source_transfer"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}}]} as unknown as DocumentNode<ChargeFragment, unknown>;
export const Payment_IntentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"payment_intent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentIntent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"cancellation_reason"}},{"kind":"Field","name":{"kind":"Name","value":"capture_method"}},{"kind":"Field","name":{"kind":"Name","value":"charges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"charge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmation_method"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"on_behalf_of"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"setup_future_usage"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}}]} as unknown as DocumentNode<Payment_IntentFragment, unknown>;
export const Subscription_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subscription_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"billing_thresholds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usage_gte"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_product"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Subscription_ItemFragment, unknown>;
export const SubscriptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_percent"}},{"kind":"Field","name":{"kind":"Name","value":"automatic_tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_cycle_anchor"}},{"kind":"Field","name":{"kind":"Name","value":"billing_thresholds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount_gte"}},{"kind":"Field","name":{"kind":"Name","value":"reset_billing_cycle_anchor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancel_at"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_at_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"collection_method"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_start"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days_until_due"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ended_at"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"next_pending_invoice_item_invoice"}},{"kind":"Field","name":{"kind":"Name","value":"pause_collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"behavior"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payment_method_options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acss_debit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mandate_options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transaction_type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"verification_method"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"request_three_d_secure"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bancontact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preferred_language"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pending_invoice_item_interval"}},{"kind":"Field","name":{"kind":"Name","value":"pending_update"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billing_cycle_anchor"}},{"kind":"Field","name":{"kind":"Name","value":"trial_end"}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}},{"kind":"Field","name":{"kind":"Name","value":"trial_from_plan"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"trial_end"}},{"kind":"Field","name":{"kind":"Name","value":"trial_start"}}]}}]} as unknown as DocumentNode<SubscriptionFragment, unknown>;
export const Stripe_Checkout_SessionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_checkout_session"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCheckoutSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"after_expiration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recovery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allow_promotion_codes"}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allow_promotion_codes"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"automatic_tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_address_collection"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_url"}},{"kind":"Field","name":{"kind":"Name","value":"client_reference_id"}},{"kind":"Field","name":{"kind":"Name","value":"consent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promotions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"consent_collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promotions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tax_exempt"}},{"kind":"Field","name":{"kind":"Name","value":"tax_ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_email"}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}},{"kind":"Field","name":{"kind":"Name","value":"line_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"line_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"payment_status"}},{"kind":"Field","name":{"kind":"Name","value":"phone_number_collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping_address_collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowed_countries"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping_options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipping_amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"submit_type"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success_url"}},{"kind":"Field","name":{"kind":"Name","value":"tax_id_collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount_discount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_shipping"}},{"kind":"Field","name":{"kind":"Name","value":"amount_tax"}},{"kind":"Field","name":{"kind":"Name","value":"breakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<Stripe_Checkout_SessionFragment, unknown>;
export const DiscountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"discount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Discount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_session"}},{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice_item"}},{"kind":"Field","name":{"kind":"Name","value":"promotion_code"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}}]}}]} as unknown as DocumentNode<DiscountFragment, unknown>;
export const InvoiceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"invoice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Invoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"account_country"}},{"kind":"Field","name":{"kind":"Name","value":"account_name"}},{"kind":"Field","name":{"kind":"Name","value":"account_tax_ids"}},{"kind":"Field","name":{"kind":"Name","value":"amount_due"}},{"kind":"Field","name":{"kind":"Name","value":"amount_paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount_remaining"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"attempt_count"}},{"kind":"Field","name":{"kind":"Name","value":"attempted"}},{"kind":"Field","name":{"kind":"Name","value":"auto_advance"}},{"kind":"Field","name":{"kind":"Name","value":"automatic_tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_reason"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collection_method"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"custom_fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_email"}},{"kind":"Field","name":{"kind":"Name","value":"customer_name"}},{"kind":"Field","name":{"kind":"Name","value":"customer_phone"}},{"kind":"Field","name":{"kind":"Name","value":"customer_shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_tax_exempt"}},{"kind":"Field","name":{"kind":"Name","value":"customer_tax_ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"discount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"discount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"due_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_balance"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"hosted_invoice_url"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_pdf"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"next_payment_attempt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"period_end"}},{"kind":"Field","name":{"kind":"Name","value":"period_start"}},{"kind":"Field","name":{"kind":"Name","value":"post_payment_credit_notes_amount"}},{"kind":"Field","name":{"kind":"Name","value":"pre_payment_credit_notes_amount"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_number"}},{"kind":"Field","name":{"kind":"Name","value":"starting_balance"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"status_transitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finalized_at"}},{"kind":"Field","name":{"kind":"Name","value":"marked_uncollectible_at"}},{"kind":"Field","name":{"kind":"Name","value":"paid_at"}},{"kind":"Field","name":{"kind":"Name","value":"voided_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscription_proration_date"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"webhooks_delivered_at"}}]}}]} as unknown as DocumentNode<InvoiceFragment, unknown>;
export const Invoice_Line_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"invoice_line_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount_amounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"discount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discountable"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_item"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proration"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_item"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<Invoice_Line_ItemFragment, unknown>;
export const InvoiceitemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"invoiceitem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvoiceItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discountable"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proration"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount_decimal"}}]}}]} as unknown as DocumentNode<InvoiceitemFragment, unknown>;
export const PriceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Price"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval_count"}}]}}]} as unknown as DocumentNode<PriceFragment, unknown>;
export const MarkdownFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"markdown"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Markdown"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]} as unknown as DocumentNode<MarkdownFragment, unknown>;
export const ProductFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url_name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"default_price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"markdown_description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProductFragment, unknown>;
export const Order_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"order_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_line_item_id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"processed_at"}}]}}]} as unknown as DocumentNode<Order_ItemFragment, unknown>;
export const OrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ordered_at"}},{"kind":"Field","name":{"kind":"Name","value":"processed_at"}}]}}]} as unknown as DocumentNode<OrderFragment, unknown>;
export const Bank_AccountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"bank_account"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BankAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"account_holder_name"}},{"kind":"Field","name":{"kind":"Name","value":"account_holder_type"}},{"kind":"Field","name":{"kind":"Name","value":"available_payout_methods"}},{"kind":"Field","name":{"kind":"Name","value":"bank_name"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default_for_currency"}},{"kind":"Field","name":{"kind":"Name","value":"fingerprint"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"routing_number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<Bank_AccountFragment, unknown>;
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
export const UpdateThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"theme_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color_primary"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color_secondary"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color_accent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color_background"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color_surface"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color_error"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color_success"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_theme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"theme_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"theme_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"color_primary"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color_primary"}}},{"kind":"Argument","name":{"kind":"Name","value":"color_secondary"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color_secondary"}}},{"kind":"Argument","name":{"kind":"Name","value":"color_accent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color_accent"}}},{"kind":"Argument","name":{"kind":"Name","value":"color_background"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color_background"}}},{"kind":"Argument","name":{"kind":"Name","value":"color_surface"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color_surface"}}},{"kind":"Argument","name":{"kind":"Name","value":"color_error"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color_error"}}},{"kind":"Argument","name":{"kind":"Name","value":"color_success"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color_success"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}}]}}]}},...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<UpdateThemeMutation, UpdateThemeMutationVariables>;
export const CreateImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"access"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessLevel"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_image"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"access"},"value":{"kind":"Variable","name":{"kind":"Name","value":"access"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}}]}}]}},...ImageFragmentDoc.definitions]} as unknown as DocumentNode<CreateImageMutation, CreateImageMutationVariables>;
export const UpdateImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"access"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessLevel"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_image"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"image_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"access"},"value":{"kind":"Variable","name":{"kind":"Name","value":"access"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}}]}}]}},...ImageFragmentDoc.definitions]} as unknown as DocumentNode<UpdateImageMutation, UpdateImageMutationVariables>;
export const CreateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"agency_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}}]}},...ProductFragmentDoc.definitions,...PriceFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_price_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_price_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_price_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"image_hero"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_hero"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}}]}},...ProductFragmentDoc.definitions,...PriceFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<UpdateProductMutation, UpdateProductMutationVariables>;
export const DeleteProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteProductMutation, DeleteProductMutationVariables>;
export const CreatePriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval_count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_price"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"unit_amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"recurring_interval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval"}}},{"kind":"Argument","name":{"kind":"Name","value":"recurring_interval_count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurring_interval_count"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}}]}}]}},...PriceFragmentDoc.definitions]} as unknown as DocumentNode<CreatePriceMutation, CreatePriceMutationVariables>;
export const CreateCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount_off"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"percent_off"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration_in_months"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"applies_to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CouponAppliesToInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"max_redemptions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redeem_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_coupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount_off"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount_off"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"percent_off"},"value":{"kind":"Variable","name":{"kind":"Name","value":"percent_off"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"duration_in_months"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration_in_months"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"applies_to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"applies_to"}}},{"kind":"Argument","name":{"kind":"Name","value":"max_redemptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"max_redemptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"redeem_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redeem_by"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"coupon"}}]}}]}}]}},...CouponFragmentDoc.definitions]} as unknown as DocumentNode<CreateCouponMutation, CreateCouponMutationVariables>;
export const UpdateCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_coupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"coupon_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"coupon"}}]}}]}}]}},...CouponFragmentDoc.definitions]} as unknown as DocumentNode<UpdateCouponMutation, UpdateCouponMutationVariables>;
export const DeleteCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_coupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"coupon_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCouponMutation, DeleteCouponMutationVariables>;
export const CreatePromotionCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePromotionCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expires_at"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"max_redemptions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restrictions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PromotionCodeRestrictionsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_promotion_code"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"coupon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"expires_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expires_at"}}},{"kind":"Argument","name":{"kind":"Name","value":"max_redemptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"max_redemptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"restrictions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restrictions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"promotion_code"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"promotion_code"}}]}}]}}]}},...Promotion_CodeFragmentDoc.definitions,...CouponFragmentDoc.definitions]} as unknown as DocumentNode<CreatePromotionCodeMutation, CreatePromotionCodeMutationVariables>;
export const UpdatePromotionCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePromotionCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promotion_code_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_promotion_code"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"promotion_code_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promotion_code_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"promotion_code"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"promotion_code"}}]}}]}}]}},...Promotion_CodeFragmentDoc.definitions,...CouponFragmentDoc.definitions]} as unknown as DocumentNode<UpdatePromotionCodeMutation, UpdatePromotionCodeMutationVariables>;
export const CreateSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"items"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionItemInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cancel_at_period_end"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payment_behaviour"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"backdate_start_date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"billing_cycle_anchor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cancel_at"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promotion_code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proration_behaviour"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trial_end"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trial_from_plan"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trial_period_days"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"items"},"value":{"kind":"Variable","name":{"kind":"Name","value":"items"}}},{"kind":"Argument","name":{"kind":"Name","value":"cancel_at_period_end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cancel_at_period_end"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_payment_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"payment_behaviour"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payment_behaviour"}}},{"kind":"Argument","name":{"kind":"Name","value":"backdate_start_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"backdate_start_date"}}},{"kind":"Argument","name":{"kind":"Name","value":"billing_cycle_anchor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"billing_cycle_anchor"}}},{"kind":"Argument","name":{"kind":"Name","value":"cancel_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cancel_at"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"coupon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}}},{"kind":"Argument","name":{"kind":"Name","value":"days_until_due"},"value":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}}},{"kind":"Argument","name":{"kind":"Name","value":"promotion_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promotion_code"}}},{"kind":"Argument","name":{"kind":"Name","value":"proration_behaviour"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proration_behaviour"}}},{"kind":"Argument","name":{"kind":"Name","value":"trial_end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trial_end"}}},{"kind":"Argument","name":{"kind":"Name","value":"trial_from_plan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trial_from_plan"}}},{"kind":"Argument","name":{"kind":"Name","value":"trial_period_days"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trial_period_days"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription"}}]}}]}}]}},...SubscriptionFragmentDoc.definitions,...Subscription_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Stripe_ProductFragmentDoc.definitions]} as unknown as DocumentNode<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>;
export const CancelSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cancel_at_period_end"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cancel_at"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prorate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancel_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscription_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"cancel_at_period_end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cancel_at_period_end"}}},{"kind":"Argument","name":{"kind":"Name","value":"cancel_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cancel_at"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_now"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_now"}}},{"kind":"Argument","name":{"kind":"Name","value":"prorate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prorate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription"}}]}}]}}]}},...SubscriptionFragmentDoc.definitions,...Subscription_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Stripe_ProductFragmentDoc.definitions]} as unknown as DocumentNode<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>;
export const CreateInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auto_advance"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"footer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"items"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InvoiceItemInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"auto_advance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auto_advance"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"footer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"footer"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscription"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}}},{"kind":"Argument","name":{"kind":"Name","value":"days_until_due"},"value":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_payment_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}}},{"kind":"Argument","name":{"kind":"Name","value":"due_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"items"},"value":{"kind":"Variable","name":{"kind":"Name","value":"items"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<CreateInvoiceMutation, CreateInvoiceMutationVariables>;
export const UpdateInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auto_advance"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"footer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"auto_advance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auto_advance"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"footer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"footer"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscription"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}}},{"kind":"Argument","name":{"kind":"Name","value":"days_until_due"},"value":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_payment_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}}},{"kind":"Argument","name":{"kind":"Name","value":"due_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>;
export const DeleteInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;
export const VoidInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VoidInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"void_invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<VoidInvoiceMutation, VoidInvoiceMutationVariables>;
export const FinalizeInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinalizeInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finalize_invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<FinalizeInvoiceMutation, FinalizeInvoiceMutationVariables>;
export const MarkInvoiceUncollectibleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkInvoiceUncollectible"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mark_invoice_uncollectible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MarkInvoiceUncollectibleMutation, MarkInvoiceUncollectibleMutationVariables>;
export const CreateInvoiceItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvoiceItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PeriodInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"discountable"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount_decimal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_invoiceitem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}},{"kind":"Argument","name":{"kind":"Name","value":"discountable"},"value":{"kind":"Variable","name":{"kind":"Name","value":"discountable"}}},{"kind":"Argument","name":{"kind":"Name","value":"quantity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}}},{"kind":"Argument","name":{"kind":"Name","value":"unit_amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"unit_amount_decimal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount_decimal"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceitem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoiceitem"}}]}}]}}]}},...InvoiceitemFragmentDoc.definitions]} as unknown as DocumentNode<CreateInvoiceItemMutation, CreateInvoiceItemMutationVariables>;
export const UpdateInvoiceItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInvoiceItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoiceitem_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PeriodInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"discountable"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount_decimal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_invoiceitem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoiceitem_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoiceitem_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}},{"kind":"Argument","name":{"kind":"Name","value":"discountable"},"value":{"kind":"Variable","name":{"kind":"Name","value":"discountable"}}},{"kind":"Argument","name":{"kind":"Name","value":"quantity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}}},{"kind":"Argument","name":{"kind":"Name","value":"unit_amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"unit_amount_decimal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit_amount_decimal"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceitem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoiceitem"}}]}}]}}]}},...InvoiceitemFragmentDoc.definitions]} as unknown as DocumentNode<UpdateInvoiceItemMutation, UpdateInvoiceItemMutationVariables>;
export const DeleteInvoiceItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInvoiceItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoiceitem_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_invoiceitem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoiceitem_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoiceitem_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceitem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteInvoiceItemMutation, DeleteInvoiceItemMutationVariables>;
export const CreateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}},...CustomerFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email_address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}}]}},...CustomerFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const CreateBankAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBankAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account_number"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account_holder_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account_holder_type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"routing_number"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_for_currency"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_bank_account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"account_holder_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account_holder_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"account_number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account_number"}}},{"kind":"Argument","name":{"kind":"Name","value":"account_holder_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account_holder_type"}}},{"kind":"Argument","name":{"kind":"Name","value":"routing_number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"routing_number"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_for_currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_for_currency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"bank_account"}}]}}]}}]}},...Bank_AccountFragmentDoc.definitions]} as unknown as DocumentNode<CreateBankAccountMutation, CreateBankAccountMutationVariables>;
export const UpdateBankAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBankAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bank_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account_holder_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account_holder_type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_for_currency"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_bank_account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"bank_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bank_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"account_holder_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account_holder_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"account_holder_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account_holder_type"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_for_currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_for_currency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"bank_account"}}]}}]}}]}},...Bank_AccountFragmentDoc.definitions]} as unknown as DocumentNode<UpdateBankAccountMutation, UpdateBankAccountMutationVariables>;
export const DeleteBankAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBankAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bank_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_bank_account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"bank_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bank_account_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteBankAccountMutation, DeleteBankAccountMutationVariables>;
export const UpdateAgencySettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAgencySettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkout_success_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkout_cancel_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_agency_settings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"checkout_success_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkout_success_url"}}},{"kind":"Argument","name":{"kind":"Name","value":"checkout_cancel_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkout_cancel_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency_settings"}}]}}]}}]}},...Agency_SettingsFragmentDoc.definitions]} as unknown as DocumentNode<UpdateAgencySettingsMutation, UpdateAgencySettingsMutationVariables>;
export const UpdateProductSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkout_success_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkout_cancel_url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_product_settings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setting_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setting_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"checkout_success_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkout_success_url"}}},{"kind":"Argument","name":{"kind":"Name","value":"checkout_cancel_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkout_cancel_url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"setting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product_settings"}}]}}]}}]}},...Product_SettingsFragmentDoc.definitions]} as unknown as DocumentNode<UpdateProductSettingsMutation, UpdateProductSettingsMutationVariables>;
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
export const ThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Theme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"theme_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"theme_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}}]}},...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<ThemeQuery, ThemeQueryVariables>;
export const ThemesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Themes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ThemeFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"themes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"theme"}}]}}]}},...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<ThemesQuery, ThemesQueryVariables>;
export const MarkdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Markdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"markdown_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markdown"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"markdown_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}}]}},...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<MarkdownQuery, MarkdownQueryVariables>;
export const MarkdownsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Markdowns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkdownFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markdowns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}}]}},...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<MarkdownsQuery, MarkdownsQueryVariables>;
export const ImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Image"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}}]}},...ImageFragmentDoc.definitions]} as unknown as DocumentNode<ImageQuery, ImageQueryVariables>;
export const ImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Images"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"image"}}]}}]}},...ImageFragmentDoc.definitions]} as unknown as DocumentNode<ImagesQuery, ImagesQueryVariables>;
export const AgencyStripeAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_account"}}]}}]}}]}},...Stripe_AccountFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountQuery, AgencyStripeAccountQueryVariables>;
export const AgencyStripeAccountUpdateUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountUpdateUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"account_update_url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AgencyStripeAccountUpdateUrlQuery, AgencyStripeAccountUpdateUrlQueryVariables>;
export const AgencyStripeAccountBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"connect_reserved"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"source_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"bank_account"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AgencyStripeAccountBalanceQuery, AgencyStripeAccountBalanceQueryVariables>;
export const AgencyStripeAccountBalanceTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalanceTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}}]}}]}}]}},...Balance_TransactionFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountBalanceTransactionsQuery, AgencyStripeAccountBalanceTransactionsQueryVariables>;
export const AgencyStripeAccountPaymentIntentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountPaymentIntents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}}]}}]}}]}},...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountPaymentIntentsQuery, AgencyStripeAccountPaymentIntentsQueryVariables>;
export const AgencyStripeAccountChargesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountCharges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payment_intent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"charges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"payment_intent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payment_intent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"charge"}}]}}]}}]}}]}},...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountChargesQuery, AgencyStripeAccountChargesQueryVariables>;
export const CustomerPaymentIntentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomerPaymentIntents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}}]}}]}}]}},...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions]} as unknown as DocumentNode<CustomerPaymentIntentsQuery, CustomerPaymentIntentsQueryVariables>;
export const AgencyStripeAccountBankAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBankAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bank_accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"bank_account"}}]}}]}}]}}]}},...Bank_AccountFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountBankAccountsQuery, AgencyStripeAccountBankAccountsQueryVariables>;
export const AgencyStripeAccountCouponsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountCoupons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"coupons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"coupon"}}]}}]}}]}}]}},...CouponFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountCouponsQuery, AgencyStripeAccountCouponsQueryVariables>;
export const CouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Coupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"coupon_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"coupon"}}]}}]}},...CouponFragmentDoc.definitions]} as unknown as DocumentNode<CouponQuery, CouponQueryVariables>;
export const PromotionCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PromotionCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promotion_code_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promotion_code"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"promotion_code_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promotion_code_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"promotion_code"}}]}}]}},...Promotion_CodeFragmentDoc.definitions,...CouponFragmentDoc.definitions]} as unknown as DocumentNode<PromotionCodeQuery, PromotionCodeQueryVariables>;
export const PromotionCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PromotionCodes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promotion_codes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"coupon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}}},{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"promotion_code"}}]}}]}},...Promotion_CodeFragmentDoc.definitions,...CouponFragmentDoc.definitions]} as unknown as DocumentNode<PromotionCodesQuery, PromotionCodesQueryVariables>;
export const AgencyStripeAccountSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"current_period_start"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeStampFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"current_period_end"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeStampFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"current_period_start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"current_period_start"}}},{"kind":"Argument","name":{"kind":"Name","value":"current_period_end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"current_period_end"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}}]}}]}},...SubscriptionFragmentDoc.definitions,...Subscription_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Stripe_ProductFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...InvoiceFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountSubscriptionsQuery, AgencyStripeAccountSubscriptionsQueryVariables>;
export const CustomerSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomerSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription"}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}}]}}]}},...SubscriptionFragmentDoc.definitions,...Subscription_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Stripe_ProductFragmentDoc.definitions,...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<CustomerSubscriptionsQuery, CustomerSubscriptionsQueryVariables>;
export const SubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Subscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscription_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}},...SubscriptionFragmentDoc.definitions,...Subscription_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Stripe_ProductFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...InvoiceFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<SubscriptionQuery, SubscriptionQueryVariables>;
export const ChargeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Charge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"charge_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"charge_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"charge_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"charge"}}]}}]}},...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions]} as unknown as DocumentNode<ChargeQuery, ChargeQueryVariables>;
export const PaymentIntentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PaymentIntent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payment_intent_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"payment_intent_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payment_intent_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}}]}},...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions]} as unknown as DocumentNode<PaymentIntentQuery, PaymentIntentQueryVariables>;
export const InvoiceItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvoiceItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoiceitem_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoiceitem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoiceitem_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoiceitem_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoiceitem"}}]}}]}},...InvoiceitemFragmentDoc.definitions]} as unknown as DocumentNode<InvoiceItemQuery, InvoiceItemQueryVariables>;
export const AgencyStripeAccountInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscription"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"due_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}}},{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountInvoicesQuery, AgencyStripeAccountInvoicesQueryVariables>;
export const CustomerInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomerInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invoices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<CustomerInvoicesQuery, CustomerInvoicesQueryVariables>;
export const AgencyStripeAccountInvoiceItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountInvoiceItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pending"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceitems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice"}}},{"kind":"Argument","name":{"kind":"Name","value":"pending"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pending"}}},{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoiceitem"}}]}}]}}]}}]}},...InvoiceitemFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountInvoiceItemsQuery, AgencyStripeAccountInvoiceItemsQueryVariables>;
export const InvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Invoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<InvoiceQuery, InvoiceQueryVariables>;
export const CustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Customer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customer"}}]}}]}},...CustomerFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...AddressFragmentDoc.definitions,...UserFragmentDoc.definitions]} as unknown as DocumentNode<CustomerQuery, CustomerQueryVariables>;
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
export const OrderDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_checkout_session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_checkout_session"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"subscription"}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}}]}}]}},...OrderFragmentDoc.definitions,...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions,...Stripe_Checkout_SessionFragmentDoc.definitions,...Line_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Stripe_ProductFragmentDoc.definitions,...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...SubscriptionFragmentDoc.definitions,...Subscription_ItemFragmentDoc.definitions,...InvoiceFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<OrderDetailsQuery, OrderDetailsQueryVariables>;
export const OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_checkout_session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_checkout_session"}}]}}]}}]}},...OrderFragmentDoc.definitions,...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions,...Stripe_Checkout_SessionFragmentDoc.definitions,...Line_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Stripe_ProductFragmentDoc.definitions,...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...SubscriptionFragmentDoc.definitions,...Subscription_ItemFragmentDoc.definitions]} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const OrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Orders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_checkout_session"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_checkout_session"}}]}}]}}]}},...OrderFragmentDoc.definitions,...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions,...Stripe_Checkout_SessionFragmentDoc.definitions,...Line_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Stripe_ProductFragmentDoc.definitions,...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions,...SubscriptionFragmentDoc.definitions,...Subscription_ItemFragmentDoc.definitions]} as unknown as DocumentNode<OrdersQuery, OrdersQueryVariables>;
export const CountOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CountOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count_orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<CountOrdersQuery, CountOrdersQueryVariables>;
export const OrderItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_item_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order_item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_item_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}}]}},...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<OrderItemQuery, OrderItemQueryVariables>;
export const OrderItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItemFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order_items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}}]}},...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<OrderItemsQuery, OrderItemsQueryVariables>;
export const ProductAndAgencyFromUrlPartsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductAndAgencyFromUrlParts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_url_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"url_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_url_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}}]}}]}}]}},...ProductFragmentDoc.definitions,...PriceFragmentDoc.definitions,...MarkdownFragmentDoc.definitions,...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<ProductAndAgencyFromUrlPartsQuery, ProductAndAgencyFromUrlPartsQueryVariables>;
export const SubdomainAgencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}}]}}]}}]}},...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<SubdomainAgencyQuery, SubdomainAgencyQueryVariables>;
export const SubdomainAgencyExtendedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgencyExtended"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency"}},{"kind":"Field","name":{"kind":"Name","value":"supported_payment_currencies"}}]}}]}}]}},...AgencyFragmentDoc.definitions,...ThemeFragmentDoc.definitions,...ImageFragmentDoc.definitions]} as unknown as DocumentNode<SubdomainAgencyExtendedQuery, SubdomainAgencyExtendedQueryVariables>;
export const SubdomainAgencyStripeAccountUpdateUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdomainAgencyStripeAccountUpdateUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdomain_name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account_update_url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubdomainAgencyStripeAccountUpdateUrlQuery, SubdomainAgencyStripeAccountUpdateUrlQueryVariables>;
export const AgencySettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencySettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"agency_settings"}}]}}]}}]}},...Agency_SettingsFragmentDoc.definitions]} as unknown as DocumentNode<AgencySettingsQuery, AgencySettingsQueryVariables>;
export const ProductSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product_settings"}}]}}]}}]}},...Product_SettingsFragmentDoc.definitions]} as unknown as DocumentNode<ProductSettingsQuery, ProductSettingsQueryVariables>;
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