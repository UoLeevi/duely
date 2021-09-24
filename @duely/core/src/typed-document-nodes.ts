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
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<PageFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type AgencyProductsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<ProductFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type AgencyStripe_AccountArgs = {
  livemode?: Maybe<Scalars['Boolean']>;
};

export type AgencyFilter = {
  name?: Maybe<Scalars['String']>;
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
  agency_id?: Maybe<Scalars['ID']>;
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
  id_ext: Scalars['ID'];
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
  id_ext: Scalars['ID'];
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
  id_ext: Scalars['ID'];
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
  id_ext: Scalars['ID'];
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
  products?: Maybe<Array<Scalars['String']>>;
};

export type CouponAppliesToInput = {
  products?: Maybe<Array<Scalars['String']>>;
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
  agency_id?: Maybe<Scalars['ID']>;
  credential_type_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
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
  form_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
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
  created?: Maybe<Scalars['DateTime']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  starting_after_id?: Maybe<Scalars['String']>;
};

export type CustomerFilter = {
  default_stripe_customer_id_ext?: Maybe<Scalars['ID']>;
  email_address?: Maybe<Scalars['String']>;
  stripe_account_id?: Maybe<Scalars['ID']>;
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
  id_ext: Scalars['ID'];
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
  form_id?: Maybe<Scalars['ID']>;
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
  agency_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
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
  agency_id?: Maybe<Scalars['ID']>;
  integration_type_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type IntegrationConfigMutationResult = MutationResult & {
  __typename?: 'IntegrationConfigMutationResult';
  integration_config?: Maybe<IntegrationConfig>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type IntegrationFilter = {
  agency_id?: Maybe<Scalars['ID']>;
  integration_config_id?: Maybe<Scalars['ID']>;
  integration_type_id?: Maybe<Scalars['ID']>;
  product_id?: Maybe<Scalars['ID']>;
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
  config_form_id?: Maybe<Scalars['ID']>;
  form_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type Invoice = {
  __typename?: 'Invoice';
  account_country?: Maybe<Scalars['String']>;
  account_name?: Maybe<Scalars['String']>;
  account_tax_ids: Array<Scalars['String']>;
  amount_due: Scalars['Int'];
  amount_paid: Scalars['Int'];
  amount_remaining: Scalars['Int'];
  application_fee_amount: Scalars['Int'];
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
  ending_balance: Scalars['Int'];
  footer?: Maybe<Scalars['String']>;
  hosted_invoice_url?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
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
  starting_balance: Scalars['Int'];
  statement_descriptor?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  status_transitions?: Maybe<InvoiceStatusTransitions>;
  subscription_proration_date?: Maybe<Scalars['DateTime']>;
  subtotal: Scalars['Int'];
  tax: Scalars['Int'];
  total: Scalars['Int'];
  webhooks_delivered_at: Scalars['DateTime'];
};


export type InvoiceLinesArgs = {
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  starting_after_id?: Maybe<Scalars['String']>;
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
  id_ext: Scalars['ID'];
  invoice?: Maybe<Invoice>;
  livemode: Scalars['Boolean'];
  price?: Maybe<StripePrice>;
  proration: Scalars['Boolean'];
  quantity: Scalars['Int'];
  unit_amount?: Maybe<Scalars['Int']>;
  unit_amount_decimal?: Maybe<Scalars['String']>;
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
  id_ext: Scalars['ID'];
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
  agency_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
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
  access?: Maybe<AccessLevel>;
  subdomain_id?: Maybe<Scalars['ID']>;
  user_id?: Maybe<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  begin_visit: BeginVisitResult;
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
  create_stripe_checkout_session: CreateStripeCheckoutSessionResult;
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
  log_in: LogInResult;
  log_out: SimpleResult;
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
  update_theme: UpdateThemeResult;
  verify_password_reset: SimpleResult;
  verify_sign_up: SimpleResult;
};


export type MutationCreate_AgencyArgs = {
  country_code: Scalars['String'];
  default_currency?: Maybe<Scalars['String']>;
  default_pricing_currency?: Maybe<Scalars['String']>;
  image_logo: ImageInput;
  livemode: Scalars['Boolean'];
  name: Scalars['String'];
  return_url: Scalars['String'];
  subdomain_name: Scalars['String'];
};


export type MutationCreate_Bank_AccountArgs = {
  account_holder_name?: Maybe<Scalars['String']>;
  account_holder_type?: Maybe<Scalars['String']>;
  account_number: Scalars['String'];
  country: Scalars['String'];
  currency: Scalars['String'];
  default_for_currency?: Maybe<Scalars['Boolean']>;
  routing_number?: Maybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationCreate_CouponArgs = {
  amount_off?: Maybe<Scalars['Int']>;
  applies_to?: Maybe<CouponAppliesToInput>;
  currency?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  duration_in_months?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  max_redemptions?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  percent_off?: Maybe<Scalars['Int']>;
  redeem_by?: Maybe<Scalars['Int']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationCreate_CredentialArgs = {
  agency_id?: Maybe<Scalars['ID']>;
  credential_type_id: Scalars['ID'];
  data: Scalars['Json'];
  name: Scalars['String'];
};


export type MutationCreate_CustomerArgs = {
  email_address: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationCreate_ImageArgs = {
  access?: Maybe<AccessLevel>;
  agency_id?: Maybe<Scalars['ID']>;
  color: Scalars['String'];
  data: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreate_IntegrationArgs = {
  agency_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
  integration_config_id?: Maybe<Scalars['ID']>;
  integration_type_id: Scalars['ID'];
  product_id?: Maybe<Scalars['ID']>;
};


export type MutationCreate_Integration_ConfigArgs = {
  agency_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
  integration_type_id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationCreate_InvoiceArgs = {
  auto_advance?: Maybe<Scalars['Boolean']>;
  collection_method?: Maybe<Scalars['String']>;
  customer: Scalars['ID'];
  days_until_due?: Maybe<Scalars['Int']>;
  default_payment_method?: Maybe<Scalars['ID']>;
  default_source?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  due_date?: Maybe<Scalars['Int']>;
  footer?: Maybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
  subscription?: Maybe<Scalars['ID']>;
};


export type MutationCreate_InvoiceitemArgs = {
  amount?: Maybe<Scalars['Int']>;
  currency?: Maybe<Scalars['String']>;
  customer: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  discountable?: Maybe<Scalars['Boolean']>;
  invoice?: Maybe<Scalars['ID']>;
  period?: Maybe<PeriodInput>;
  price?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  stripe_account_id: Scalars['ID'];
  unit_amount?: Maybe<Scalars['Int']>;
  unit_amount_decimal?: Maybe<Scalars['String']>;
};


export type MutationCreate_MarkdownArgs = {
  access?: Maybe<AccessLevel>;
  agency_id?: Maybe<Scalars['ID']>;
  data: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreate_Page_BlockArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
  page_block_definition_id: Scalars['ID'];
  page_id: Scalars['ID'];
};


export type MutationCreate_PriceArgs = {
  currency: Scalars['String'];
  product_id: Scalars['ID'];
  recurring_interval?: Maybe<Scalars['String']>;
  recurring_interval_count?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  unit_amount: Scalars['Int'];
};


export type MutationCreate_ProductArgs = {
  agency_id: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  image_hero?: Maybe<ImageInput>;
  image_logo?: Maybe<ImageInput>;
  image_logo_id?: Maybe<Scalars['ID']>;
  markdown_description_id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  url_name: Scalars['String'];
};


export type MutationCreate_Stripe_Checkout_SessionArgs = {
  cancel_url?: Maybe<Scalars['String']>;
  livemode: Scalars['Boolean'];
  price_id: Scalars['ID'];
  success_url?: Maybe<Scalars['String']>;
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


export type MutationLog_InArgs = {
  email_address: Scalars['String'];
  password: Scalars['String'];
  recaptcha_token?: Maybe<Scalars['String']>;
};


export type MutationStart_Password_ResetArgs = {
  email_address: Scalars['String'];
  redirect_url?: Maybe<Scalars['String']>;
};


export type MutationStart_Sign_UpArgs = {
  email_address: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  recaptcha_token?: Maybe<Scalars['String']>;
  redirect_url?: Maybe<Scalars['String']>;
};


export type MutationUpdate_AgencyArgs = {
  agency_id: Scalars['ID'];
  default_currency?: Maybe<Scalars['String']>;
  default_pricing_currency?: Maybe<Scalars['String']>;
};


export type MutationUpdate_Agency_SettingsArgs = {
  checkout_cancel_url?: Maybe<Scalars['String']>;
  checkout_success_url?: Maybe<Scalars['String']>;
  setting_id: Scalars['ID'];
};


export type MutationUpdate_Bank_AccountArgs = {
  account_holder_name?: Maybe<Scalars['String']>;
  account_holder_type?: Maybe<Scalars['String']>;
  bank_account_id: Scalars['ID'];
  default_for_currency?: Maybe<Scalars['Boolean']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationUpdate_CouponArgs = {
  coupon_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  stripe_account_id: Scalars['ID'];
};


export type MutationUpdate_CredentialArgs = {
  credential_id: Scalars['ID'];
  data: Scalars['Json'];
};


export type MutationUpdate_CustomerArgs = {
  customer_id: Scalars['ID'];
  email_address?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type MutationUpdate_ImageArgs = {
  access?: Maybe<AccessLevel>;
  color?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
  image_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};


export type MutationUpdate_IntegrationArgs = {
  credential_id?: Maybe<Scalars['ID']>;
  data?: Maybe<Scalars['Json']>;
  integration_id: Scalars['ID'];
};


export type MutationUpdate_Integration_ConfigArgs = {
  credential_id?: Maybe<Scalars['ID']>;
  data?: Maybe<Scalars['Json']>;
  integration_config_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};


export type MutationUpdate_InvoiceArgs = {
  auto_advance?: Maybe<Scalars['Boolean']>;
  collection_method?: Maybe<Scalars['String']>;
  days_until_due?: Maybe<Scalars['Int']>;
  default_payment_method?: Maybe<Scalars['ID']>;
  default_source?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  due_date?: Maybe<Scalars['Int']>;
  footer?: Maybe<Scalars['String']>;
  invoice_id: Scalars['ID'];
  stripe_account_id: Scalars['ID'];
  subscription?: Maybe<Scalars['ID']>;
};


export type MutationUpdate_InvoiceitemArgs = {
  amount?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  discountable?: Maybe<Scalars['Boolean']>;
  invoiceitem_id: Scalars['ID'];
  period?: Maybe<PeriodInput>;
  price?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  stripe_account_id: Scalars['ID'];
  unit_amount?: Maybe<Scalars['Int']>;
  unit_amount_decimal?: Maybe<Scalars['String']>;
};


export type MutationUpdate_MarkdownArgs = {
  access?: Maybe<AccessLevel>;
  data?: Maybe<Scalars['String']>;
  markdown_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};


export type MutationUpdate_OrderArgs = {
  order_id: Scalars['ID'];
  processed_at?: Maybe<Scalars['DateTime']>;
  state?: Maybe<Scalars['String']>;
};


export type MutationUpdate_Order_ItemArgs = {
  order_item_id: Scalars['ID'];
  processed_at?: Maybe<Scalars['DateTime']>;
  state?: Maybe<Scalars['String']>;
};


export type MutationUpdate_PageArgs = {
  access?: Maybe<AccessLevel>;
  page_id: Scalars['ID'];
};


export type MutationUpdate_Page_BlockArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  data?: Maybe<Scalars['Json']>;
  page_block_id: Scalars['ID'];
};


export type MutationUpdate_PriceArgs = {
  price_id: Scalars['ID'];
  status: Scalars['String'];
};


export type MutationUpdate_ProductArgs = {
  default_price_id?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  image_hero?: Maybe<ImageInput>;
  image_logo?: Maybe<ImageInput>;
  image_logo_id?: Maybe<Scalars['ID']>;
  markdown_description_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  product_id: Scalars['ID'];
  status?: Maybe<Scalars['String']>;
  url_name?: Maybe<Scalars['String']>;
};


export type MutationUpdate_Product_SettingsArgs = {
  checkout_cancel_url?: Maybe<Scalars['String']>;
  checkout_success_url?: Maybe<Scalars['String']>;
  setting_id: Scalars['ID'];
};


export type MutationUpdate_ThemeArgs = {
  color_accent?: Maybe<Scalars['String']>;
  color_background?: Maybe<Scalars['String']>;
  color_error?: Maybe<Scalars['String']>;
  color_primary?: Maybe<Scalars['String']>;
  color_secondary?: Maybe<Scalars['String']>;
  color_success?: Maybe<Scalars['String']>;
  color_surface?: Maybe<Scalars['String']>;
  image_hero_id?: Maybe<Scalars['ID']>;
  image_logo_id?: Maybe<Scalars['ID']>;
  theme_id: Scalars['ID'];
};


export type MutationVerify_Password_ResetArgs = {
  password: Scalars['String'];
  verification_code: Scalars['String'];
};


export type MutationVerify_Sign_UpArgs = {
  verification_code: Scalars['String'];
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
  token?: Maybe<Scalars['String']>;
};


export type OrderItemsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<OrderItemFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type OrderStripe_Checkout_SessionArgs = {
  token?: Maybe<Scalars['String']>;
};

export type OrderFilter = {
  customer_id?: Maybe<Scalars['ID']>;
  stripe_account_id?: Maybe<Scalars['ID']>;
  stripe_checkout_session_id_ext?: Maybe<Scalars['ID']>;
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
  token?: Maybe<Scalars['String']>;
};

export type OrderItemFilter = {
  order_id?: Maybe<Scalars['ID']>;
  stripe_line_item_id_ext?: Maybe<Scalars['ID']>;
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
  name?: Maybe<Scalars['String']>;
  page_definition_id?: Maybe<Scalars['ID']>;
};

export type PageBlockFilter = {
  page_block_definition_id?: Maybe<Scalars['ID']>;
  page_id?: Maybe<Scalars['ID']>;
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
  name?: Maybe<Scalars['String']>;
  url_path?: Maybe<Scalars['String']>;
};

export type PageFilter = {
  agency_id?: Maybe<Scalars['ID']>;
  page_definition_id?: Maybe<Scalars['ID']>;
  product_id?: Maybe<Scalars['ID']>;
  url_path?: Maybe<Scalars['String']>;
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
  id_ext: Scalars['ID'];
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
  active?: Maybe<Scalars['Boolean']>;
  product_id?: Maybe<Scalars['ID']>;
  status?: Maybe<Scalars['String']>;
  stripe_price_id_ext_live?: Maybe<Scalars['String']>;
  stripe_price_id_ext_test?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
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
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<PageFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type ProductPricesArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<PriceFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type ProductFilter = {
  active?: Maybe<Scalars['Boolean']>;
  agency_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  url_name?: Maybe<Scalars['String']>;
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
  product_id?: Maybe<Scalars['ID']>;
};

export type ProductSettingsMutationResult = MutationResult & {
  __typename?: 'ProductSettingsMutationResult';
  message?: Maybe<Scalars['String']>;
  setting?: Maybe<ProductSettings>;
  success: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  agencies?: Maybe<Array<Agency>>;
  agencies_settings?: Maybe<Array<AgencySettings>>;
  agency?: Maybe<Agency>;
  agency_settings?: Maybe<AgencySettings>;
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
  price?: Maybe<Price>;
  prices?: Maybe<Array<Price>>;
  product?: Maybe<Product>;
  product_settings?: Maybe<ProductSettings>;
  products?: Maybe<Array<Product>>;
  products_settings?: Maybe<Array<ProductSettings>>;
  stripe_account?: Maybe<StripeAccount>;
  subdomain?: Maybe<Subdomain>;
  subdomains?: Maybe<Array<Subdomain>>;
  subscription_plan?: Maybe<SubscriptionPlan>;
  subscription_plans?: Maybe<Array<SubscriptionPlan>>;
  theme?: Maybe<Theme>;
  themes?: Maybe<Array<Theme>>;
  transaction_fee?: Maybe<TransactionFee>;
  transaction_fees?: Maybe<Array<TransactionFee>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryAgenciesArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: AgencyFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryAgencies_SettingsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: AgencySettingsFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryAgencyArgs = {
  id: Scalars['ID'];
};


export type QueryAgency_SettingsArgs = {
  id: Scalars['ID'];
};


export type QueryCount_AgenciesArgs = {
  filter: AgencyFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Agencies_SettingsArgs = {
  filter: AgencySettingsFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Credential_TypesArgs = {
  filter: CredentialTypeFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_CredentialsArgs = {
  filter: CredentialFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_CustomersArgs = {
  filter: CustomerFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Form_FieldsArgs = {
  filter: FormFieldFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_ImagesArgs = {
  filter: ImageFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Integration_ConfigsArgs = {
  filter: IntegrationConfigFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Integration_TypesArgs = {
  filter: IntegrationTypeFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_IntegrationsArgs = {
  filter: IntegrationFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_MembershipsArgs = {
  filter: MembershipFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Order_ItemsArgs = {
  filter: OrderItemFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_OrdersArgs = {
  filter: OrderFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Page_Block_DefinitionsArgs = {
  filter: PageBlockDefinitionFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Page_BlocksArgs = {
  filter: PageBlockFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Page_DefinitionsArgs = {
  filter: PageDefinitionFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_PagesArgs = {
  filter: PageFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_PricesArgs = {
  filter: PriceFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_ProductsArgs = {
  filter: ProductFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Products_SettingsArgs = {
  filter: ProductSettingsFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_SubdomainsArgs = {
  filter: SubdomainFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Subscription_PlansArgs = {
  filter: SubscriptionPlanFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_ThemesArgs = {
  filter: ThemeFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_Transaction_FeesArgs = {
  filter: TransactionFeeFilter;
  token?: Maybe<Scalars['String']>;
};


export type QueryCount_UsersArgs = {
  filter: UserFilter;
  token?: Maybe<Scalars['String']>;
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
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: CredentialTypeFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryCredentialsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: CredentialFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryCustomerArgs = {
  id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
};


export type QueryCustomersArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: CustomerFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryExchange_RateArgs = {
  currency: Scalars['String'];
};


export type QueryForm_FieldArgs = {
  id: Scalars['ID'];
};


export type QueryForm_FieldsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: FormFieldFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryImageArgs = {
  id: Scalars['ID'];
};


export type QueryImagesArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: ImageFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryIntegrationArgs = {
  id: Scalars['ID'];
};


export type QueryIntegration_ConfigArgs = {
  id: Scalars['ID'];
};


export type QueryIntegration_ConfigsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: IntegrationConfigFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryIntegration_TypeArgs = {
  id: Scalars['ID'];
};


export type QueryIntegration_TypesArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: IntegrationTypeFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryIntegrationsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: IntegrationFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
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
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: MarkdownFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryMembershipArgs = {
  id: Scalars['ID'];
};


export type QueryMembershipsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: MembershipFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
};


export type QueryOrder_ItemArgs = {
  id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
};


export type QueryOrder_ItemsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: OrderItemFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryOrdersArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: OrderFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
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
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: PageBlockDefinitionFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryPage_BlocksArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: PageBlockFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
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
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: PageDefinitionFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryPagesArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: PageFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryPriceArgs = {
  id: Scalars['ID'];
};


export type QueryPricesArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: PriceFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryProductArgs = {
  id: Scalars['ID'];
};


export type QueryProduct_SettingsArgs = {
  id: Scalars['ID'];
};


export type QueryProductsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: ProductFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryProducts_SettingsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: ProductSettingsFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryStripe_AccountArgs = {
  id: Scalars['ID'];
};


export type QuerySubdomainArgs = {
  id: Scalars['ID'];
};


export type QuerySubdomainsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: SubdomainFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QuerySubscription_PlanArgs = {
  id: Scalars['ID'];
};


export type QuerySubscription_PlansArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: SubscriptionPlanFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryThemeArgs = {
  id: Scalars['ID'];
};


export type QueryThemesArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: ThemeFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryTransaction_FeeArgs = {
  id: Scalars['ID'];
};


export type QueryTransaction_FeesArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: TransactionFeeFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter: UserFilter;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
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
  invoices: Array<Invoice>;
  livemode: Scalars['Boolean'];
  payment_intents: Array<PaymentIntent>;
  payouts_enabled: Scalars['Boolean'];
  requirements: StripeRequirements;
  settings: StripeSettings;
};


export type StripeAccountBalance_TransactionsArgs = {
  available_on?: Maybe<Scalars['DateTime']>;
  created?: Maybe<Scalars['DateTime']>;
  currency?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  payout_id?: Maybe<Scalars['ID']>;
  starting_after_id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};


export type StripeAccountBank_AccountsArgs = {
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  starting_after_id?: Maybe<Scalars['String']>;
};


export type StripeAccountCouponsArgs = {
  created?: Maybe<Scalars['DateTime']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  starting_after_id?: Maybe<Scalars['String']>;
};


export type StripeAccountCustomersArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<CustomerFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};


export type StripeAccountInvoicesArgs = {
  customer_id?: Maybe<Scalars['ID']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  starting_after_id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};


export type StripeAccountPayment_IntentsArgs = {
  created?: Maybe<Scalars['DateTime']>;
  customer_id?: Maybe<Scalars['ID']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  starting_after_id?: Maybe<Scalars['String']>;
};

export type StripeAccountLink = {
  __typename?: 'StripeAccountLink';
  created: Scalars['DateTime'];
  expires_at: Scalars['DateTime'];
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
  allow_promotion_codes?: Maybe<Scalars['Boolean']>;
  amount_subtotal?: Maybe<Scalars['Int']>;
  amount_total?: Maybe<Scalars['Int']>;
  billing_address_collection?: Maybe<Scalars['String']>;
  cancel_url?: Maybe<Scalars['String']>;
  client_reference_id?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  customer?: Maybe<StripeCustomer>;
  customer_email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  id_ext: Scalars['ID'];
  line_items: Array<LineItem>;
  livemode?: Maybe<Scalars['Boolean']>;
  locale?: Maybe<Scalars['String']>;
  mode?: Maybe<Scalars['String']>;
  payment_intent?: Maybe<PaymentIntent>;
  payment_method_types?: Maybe<Array<Maybe<Scalars['String']>>>;
  payment_status?: Maybe<Scalars['String']>;
  submit_type?: Maybe<Scalars['String']>;
  success_url?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};


export type StripeCheckoutSessionLine_ItemsArgs = {
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  starting_after_id?: Maybe<Scalars['String']>;
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
  id_ext: Scalars['ID'];
  invoice_prefix?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  next_invoice_sequence?: Maybe<Scalars['Int']>;
  phone?: Maybe<Scalars['String']>;
  preferred_locales?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type StripePrice = {
  __typename?: 'StripePrice';
  active: Scalars['Boolean'];
  billing_scheme: Scalars['String'];
  created?: Maybe<Scalars['DateTime']>;
  currency: Scalars['String'];
  id: Scalars['String'];
  id_ext: Scalars['String'];
  livemode: Scalars['Boolean'];
  lookup_key?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['String']>;
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

export type Subdomain = Node & {
  __typename?: 'Subdomain';
  agency: Agency;
  id: Scalars['ID'];
  memberships: Array<Membership>;
  name: Scalars['String'];
};


export type SubdomainMembershipsArgs = {
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<MembershipFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type SubdomainFilter = {
  name?: Maybe<Scalars['String']>;
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  calculate_fee: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  transaction_fees: Array<TransactionFee>;
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
  agency_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
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
  subscription_plan_id?: Maybe<Scalars['ID']>;
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
  after_id?: Maybe<Scalars['ID']>;
  before_id?: Maybe<Scalars['ID']>;
  desc?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<MembershipFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type UserFilter = {
  email_address?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Stripe_AccountFragment = { __typename?: 'StripeAccount', id: string, id_ext: string, business_type?: Maybe<string>, charges_enabled: boolean, country: string, created: any, default_currency?: Maybe<string>, details_submitted: boolean, email?: Maybe<string>, payouts_enabled: boolean, business_profile: { __typename?: 'BusinessProfile', mcc?: Maybe<string>, name?: Maybe<string>, product_description?: Maybe<string>, support_address?: Maybe<string>, support_email?: Maybe<string>, support_phone?: Maybe<string>, support_url?: Maybe<string>, url?: Maybe<string> }, capabilities: { __typename?: 'StripeCapabilities', card_payments?: Maybe<string>, transfers?: Maybe<string> }, requirements: { __typename?: 'StripeRequirements', current_deadline?: Maybe<string>, disabled_reason?: Maybe<string>, currently_due: Array<Maybe<string>>, eventually_due: Array<Maybe<string>>, past_due: Array<Maybe<string>>, pending_verification: Array<Maybe<string>> }, settings: { __typename?: 'StripeSettings', branding?: Maybe<{ __typename?: 'StripeBranding', icon?: Maybe<string>, logo?: Maybe<string>, primary_color?: Maybe<string>, secondary_color?: Maybe<string> }> } };

export type AddressFragment = { __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> };

export type UserFragment = { __typename?: 'User', id: string, name: string, email_address: string };

export type MarkdownFragment = { __typename?: 'Markdown', id: string, name: string, data: string };

export type ImageFragment = { __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel };

export type ThemeFragment = { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> };

export type PriceFragment = { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> };

export type Balance_TransactionFragment = { __typename?: 'BalanceTransaction', id: string, id_ext: string, amount: number, available_on: any, created: any, exchange_rate?: Maybe<number>, currency: string, description?: Maybe<string>, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Maybe<Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: Maybe<string>, currency: string, description?: Maybe<string>, type: string }>> };

export type Stripe_CustomerFragment = { __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> };

export type CouponFragment = { __typename?: 'Coupon', id: string, id_ext: string, amount_off?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, duration?: Maybe<string>, duration_in_months?: Maybe<number>, livemode?: Maybe<boolean>, max_redemptions?: Maybe<number>, name?: Maybe<string>, percent_off?: Maybe<number>, redeem_by?: Maybe<any>, times_redeemed?: Maybe<number>, valid?: Maybe<boolean>, applies_to?: Maybe<{ __typename?: 'CouponAppliesTo', products?: Maybe<Array<string>> }> };

export type ChargeFragment = { __typename?: 'Charge', id: string, id_ext: string, amount: number, amount_capturable?: Maybe<number>, amount_received?: Maybe<number>, application_fee_amount?: Maybe<number>, authorization_code?: Maybe<string>, calculated_statement_descriptor?: Maybe<string>, captured?: Maybe<boolean>, created?: Maybe<any>, currency?: Maybe<string>, description?: Maybe<string>, disputed?: Maybe<boolean>, failure_code?: Maybe<string>, failure_message?: Maybe<string>, invoice?: Maybe<string>, order?: Maybe<string>, paid?: Maybe<boolean>, payment_method?: Maybe<string>, receipt_email?: Maybe<string>, receipt_number?: Maybe<string>, receipt_url?: Maybe<string>, refunded?: Maybe<boolean>, source_transfer?: Maybe<string>, statement_descriptor?: Maybe<string>, statement_descriptor_suffix?: Maybe<string>, status?: Maybe<string>, transfer?: Maybe<string>, transfer_group?: Maybe<string>, balance_transaction?: Maybe<{ __typename?: 'BalanceTransaction', id: string, id_ext: string, amount: number, available_on: any, created: any, exchange_rate?: Maybe<number>, currency: string, description?: Maybe<string>, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Maybe<Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: Maybe<string>, currency: string, description?: Maybe<string>, type: string }>> }>, billing_details?: Maybe<{ __typename?: 'BillingDetails', email?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, fraud_details?: Maybe<{ __typename?: 'FraudDetails', stripe_report?: Maybe<string>, user_report?: Maybe<string> }>, outcome?: Maybe<{ __typename?: 'Outcome', network_status?: Maybe<string>, reason?: Maybe<string>, risk_level?: Maybe<string>, risk_score?: Maybe<number>, seller_message?: Maybe<string>, type?: Maybe<string>, rule?: Maybe<{ __typename?: 'OutcomeRule', action?: Maybe<string>, id?: Maybe<string>, predicate?: Maybe<string> }> }>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }> };

export type Payment_IntentFragment = { __typename?: 'PaymentIntent', id: string, id_ext: string, amount: number, amount_capturable?: Maybe<number>, amount_received?: Maybe<number>, application_fee_amount?: Maybe<number>, canceled_at?: Maybe<any>, cancellation_reason?: Maybe<string>, capture_method?: Maybe<string>, confirmation_method?: Maybe<string>, created?: Maybe<any>, currency?: Maybe<string>, description?: Maybe<string>, invoice?: Maybe<string>, on_behalf_of?: Maybe<string>, payment_method?: Maybe<string>, payment_method_types?: Maybe<Array<Maybe<string>>>, receipt_email?: Maybe<string>, setup_future_usage?: Maybe<string>, statement_descriptor?: Maybe<string>, statement_descriptor_suffix?: Maybe<string>, status?: Maybe<string>, transfer_group?: Maybe<string>, charges?: Maybe<Array<Maybe<{ __typename?: 'Charge', id: string, id_ext: string, amount: number, amount_capturable?: Maybe<number>, amount_received?: Maybe<number>, application_fee_amount?: Maybe<number>, authorization_code?: Maybe<string>, calculated_statement_descriptor?: Maybe<string>, captured?: Maybe<boolean>, created?: Maybe<any>, currency?: Maybe<string>, description?: Maybe<string>, disputed?: Maybe<boolean>, failure_code?: Maybe<string>, failure_message?: Maybe<string>, invoice?: Maybe<string>, order?: Maybe<string>, paid?: Maybe<boolean>, payment_method?: Maybe<string>, receipt_email?: Maybe<string>, receipt_number?: Maybe<string>, receipt_url?: Maybe<string>, refunded?: Maybe<boolean>, source_transfer?: Maybe<string>, statement_descriptor?: Maybe<string>, statement_descriptor_suffix?: Maybe<string>, status?: Maybe<string>, transfer?: Maybe<string>, transfer_group?: Maybe<string>, balance_transaction?: Maybe<{ __typename?: 'BalanceTransaction', id: string, id_ext: string, amount: number, available_on: any, created: any, exchange_rate?: Maybe<number>, currency: string, description?: Maybe<string>, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Maybe<Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: Maybe<string>, currency: string, description?: Maybe<string>, type: string }>> }>, billing_details?: Maybe<{ __typename?: 'BillingDetails', email?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, fraud_details?: Maybe<{ __typename?: 'FraudDetails', stripe_report?: Maybe<string>, user_report?: Maybe<string> }>, outcome?: Maybe<{ __typename?: 'Outcome', network_status?: Maybe<string>, reason?: Maybe<string>, risk_level?: Maybe<string>, risk_score?: Maybe<number>, seller_message?: Maybe<string>, type?: Maybe<string>, rule?: Maybe<{ __typename?: 'OutcomeRule', action?: Maybe<string>, id?: Maybe<string>, predicate?: Maybe<string> }> }>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }> }>>>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, shipping?: Maybe<{ __typename?: 'Shipping', carrier?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, tracking_number?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }> };

export type ProductFragment = { __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> };

export type Product_SettingsFragment = { __typename?: 'ProductSettings', id: string, checkout_success_url?: Maybe<string>, checkout_cancel_url?: Maybe<string> };

export type MembershipFragment = { __typename?: 'Membership', id: string, access: AccessLevel, user: { __typename?: 'User', id: string, name: string, email_address: string }, subdomain: { __typename?: 'Subdomain', id: string, agency: { __typename?: 'Agency', id: string } } };

export type Transaction_FeeFragment = { __typename?: 'TransactionFee', id: string, percentage: number, fixed_amount: number, currency: string, transaction_amount_upper_bound: number, data: any, subscription_plan: { __typename?: 'SubscriptionPlan', id: string } };

export type Subscription_PlanFragment = { __typename?: 'SubscriptionPlan', id: string, name: string, transaction_fees: Array<{ __typename?: 'TransactionFee', id: string, percentage: number, fixed_amount: number, currency: string, transaction_amount_upper_bound: number, data: any, subscription_plan: { __typename?: 'SubscriptionPlan', id: string } }> };

export type AgencyFragment = { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: Maybe<string>, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } };

export type Agency_SettingsFragment = { __typename?: 'AgencySettings', id: string, checkout_success_url?: Maybe<string>, checkout_cancel_url?: Maybe<string> };

export type CustomerFragment = { __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, user?: Maybe<{ __typename?: 'User', id: string, name: string, email_address: string }> };

export type SubdomainFragment = { __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: Maybe<string>, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } }, memberships: Array<{ __typename?: 'Membership', id: string, access: AccessLevel, user: { __typename?: 'User', id: string, name: string, email_address: string }, subdomain: { __typename?: 'Subdomain', id: string, agency: { __typename?: 'Agency', id: string } } }> };

export type Form_FieldFragment = { __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> };

export type Credential_TypeFragment = { __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> };

export type CredentialFragment = { __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> } };

export type IntegrationFragment = { __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, product?: Maybe<{ __typename?: 'Product', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: Maybe<{ __typename?: 'IntegrationConfig', id: string }> };

export type Integration_ConfigFragment = { __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string } };

export type Integration_TypeFragment = { __typename?: 'IntegrationType', id: string, name: string, title: string, status: string, automatic_order_management: boolean, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>>, config_fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>>, credential_type?: Maybe<{ __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> }> };

export type Page_DefinitionFragment = { __typename?: 'PageDefinition', id: string, name: string, url_path: string };

export type Page_Block_DefinitionFragment = { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> };

export type PageFragment = { __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: Maybe<{ __typename?: 'Product', id: string }>, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> };

export type Page_BlockFragment = { __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } };

export type Line_ItemFragment = { __typename?: 'LineItem', id: string, amount_subtotal: number, amount_total: number, currency: string, description: string, quantity?: Maybe<number>, price?: Maybe<{ __typename?: 'StripePrice', id: string, id_ext: string, active: boolean, billing_scheme: string, created?: Maybe<any>, currency: string, livemode: boolean, lookup_key?: Maybe<string>, nickname?: Maybe<string>, product?: Maybe<string>, tax_behavior?: Maybe<string>, tiers_mode?: Maybe<string>, type: string, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, recurring?: Maybe<{ __typename?: 'StripePriceRecurring', aggregate_usage?: Maybe<string>, interval: string, interval_count: number, trial_period_days?: Maybe<number>, usage_type?: Maybe<string> }>, tiers?: Maybe<Array<{ __typename?: 'StripePriceTier', flat_amount?: Maybe<number>, flat_amount_decimal?: Maybe<string>, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, up_to?: Maybe<number> }>>, transform_quantity?: Maybe<{ __typename?: 'StripePriceTransformQuantity', divide_by?: Maybe<number>, round?: Maybe<string> }> }> };

export type Stripe_PriceFragment = { __typename?: 'StripePrice', id: string, id_ext: string, active: boolean, billing_scheme: string, created?: Maybe<any>, currency: string, livemode: boolean, lookup_key?: Maybe<string>, nickname?: Maybe<string>, product?: Maybe<string>, tax_behavior?: Maybe<string>, tiers_mode?: Maybe<string>, type: string, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, recurring?: Maybe<{ __typename?: 'StripePriceRecurring', aggregate_usage?: Maybe<string>, interval: string, interval_count: number, trial_period_days?: Maybe<number>, usage_type?: Maybe<string> }>, tiers?: Maybe<Array<{ __typename?: 'StripePriceTier', flat_amount?: Maybe<number>, flat_amount_decimal?: Maybe<string>, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, up_to?: Maybe<number> }>>, transform_quantity?: Maybe<{ __typename?: 'StripePriceTransformQuantity', divide_by?: Maybe<number>, round?: Maybe<string> }> };

export type Stripe_Checkout_SessionFragment = { __typename?: 'StripeCheckoutSession', id: string, id_ext: string, allow_promotion_codes?: Maybe<boolean>, amount_subtotal?: Maybe<number>, amount_total?: Maybe<number>, billing_address_collection?: Maybe<string>, cancel_url?: Maybe<string>, client_reference_id?: Maybe<string>, currency?: Maybe<string>, customer_email?: Maybe<string>, livemode?: Maybe<boolean>, locale?: Maybe<string>, mode?: Maybe<string>, payment_method_types?: Maybe<Array<Maybe<string>>>, payment_status?: Maybe<string>, submit_type?: Maybe<string>, success_url?: Maybe<string>, url?: Maybe<string>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, line_items: Array<{ __typename?: 'LineItem', id: string, amount_subtotal: number, amount_total: number, currency: string, description: string, quantity?: Maybe<number>, price?: Maybe<{ __typename?: 'StripePrice', id: string, id_ext: string, active: boolean, billing_scheme: string, created?: Maybe<any>, currency: string, livemode: boolean, lookup_key?: Maybe<string>, nickname?: Maybe<string>, product?: Maybe<string>, tax_behavior?: Maybe<string>, tiers_mode?: Maybe<string>, type: string, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, recurring?: Maybe<{ __typename?: 'StripePriceRecurring', aggregate_usage?: Maybe<string>, interval: string, interval_count: number, trial_period_days?: Maybe<number>, usage_type?: Maybe<string> }>, tiers?: Maybe<Array<{ __typename?: 'StripePriceTier', flat_amount?: Maybe<number>, flat_amount_decimal?: Maybe<string>, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, up_to?: Maybe<number> }>>, transform_quantity?: Maybe<{ __typename?: 'StripePriceTransformQuantity', divide_by?: Maybe<number>, round?: Maybe<string> }> }> }> };

export type DiscountFragment = { __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> };

export type InvoiceFragment = { __typename?: 'Invoice', id: string, id_ext: string, account_country?: Maybe<string>, account_name?: Maybe<string>, account_tax_ids: Array<string>, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount: number, attempt_count: number, attempted: boolean, auto_advance?: Maybe<boolean>, billing_reason?: Maybe<string>, collection_method?: Maybe<string>, created: any, currency: string, customer_email?: Maybe<string>, customer_name?: Maybe<string>, customer_phone?: Maybe<string>, customer_tax_exempt?: Maybe<string>, default_payment_method?: Maybe<string>, description?: Maybe<string>, due_date?: Maybe<any>, ending_balance: number, footer?: Maybe<string>, hosted_invoice_url?: Maybe<string>, invoice_pdf?: Maybe<string>, livemode: boolean, next_payment_attempt?: Maybe<any>, number?: Maybe<string>, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: Maybe<string>, starting_balance: number, statement_descriptor?: Maybe<string>, status?: Maybe<string>, subscription_proration_date?: Maybe<any>, subtotal: number, tax: number, total: number, webhooks_delivered_at: any, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: Maybe<string> }, charge?: Maybe<{ __typename?: 'Charge', id: string }>, custom_fields?: Maybe<Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }>>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, customer_address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer_shipping?: Maybe<{ __typename?: 'InvoiceCustomerShipping', carrier?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, tracking_number?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer_tax_ids?: Maybe<Array<{ __typename?: 'CustomerTaxId', type?: Maybe<string>, value?: Maybe<string> }>>, discount?: Maybe<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }>, status_transitions?: Maybe<{ __typename?: 'InvoiceStatusTransitions', finalized_at?: Maybe<any>, marked_uncollectible_at?: Maybe<any>, paid_at?: Maybe<any>, voided_at?: Maybe<any> }> };

export type Invoice_Line_ItemFragment = { __typename?: 'InvoiceLineItem', id: string, id_ext: string, amount: number, currency: string, description?: Maybe<string>, discountable: boolean, invoice_item?: Maybe<string>, livemode: boolean, proration: boolean, quantity?: Maybe<number>, subscription?: Maybe<string>, subscription_item?: Maybe<string>, type: string, discount_amounts?: Maybe<Array<{ __typename?: 'InvoiceLineItemDiscountAmount', amount?: Maybe<number>, discount?: Maybe<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }> }>>, price?: Maybe<{ __typename?: 'StripePrice', id: string }> };

export type InvoiceitemFragment = { __typename?: 'InvoiceItem', id: string, id_ext: string, amount: number, currency: string, date: any, description?: Maybe<string>, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string }>>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }>, price?: Maybe<{ __typename?: 'StripePrice', id: string }> };

export type Order_ItemFragment = { __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: Maybe<string>, processed_at?: Maybe<any>, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number>, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> } } };

export type OrderFragment = { __typename?: 'Order', id: string, state: string, error?: Maybe<string>, ordered_at: any, processed_at?: Maybe<any> };

export type Bank_AccountFragment = { __typename?: 'BankAccount', id: string, id_ext: string, account_holder_name?: Maybe<string>, account_holder_type?: Maybe<string>, available_payout_methods?: Maybe<Array<string>>, bank_name?: Maybe<string>, country: string, currency: string, default_for_currency?: Maybe<boolean>, fingerprint?: Maybe<string>, last4: string, routing_number?: Maybe<string>, status: string };

export type BeginVisitMutationVariables = Exact<{ [key: string]: never; }>;


export type BeginVisitMutation = { __typename?: 'Mutation', begin_visit: { __typename?: 'BeginVisitResult', success: boolean, message?: Maybe<string>, jwt?: Maybe<string> } };

export type EndVisitMutationVariables = Exact<{ [key: string]: never; }>;


export type EndVisitMutation = { __typename?: 'Mutation', end_visit: { __typename?: 'SimpleResult', success: boolean, message?: Maybe<string> } };

export type LogInMutationVariables = Exact<{
  email_address: Scalars['String'];
  password: Scalars['String'];
  recaptcha_token?: Maybe<Scalars['String']>;
}>;


export type LogInMutation = { __typename?: 'Mutation', log_in: { __typename?: 'LogInResult', success: boolean, message?: Maybe<string>, jwt?: Maybe<string> } };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename?: 'Mutation', log_out: { __typename?: 'SimpleResult', success: boolean, message?: Maybe<string> } };

export type VerifyPasswordResetMutationVariables = Exact<{
  verification_code: Scalars['String'];
  password: Scalars['String'];
}>;


export type VerifyPasswordResetMutation = { __typename?: 'Mutation', verify_password_reset: { __typename?: 'SimpleResult', success: boolean, message?: Maybe<string> } };

export type VerifySignUpMutationVariables = Exact<{
  verification_code: Scalars['String'];
}>;


export type VerifySignUpMutation = { __typename?: 'Mutation', verify_sign_up: { __typename?: 'SimpleResult', success: boolean, message?: Maybe<string> } };

export type StartPasswordResetMutationVariables = Exact<{
  email_address: Scalars['String'];
  redirect_url?: Maybe<Scalars['String']>;
}>;


export type StartPasswordResetMutation = { __typename?: 'Mutation', start_password_reset: { __typename?: 'SimpleResult', success: boolean, message?: Maybe<string> } };

export type StartSignUpMutationVariables = Exact<{
  email_address: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  redirect_url?: Maybe<Scalars['String']>;
  recaptcha_token?: Maybe<Scalars['String']>;
}>;


export type StartSignUpMutation = { __typename?: 'Mutation', start_sign_up: { __typename?: 'SimpleResult', success: boolean, message?: Maybe<string> } };

export type CreateAgencyMutationVariables = Exact<{
  name: Scalars['String'];
  livemode: Scalars['Boolean'];
  subdomain_name: Scalars['String'];
  country_code: Scalars['String'];
  image_logo: ImageInput;
  return_url: Scalars['String'];
}>;


export type CreateAgencyMutation = { __typename?: 'Mutation', create_agency: { __typename?: 'CreateAgencyResult', stripe_verification_url?: Maybe<string>, message?: Maybe<string>, success: boolean, agency?: Maybe<{ __typename?: 'Agency', id: string, name: string, subdomain: { __typename?: 'Subdomain', id: string, name: string } }> } };

export type UpdateAgencyMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  default_pricing_currency?: Maybe<Scalars['String']>;
}>;


export type UpdateAgencyMutation = { __typename?: 'Mutation', update_agency: { __typename?: 'AgencyMutationResult', message?: Maybe<string>, success: boolean, agency?: Maybe<{ __typename?: 'Agency', id: string, name: string, default_pricing_currency?: Maybe<string> }> } };

export type UpdateThemeMutationVariables = Exact<{
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
}>;


export type UpdateThemeMutation = { __typename?: 'Mutation', update_theme: { __typename?: 'UpdateThemeResult', message?: Maybe<string>, success: boolean, theme?: Maybe<{ __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> }> } };

export type CreateImageMutationVariables = Exact<{
  agency_id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['String'];
  color: Scalars['String'];
  access?: Maybe<AccessLevel>;
}>;


export type CreateImageMutation = { __typename?: 'Mutation', create_image: { __typename?: 'ImageMutationResult', success: boolean, message?: Maybe<string>, image?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } };

export type UpdateImageMutationVariables = Exact<{
  image_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  access?: Maybe<AccessLevel>;
}>;


export type UpdateImageMutation = { __typename?: 'Mutation', update_image: { __typename?: 'ImageMutationResult', success: boolean, message?: Maybe<string>, image?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } };

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


export type CreateProductMutation = { __typename?: 'Mutation', create_product: { __typename?: 'ProductMutationResult', success: boolean, message?: Maybe<string>, product?: Maybe<{ __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> }> } };

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


export type UpdateProductMutation = { __typename?: 'Mutation', update_product: { __typename?: 'ProductMutationResult', success: boolean, message?: Maybe<string>, product?: Maybe<{ __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> }> } };

export type DeleteProductMutationVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', delete_product: { __typename?: 'ProductMutationResult', success: boolean, message?: Maybe<string>, product?: Maybe<{ __typename?: 'Product', id: string }> } };

export type CreatePriceMutationVariables = Exact<{
  product_id: Scalars['ID'];
  unit_amount: Scalars['Int'];
  currency: Scalars['String'];
  recurring_interval?: Maybe<Scalars['String']>;
  recurring_interval_count?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
}>;


export type CreatePriceMutation = { __typename?: 'Mutation', create_price: { __typename?: 'PriceMutationResult', success: boolean, message?: Maybe<string>, price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }> } };

export type CreateCouponMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  amount_off?: Maybe<Scalars['Int']>;
  currency?: Maybe<Scalars['String']>;
  percent_off?: Maybe<Scalars['Int']>;
  duration?: Maybe<Scalars['String']>;
  duration_in_months?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  applies_to?: Maybe<CouponAppliesToInput>;
  max_redemptions?: Maybe<Scalars['Int']>;
  redeem_by?: Maybe<Scalars['Int']>;
}>;


export type CreateCouponMutation = { __typename?: 'Mutation', create_coupon: { __typename?: 'CouponMutationResult', success: boolean, message?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string, id_ext: string, amount_off?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, duration?: Maybe<string>, duration_in_months?: Maybe<number>, livemode?: Maybe<boolean>, max_redemptions?: Maybe<number>, name?: Maybe<string>, percent_off?: Maybe<number>, redeem_by?: Maybe<any>, times_redeemed?: Maybe<number>, valid?: Maybe<boolean>, applies_to?: Maybe<{ __typename?: 'CouponAppliesTo', products?: Maybe<Array<string>> }> }> } };

export type UpdateCouponMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  coupon_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
}>;


export type UpdateCouponMutation = { __typename?: 'Mutation', update_coupon: { __typename?: 'CouponMutationResult', success: boolean, message?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string, id_ext: string, amount_off?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, duration?: Maybe<string>, duration_in_months?: Maybe<number>, livemode?: Maybe<boolean>, max_redemptions?: Maybe<number>, name?: Maybe<string>, percent_off?: Maybe<number>, redeem_by?: Maybe<any>, times_redeemed?: Maybe<number>, valid?: Maybe<boolean>, applies_to?: Maybe<{ __typename?: 'CouponAppliesTo', products?: Maybe<Array<string>> }> }> } };

export type DeleteCouponMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  coupon_id: Scalars['ID'];
}>;


export type DeleteCouponMutation = { __typename?: 'Mutation', delete_coupon: { __typename?: 'CouponMutationResult', success: boolean, message?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }> } };

export type CreateInvoiceMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  customer: Scalars['ID'];
  auto_advance?: Maybe<Scalars['Boolean']>;
  collection_method?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  footer?: Maybe<Scalars['String']>;
  subscription?: Maybe<Scalars['ID']>;
  days_until_due?: Maybe<Scalars['Int']>;
  default_payment_method?: Maybe<Scalars['ID']>;
  default_source?: Maybe<Scalars['ID']>;
  due_date?: Maybe<Scalars['Int']>;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', create_invoice: { __typename?: 'InvoiceMutationResult', success: boolean, message?: Maybe<string>, invoice?: Maybe<{ __typename?: 'Invoice', id: string, id_ext: string, account_country?: Maybe<string>, account_name?: Maybe<string>, account_tax_ids: Array<string>, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount: number, attempt_count: number, attempted: boolean, auto_advance?: Maybe<boolean>, billing_reason?: Maybe<string>, collection_method?: Maybe<string>, created: any, currency: string, customer_email?: Maybe<string>, customer_name?: Maybe<string>, customer_phone?: Maybe<string>, customer_tax_exempt?: Maybe<string>, default_payment_method?: Maybe<string>, description?: Maybe<string>, due_date?: Maybe<any>, ending_balance: number, footer?: Maybe<string>, hosted_invoice_url?: Maybe<string>, invoice_pdf?: Maybe<string>, livemode: boolean, next_payment_attempt?: Maybe<any>, number?: Maybe<string>, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: Maybe<string>, starting_balance: number, statement_descriptor?: Maybe<string>, status?: Maybe<string>, subscription_proration_date?: Maybe<any>, subtotal: number, tax: number, total: number, webhooks_delivered_at: any, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: Maybe<string> }, charge?: Maybe<{ __typename?: 'Charge', id: string }>, custom_fields?: Maybe<Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }>>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, customer_address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer_shipping?: Maybe<{ __typename?: 'InvoiceCustomerShipping', carrier?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, tracking_number?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer_tax_ids?: Maybe<Array<{ __typename?: 'CustomerTaxId', type?: Maybe<string>, value?: Maybe<string> }>>, discount?: Maybe<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }>, status_transitions?: Maybe<{ __typename?: 'InvoiceStatusTransitions', finalized_at?: Maybe<any>, marked_uncollectible_at?: Maybe<any>, paid_at?: Maybe<any>, voided_at?: Maybe<any> }> }> } };

export type UpdateInvoiceMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
  auto_advance?: Maybe<Scalars['Boolean']>;
  collection_method?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  footer?: Maybe<Scalars['String']>;
  subscription?: Maybe<Scalars['ID']>;
  days_until_due?: Maybe<Scalars['Int']>;
  default_payment_method?: Maybe<Scalars['ID']>;
  default_source?: Maybe<Scalars['ID']>;
  due_date?: Maybe<Scalars['Int']>;
}>;


export type UpdateInvoiceMutation = { __typename?: 'Mutation', update_invoice: { __typename?: 'InvoiceMutationResult', success: boolean, message?: Maybe<string>, invoice?: Maybe<{ __typename?: 'Invoice', id: string, id_ext: string, account_country?: Maybe<string>, account_name?: Maybe<string>, account_tax_ids: Array<string>, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount: number, attempt_count: number, attempted: boolean, auto_advance?: Maybe<boolean>, billing_reason?: Maybe<string>, collection_method?: Maybe<string>, created: any, currency: string, customer_email?: Maybe<string>, customer_name?: Maybe<string>, customer_phone?: Maybe<string>, customer_tax_exempt?: Maybe<string>, default_payment_method?: Maybe<string>, description?: Maybe<string>, due_date?: Maybe<any>, ending_balance: number, footer?: Maybe<string>, hosted_invoice_url?: Maybe<string>, invoice_pdf?: Maybe<string>, livemode: boolean, next_payment_attempt?: Maybe<any>, number?: Maybe<string>, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: Maybe<string>, starting_balance: number, statement_descriptor?: Maybe<string>, status?: Maybe<string>, subscription_proration_date?: Maybe<any>, subtotal: number, tax: number, total: number, webhooks_delivered_at: any, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: Maybe<string> }, charge?: Maybe<{ __typename?: 'Charge', id: string }>, custom_fields?: Maybe<Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }>>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, customer_address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer_shipping?: Maybe<{ __typename?: 'InvoiceCustomerShipping', carrier?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, tracking_number?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer_tax_ids?: Maybe<Array<{ __typename?: 'CustomerTaxId', type?: Maybe<string>, value?: Maybe<string> }>>, discount?: Maybe<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }>, status_transitions?: Maybe<{ __typename?: 'InvoiceStatusTransitions', finalized_at?: Maybe<any>, marked_uncollectible_at?: Maybe<any>, paid_at?: Maybe<any>, voided_at?: Maybe<any> }> }> } };

export type DeleteInvoiceMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
}>;


export type DeleteInvoiceMutation = { __typename?: 'Mutation', delete_invoice: { __typename?: 'InvoiceMutationResult', success: boolean, message?: Maybe<string>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> } };

export type CreateInvoiceItemMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  customer: Scalars['ID'];
  invoice?: Maybe<Scalars['ID']>;
  amount?: Maybe<Scalars['Int']>;
  currency?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  period?: Maybe<PeriodInput>;
  price?: Maybe<Scalars['ID']>;
  discountable?: Maybe<Scalars['Boolean']>;
  quantity?: Maybe<Scalars['Int']>;
  unit_amount?: Maybe<Scalars['Int']>;
  unit_amount_decimal?: Maybe<Scalars['String']>;
}>;


export type CreateInvoiceItemMutation = { __typename?: 'Mutation', create_invoiceitem: { __typename?: 'InvoiceItemMutationResult', success: boolean, message?: Maybe<string>, invoiceitem?: Maybe<{ __typename?: 'InvoiceItem', id: string, id_ext: string, amount: number, currency: string, date: any, description?: Maybe<string>, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string }>>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }>, price?: Maybe<{ __typename?: 'StripePrice', id: string }> }> } };

export type UpdateInvoiceItemMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoiceitem_id: Scalars['ID'];
  amount?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  period?: Maybe<PeriodInput>;
  price?: Maybe<Scalars['ID']>;
  discountable?: Maybe<Scalars['Boolean']>;
  quantity?: Maybe<Scalars['Int']>;
  unit_amount?: Maybe<Scalars['Int']>;
  unit_amount_decimal?: Maybe<Scalars['String']>;
}>;


export type UpdateInvoiceItemMutation = { __typename?: 'Mutation', update_invoiceitem: { __typename?: 'InvoiceItemMutationResult', success: boolean, message?: Maybe<string>, invoiceitem?: Maybe<{ __typename?: 'InvoiceItem', id: string, id_ext: string, amount: number, currency: string, date: any, description?: Maybe<string>, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string }>>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }>, price?: Maybe<{ __typename?: 'StripePrice', id: string }> }> } };

export type DeleteInvoiceItemMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoiceitem_id: Scalars['ID'];
}>;


export type DeleteInvoiceItemMutation = { __typename?: 'Mutation', delete_invoiceitem: { __typename?: 'InvoiceItemMutationResult', success: boolean, message?: Maybe<string>, invoiceitem?: Maybe<{ __typename?: 'InvoiceItem', id: string }> } };

export type CreateCustomerMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  email_address: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', create_customer: { __typename?: 'CustomerMutationResult', success: boolean, message?: Maybe<string>, customer?: Maybe<{ __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, user?: Maybe<{ __typename?: 'User', id: string, name: string, email_address: string }> }> } };

export type UpdateCustomerMutationVariables = Exact<{
  customer_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  email_address?: Maybe<Scalars['String']>;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', update_customer: { __typename?: 'CustomerMutationResult', success: boolean, message?: Maybe<string>, customer?: Maybe<{ __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, user?: Maybe<{ __typename?: 'User', id: string, name: string, email_address: string }> }> } };

export type DeleteCustomerMutationVariables = Exact<{
  customer_id: Scalars['ID'];
}>;


export type DeleteCustomerMutation = { __typename?: 'Mutation', delete_customer: { __typename?: 'CustomerMutationResult', success: boolean, message?: Maybe<string>, customer?: Maybe<{ __typename?: 'Customer', id: string }> } };

export type CreateBankAccountMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  country: Scalars['String'];
  currency: Scalars['String'];
  account_number: Scalars['String'];
  account_holder_name?: Maybe<Scalars['String']>;
  account_holder_type?: Maybe<Scalars['String']>;
  routing_number?: Maybe<Scalars['String']>;
  default_for_currency?: Maybe<Scalars['Boolean']>;
}>;


export type CreateBankAccountMutation = { __typename?: 'Mutation', create_bank_account: { __typename?: 'BankAccountMutationResult', success: boolean, message?: Maybe<string>, bank_account?: Maybe<{ __typename?: 'BankAccount', id: string, id_ext: string, account_holder_name?: Maybe<string>, account_holder_type?: Maybe<string>, available_payout_methods?: Maybe<Array<string>>, bank_name?: Maybe<string>, country: string, currency: string, default_for_currency?: Maybe<boolean>, fingerprint?: Maybe<string>, last4: string, routing_number?: Maybe<string>, status: string }> } };

export type UpdateBankAccountMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  bank_account_id: Scalars['ID'];
  account_holder_name?: Maybe<Scalars['String']>;
  account_holder_type?: Maybe<Scalars['String']>;
  default_for_currency?: Maybe<Scalars['Boolean']>;
}>;


export type UpdateBankAccountMutation = { __typename?: 'Mutation', update_bank_account: { __typename?: 'BankAccountMutationResult', success: boolean, message?: Maybe<string>, bank_account?: Maybe<{ __typename?: 'BankAccount', id: string, id_ext: string, account_holder_name?: Maybe<string>, account_holder_type?: Maybe<string>, available_payout_methods?: Maybe<Array<string>>, bank_name?: Maybe<string>, country: string, currency: string, default_for_currency?: Maybe<boolean>, fingerprint?: Maybe<string>, last4: string, routing_number?: Maybe<string>, status: string }> } };

export type DeleteBankAccountMutationVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  bank_account_id: Scalars['ID'];
}>;


export type DeleteBankAccountMutation = { __typename?: 'Mutation', delete_bank_account: { __typename?: 'BankAccountMutationResult', success: boolean, message?: Maybe<string>, bank_account?: Maybe<{ __typename?: 'BankAccount', id: string }> } };

export type UpdateAgencySettingsMutationVariables = Exact<{
  setting_id: Scalars['ID'];
  checkout_success_url?: Maybe<Scalars['String']>;
  checkout_cancel_url?: Maybe<Scalars['String']>;
}>;


export type UpdateAgencySettingsMutation = { __typename?: 'Mutation', update_agency_settings: { __typename?: 'AgencySettingsMutationResult', success: boolean, message?: Maybe<string>, setting?: Maybe<{ __typename?: 'AgencySettings', id: string, checkout_success_url?: Maybe<string>, checkout_cancel_url?: Maybe<string> }> } };

export type UpdateProductSettingsMutationVariables = Exact<{
  setting_id: Scalars['ID'];
  checkout_success_url?: Maybe<Scalars['String']>;
  checkout_cancel_url?: Maybe<Scalars['String']>;
}>;


export type UpdateProductSettingsMutation = { __typename?: 'Mutation', update_product_settings: { __typename?: 'ProductSettingsMutationResult', success: boolean, message?: Maybe<string>, setting?: Maybe<{ __typename?: 'ProductSettings', id: string, checkout_success_url?: Maybe<string>, checkout_cancel_url?: Maybe<string> }> } };

export type UpdatePageMutationVariables = Exact<{
  page_id: Scalars['ID'];
  access?: Maybe<AccessLevel>;
}>;


export type UpdatePageMutation = { __typename?: 'Mutation', update_page: { __typename?: 'PageMutationResult', success: boolean, message?: Maybe<string>, page?: Maybe<{ __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: Maybe<{ __typename?: 'Product', id: string }>, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> }> } };

export type CreatePageBlockMutationVariables = Exact<{
  page_id: Scalars['ID'];
  page_block_definition_id: Scalars['ID'];
  data: Scalars['Json'];
  after_id?: Maybe<Scalars['ID']>;
}>;


export type CreatePageBlockMutation = { __typename?: 'Mutation', create_page_block: { __typename?: 'PageBlockMutationResult', success: boolean, message?: Maybe<string>, page_block?: Maybe<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> } };

export type UpdatePageBlockMutationVariables = Exact<{
  page_block_id: Scalars['ID'];
  data: Scalars['Json'];
  after_id?: Maybe<Scalars['ID']>;
}>;


export type UpdatePageBlockMutation = { __typename?: 'Mutation', update_page_block: { __typename?: 'PageBlockMutationResult', success: boolean, message?: Maybe<string>, page_block?: Maybe<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> } };

export type DeletePageBlockMutationVariables = Exact<{
  page_block_id: Scalars['ID'];
}>;


export type DeletePageBlockMutation = { __typename?: 'Mutation', delete_page_block: { __typename?: 'PageBlockMutationResult', success: boolean, message?: Maybe<string>, page_block?: Maybe<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> } };

export type CreateCredentialMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  credential_type_id: Scalars['ID'];
  data: Scalars['Json'];
  name: Scalars['String'];
}>;


export type CreateCredentialMutation = { __typename?: 'Mutation', create_credential: { __typename?: 'CredentialMutationResult', success: boolean, message?: Maybe<string>, credential?: Maybe<{ __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> } }> } };

export type UpdateCredentialMutationVariables = Exact<{
  credential_id: Scalars['ID'];
  data: Scalars['Json'];
}>;


export type UpdateCredentialMutation = { __typename?: 'Mutation', update_credential: { __typename?: 'CredentialMutationResult', success: boolean, message?: Maybe<string>, credential?: Maybe<{ __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> } }> } };

export type CreateIntegrationMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  integration_type_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  product_id?: Maybe<Scalars['ID']>;
  integration_config_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type CreateIntegrationMutation = { __typename?: 'Mutation', create_integration: { __typename?: 'IntegrationMutationResult', success: boolean, message?: Maybe<string>, integration?: Maybe<{ __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, product?: Maybe<{ __typename?: 'Product', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: Maybe<{ __typename?: 'IntegrationConfig', id: string }> }> } };

export type UpdateIntegrationMutationVariables = Exact<{
  integration_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type UpdateIntegrationMutation = { __typename?: 'Mutation', update_integration: { __typename?: 'IntegrationMutationResult', success: boolean, message?: Maybe<string>, integration?: Maybe<{ __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, product?: Maybe<{ __typename?: 'Product', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: Maybe<{ __typename?: 'IntegrationConfig', id: string }> }> } };

export type CreateIntegrationConfigMutationVariables = Exact<{
  agency_id: Scalars['ID'];
  integration_type_id: Scalars['ID'];
  credential_id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  data: Scalars['Json'];
}>;


export type CreateIntegrationConfigMutation = { __typename?: 'Mutation', create_integration_config: { __typename?: 'IntegrationConfigMutationResult', success: boolean, message?: Maybe<string>, integration_config?: Maybe<{ __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string } }> } };

export type UpdateIntegrationConfigMutationVariables = Exact<{
  integration_config_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  credential_id?: Maybe<Scalars['ID']>;
  data: Scalars['Json'];
}>;


export type UpdateIntegrationConfigMutation = { __typename?: 'Mutation', update_integration_config: { __typename?: 'IntegrationConfigMutationResult', success: boolean, message?: Maybe<string>, integration_config?: Maybe<{ __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string } }> } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', current_user?: Maybe<{ __typename?: 'User', id: string, name: string, email_address: string, memberships: Array<{ __typename?: 'Membership', id: string, access: AccessLevel, user: { __typename?: 'User', id: string, name: string, email_address: string }, subdomain: { __typename?: 'Subdomain', id: string, agency: { __typename?: 'Agency', id: string } } }> }> };

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { __typename?: 'Query', country_codes: Array<string> };

export type CountrySpecQueryVariables = Exact<{
  country_code: Scalars['ID'];
}>;


export type CountrySpecQuery = { __typename?: 'Query', country_spec?: Maybe<{ __typename?: 'CountrySpec', id: string, default_currency: string, supported_payment_currencies: Array<string>, supported_payment_methods: Array<string>, supported_transfer_countries: Array<string> }> };

export type ThemeQueryVariables = Exact<{
  theme_id: Scalars['ID'];
}>;


export type ThemeQuery = { __typename?: 'Query', theme?: Maybe<{ __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> }> };

export type ThemesQueryVariables = Exact<{
  filter: ThemeFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type ThemesQuery = { __typename?: 'Query', themes?: Maybe<Array<{ __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> }>> };

export type MarkdownQueryVariables = Exact<{
  markdown_id: Scalars['ID'];
}>;


export type MarkdownQuery = { __typename?: 'Query', markdown?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }> };

export type MarkdownsQueryVariables = Exact<{
  filter: MarkdownFilter;
  token?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['Boolean']>;
  order_by?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before_id?: Maybe<Scalars['ID']>;
  after_id?: Maybe<Scalars['ID']>;
}>;


export type MarkdownsQuery = { __typename?: 'Query', markdowns?: Maybe<Array<{ __typename?: 'Markdown', id: string, name: string, data: string }>> };

export type ImageQueryVariables = Exact<{
  image_id: Scalars['ID'];
}>;


export type ImageQuery = { __typename?: 'Query', image?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> };

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


export type ImagesQuery = { __typename?: 'Query', images?: Maybe<Array<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>> };

export type AgencyStripeAccountQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, id_ext: string, business_type?: Maybe<string>, charges_enabled: boolean, country: string, created: any, default_currency?: Maybe<string>, details_submitted: boolean, email?: Maybe<string>, payouts_enabled: boolean, business_profile: { __typename?: 'BusinessProfile', mcc?: Maybe<string>, name?: Maybe<string>, product_description?: Maybe<string>, support_address?: Maybe<string>, support_email?: Maybe<string>, support_phone?: Maybe<string>, support_url?: Maybe<string>, url?: Maybe<string> }, capabilities: { __typename?: 'StripeCapabilities', card_payments?: Maybe<string>, transfers?: Maybe<string> }, requirements: { __typename?: 'StripeRequirements', current_deadline?: Maybe<string>, disabled_reason?: Maybe<string>, currently_due: Array<Maybe<string>>, eventually_due: Array<Maybe<string>>, past_due: Array<Maybe<string>>, pending_verification: Array<Maybe<string>> }, settings: { __typename?: 'StripeSettings', branding?: Maybe<{ __typename?: 'StripeBranding', icon?: Maybe<string>, logo?: Maybe<string>, primary_color?: Maybe<string>, secondary_color?: Maybe<string> }> } } }> };

export type AgencyStripeAccountUpdateUrlQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountUpdateUrlQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, account_update_url: { __typename?: 'StripeAccountLink', url: string } } }> };

export type AgencyStripeAccountBalanceQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyStripeAccountBalanceQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, balance: { __typename?: 'StripeBalance', available: Array<{ __typename?: 'StripeCurrencyBalance', amount: number, currency: string, source_types: { __typename?: 'StripeBalanceSource', card?: Maybe<number>, bank_account?: Maybe<number> } }>, pending: Array<{ __typename?: 'StripeCurrencyBalance', amount: number, currency: string, source_types: { __typename?: 'StripeBalanceSource', card?: Maybe<number>, bank_account?: Maybe<number> } }>, connect_reserved?: Maybe<Array<{ __typename?: 'StripeCurrencyBalance', amount: number, currency: string, source_types: { __typename?: 'StripeBalanceSource', card?: Maybe<number>, bank_account?: Maybe<number> } }>> } } }> };

export type AgencyStripeAccountBalanceTransactionsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  created?: Maybe<Scalars['DateTime']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountBalanceTransactionsQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, balance_transactions: Array<{ __typename?: 'BalanceTransaction', id: string, id_ext: string, amount: number, available_on: any, created: any, exchange_rate?: Maybe<number>, currency: string, description?: Maybe<string>, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Maybe<Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: Maybe<string>, currency: string, description?: Maybe<string>, type: string }>> }> } }> };

export type AgencyStripeAccountPaymentIntentsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  created?: Maybe<Scalars['DateTime']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountPaymentIntentsQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, payment_intents: Array<{ __typename?: 'PaymentIntent', id: string, id_ext: string, amount: number, amount_capturable?: Maybe<number>, amount_received?: Maybe<number>, application_fee_amount?: Maybe<number>, canceled_at?: Maybe<any>, cancellation_reason?: Maybe<string>, capture_method?: Maybe<string>, confirmation_method?: Maybe<string>, created?: Maybe<any>, currency?: Maybe<string>, description?: Maybe<string>, invoice?: Maybe<string>, on_behalf_of?: Maybe<string>, payment_method?: Maybe<string>, payment_method_types?: Maybe<Array<Maybe<string>>>, receipt_email?: Maybe<string>, setup_future_usage?: Maybe<string>, statement_descriptor?: Maybe<string>, statement_descriptor_suffix?: Maybe<string>, status?: Maybe<string>, transfer_group?: Maybe<string>, charges?: Maybe<Array<Maybe<{ __typename?: 'Charge', id: string, id_ext: string, amount: number, amount_capturable?: Maybe<number>, amount_received?: Maybe<number>, application_fee_amount?: Maybe<number>, authorization_code?: Maybe<string>, calculated_statement_descriptor?: Maybe<string>, captured?: Maybe<boolean>, created?: Maybe<any>, currency?: Maybe<string>, description?: Maybe<string>, disputed?: Maybe<boolean>, failure_code?: Maybe<string>, failure_message?: Maybe<string>, invoice?: Maybe<string>, order?: Maybe<string>, paid?: Maybe<boolean>, payment_method?: Maybe<string>, receipt_email?: Maybe<string>, receipt_number?: Maybe<string>, receipt_url?: Maybe<string>, refunded?: Maybe<boolean>, source_transfer?: Maybe<string>, statement_descriptor?: Maybe<string>, statement_descriptor_suffix?: Maybe<string>, status?: Maybe<string>, transfer?: Maybe<string>, transfer_group?: Maybe<string>, balance_transaction?: Maybe<{ __typename?: 'BalanceTransaction', id: string, id_ext: string, amount: number, available_on: any, created: any, exchange_rate?: Maybe<number>, currency: string, description?: Maybe<string>, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Maybe<Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: Maybe<string>, currency: string, description?: Maybe<string>, type: string }>> }>, billing_details?: Maybe<{ __typename?: 'BillingDetails', email?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, fraud_details?: Maybe<{ __typename?: 'FraudDetails', stripe_report?: Maybe<string>, user_report?: Maybe<string> }>, outcome?: Maybe<{ __typename?: 'Outcome', network_status?: Maybe<string>, reason?: Maybe<string>, risk_level?: Maybe<string>, risk_score?: Maybe<number>, seller_message?: Maybe<string>, type?: Maybe<string>, rule?: Maybe<{ __typename?: 'OutcomeRule', action?: Maybe<string>, id?: Maybe<string>, predicate?: Maybe<string> }> }>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }> }>>>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, shipping?: Maybe<{ __typename?: 'Shipping', carrier?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, tracking_number?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }> }> } }> };

export type AgencyStripeAccountBankAccountsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountBankAccountsQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, bank_accounts: Array<{ __typename?: 'BankAccount', id: string, id_ext: string, account_holder_name?: Maybe<string>, account_holder_type?: Maybe<string>, available_payout_methods?: Maybe<Array<string>>, bank_name?: Maybe<string>, country: string, currency: string, default_for_currency?: Maybe<boolean>, fingerprint?: Maybe<string>, last4: string, routing_number?: Maybe<string>, status: string }> } }> };

export type AgencyStripeAccountCouponsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountCouponsQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, coupons: Array<{ __typename?: 'Coupon', id: string, id_ext: string, amount_off?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, duration?: Maybe<string>, duration_in_months?: Maybe<number>, livemode?: Maybe<boolean>, max_redemptions?: Maybe<number>, name?: Maybe<string>, percent_off?: Maybe<number>, redeem_by?: Maybe<any>, times_redeemed?: Maybe<number>, valid?: Maybe<boolean>, applies_to?: Maybe<{ __typename?: 'CouponAppliesTo', products?: Maybe<Array<string>> }> }> } }> };

export type CouponQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  coupon_id: Scalars['ID'];
}>;


export type CouponQuery = { __typename?: 'Query', coupon?: Maybe<{ __typename?: 'Coupon', id: string, id_ext: string, amount_off?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, duration?: Maybe<string>, duration_in_months?: Maybe<number>, livemode?: Maybe<boolean>, max_redemptions?: Maybe<number>, name?: Maybe<string>, percent_off?: Maybe<number>, redeem_by?: Maybe<any>, times_redeemed?: Maybe<number>, valid?: Maybe<boolean>, applies_to?: Maybe<{ __typename?: 'CouponAppliesTo', products?: Maybe<Array<string>> }> }> };

export type InvoiceItemQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoiceitem_id: Scalars['ID'];
}>;


export type InvoiceItemQuery = { __typename?: 'Query', invoiceitem?: Maybe<{ __typename?: 'InvoiceItem', id: string, id_ext: string, amount: number, currency: string, date: any, description?: Maybe<string>, discountable: boolean, livemode: boolean, proration: boolean, quantity: number, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string }>>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }>, price?: Maybe<{ __typename?: 'StripePrice', id: string }> }> };

export type AgencyStripeAccountInvoicesQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  customer_id?: Maybe<Scalars['ID']>;
  starting_after_id?: Maybe<Scalars['String']>;
  ending_before_id?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AgencyStripeAccountInvoicesQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, invoices: Array<{ __typename?: 'Invoice', id: string, id_ext: string, account_country?: Maybe<string>, account_name?: Maybe<string>, account_tax_ids: Array<string>, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount: number, attempt_count: number, attempted: boolean, auto_advance?: Maybe<boolean>, billing_reason?: Maybe<string>, collection_method?: Maybe<string>, created: any, currency: string, customer_email?: Maybe<string>, customer_name?: Maybe<string>, customer_phone?: Maybe<string>, customer_tax_exempt?: Maybe<string>, default_payment_method?: Maybe<string>, description?: Maybe<string>, due_date?: Maybe<any>, ending_balance: number, footer?: Maybe<string>, hosted_invoice_url?: Maybe<string>, invoice_pdf?: Maybe<string>, livemode: boolean, next_payment_attempt?: Maybe<any>, number?: Maybe<string>, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: Maybe<string>, starting_balance: number, statement_descriptor?: Maybe<string>, status?: Maybe<string>, subscription_proration_date?: Maybe<any>, subtotal: number, tax: number, total: number, webhooks_delivered_at: any, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: Maybe<string> }, charge?: Maybe<{ __typename?: 'Charge', id: string }>, custom_fields?: Maybe<Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }>>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, customer_address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer_shipping?: Maybe<{ __typename?: 'InvoiceCustomerShipping', carrier?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, tracking_number?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer_tax_ids?: Maybe<Array<{ __typename?: 'CustomerTaxId', type?: Maybe<string>, value?: Maybe<string> }>>, discount?: Maybe<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }>, status_transitions?: Maybe<{ __typename?: 'InvoiceStatusTransitions', finalized_at?: Maybe<any>, marked_uncollectible_at?: Maybe<any>, paid_at?: Maybe<any>, voided_at?: Maybe<any> }> }> } }> };

export type InvoiceQueryVariables = Exact<{
  stripe_account_id: Scalars['ID'];
  invoice_id: Scalars['ID'];
}>;


export type InvoiceQuery = { __typename?: 'Query', invoice?: Maybe<{ __typename?: 'Invoice', id: string, id_ext: string, account_country?: Maybe<string>, account_name?: Maybe<string>, account_tax_ids: Array<string>, amount_due: number, amount_paid: number, amount_remaining: number, application_fee_amount: number, attempt_count: number, attempted: boolean, auto_advance?: Maybe<boolean>, billing_reason?: Maybe<string>, collection_method?: Maybe<string>, created: any, currency: string, customer_email?: Maybe<string>, customer_name?: Maybe<string>, customer_phone?: Maybe<string>, customer_tax_exempt?: Maybe<string>, default_payment_method?: Maybe<string>, description?: Maybe<string>, due_date?: Maybe<any>, ending_balance: number, footer?: Maybe<string>, hosted_invoice_url?: Maybe<string>, invoice_pdf?: Maybe<string>, livemode: boolean, next_payment_attempt?: Maybe<any>, number?: Maybe<string>, paid: boolean, period_end: any, period_start: any, post_payment_credit_notes_amount: number, pre_payment_credit_notes_amount: number, receipt_number?: Maybe<string>, starting_balance: number, statement_descriptor?: Maybe<string>, status?: Maybe<string>, subscription_proration_date?: Maybe<any>, subtotal: number, tax: number, total: number, webhooks_delivered_at: any, automatic_tax: { __typename?: 'InvoiceAutomaticTax', enabled: boolean, status?: Maybe<string> }, charge?: Maybe<{ __typename?: 'Charge', id: string }>, custom_fields?: Maybe<Array<{ __typename?: 'InvoiceCustomField', name: string, value: string }>>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, customer_address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer_shipping?: Maybe<{ __typename?: 'InvoiceCustomerShipping', carrier?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, tracking_number?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer_tax_ids?: Maybe<Array<{ __typename?: 'CustomerTaxId', type?: Maybe<string>, value?: Maybe<string> }>>, discount?: Maybe<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>, discounts?: Maybe<Array<{ __typename?: 'Discount', id: string, id_ext: string, checkout_session?: Maybe<string>, end?: Maybe<any>, invoice_item?: Maybe<string>, promotion_code?: Maybe<string>, start: any, subscription?: Maybe<string>, coupon?: Maybe<{ __typename?: 'Coupon', id: string }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, invoice?: Maybe<{ __typename?: 'Invoice', id: string }> }>>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }>, status_transitions?: Maybe<{ __typename?: 'InvoiceStatusTransitions', finalized_at?: Maybe<any>, marked_uncollectible_at?: Maybe<any>, paid_at?: Maybe<any>, voided_at?: Maybe<any> }> }> };

export type CustomerQueryVariables = Exact<{
  customer_id: Scalars['ID'];
}>;


export type CustomerQuery = { __typename?: 'Query', customer?: Maybe<{ __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, user?: Maybe<{ __typename?: 'User', id: string, name: string, email_address: string }> }> };

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


export type AgencyCustomersQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', id: string, customers: Array<{ __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, user?: Maybe<{ __typename?: 'User', id: string, name: string, email_address: string }> }> } }> };

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


export type CustomersQuery = { __typename?: 'Query', customers?: Maybe<Array<{ __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string, stripe_account: { __typename?: 'StripeAccount', id: string }, default_stripe_customer: { __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }, stripe_customers: Array<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, user?: Maybe<{ __typename?: 'User', id: string, name: string, email_address: string }> }>> };

export type CountCustomersQueryVariables = Exact<{
  filter: CustomerFilter;
  token?: Maybe<Scalars['String']>;
}>;


export type CountCustomersQuery = { __typename?: 'Query', count_customers: number };

export type AgencySubscriptionPlanQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencySubscriptionPlanQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, subscription_plan: { __typename?: 'SubscriptionPlan', id: string, name: string, transaction_fees: Array<{ __typename?: 'TransactionFee', id: string, percentage: number, fixed_amount: number, currency: string, transaction_amount_upper_bound: number, data: any, subscription_plan: { __typename?: 'SubscriptionPlan', id: string } }> } }> };

export type AgencyQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencyQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: Maybe<string>, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } }> };

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


export type AgenciesQuery = { __typename?: 'Query', agencies?: Maybe<Array<{ __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: Maybe<string>, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } }>> };

export type CurrentUserAgenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserAgenciesQuery = { __typename?: 'Query', current_user?: Maybe<{ __typename?: 'User', id: string, memberships: Array<{ __typename?: 'Membership', id: string, access: AccessLevel, subdomain: { __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: Maybe<string>, stripe_account: { __typename?: 'StripeAccount', id: string, id_ext: string, business_type?: Maybe<string>, charges_enabled: boolean, country: string, created: any, default_currency?: Maybe<string>, details_submitted: boolean, email?: Maybe<string>, payouts_enabled: boolean, business_profile: { __typename?: 'BusinessProfile', mcc?: Maybe<string>, name?: Maybe<string>, product_description?: Maybe<string>, support_address?: Maybe<string>, support_email?: Maybe<string>, support_phone?: Maybe<string>, support_url?: Maybe<string>, url?: Maybe<string> }, capabilities: { __typename?: 'StripeCapabilities', card_payments?: Maybe<string>, transfers?: Maybe<string> }, requirements: { __typename?: 'StripeRequirements', current_deadline?: Maybe<string>, disabled_reason?: Maybe<string>, currently_due: Array<Maybe<string>>, eventually_due: Array<Maybe<string>>, past_due: Array<Maybe<string>>, pending_verification: Array<Maybe<string>> }, settings: { __typename?: 'StripeSettings', branding?: Maybe<{ __typename?: 'StripeBranding', icon?: Maybe<string>, logo?: Maybe<string>, primary_color?: Maybe<string>, secondary_color?: Maybe<string> }> } }, subscription_plan: { __typename?: 'SubscriptionPlan', id: string, name: string, transaction_fees: Array<{ __typename?: 'TransactionFee', id: string, percentage: number, fixed_amount: number, currency: string, transaction_amount_upper_bound: number, data: any, subscription_plan: { __typename?: 'SubscriptionPlan', id: string } }> }, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } }, memberships: Array<{ __typename?: 'Membership', id: string, access: AccessLevel, user: { __typename?: 'User', id: string, name: string, email_address: string }, subdomain: { __typename?: 'Subdomain', id: string, agency: { __typename?: 'Agency', id: string } } }> }, user: { __typename?: 'User', id: string } }> }> };

export type SubdomainPublicQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainPublicQuery = { __typename?: 'Query', subdomains?: Maybe<Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, name: string, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } } }>> };

export type ProductQueryVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type ProductQuery = { __typename?: 'Query', product?: Maybe<{ __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> }> };

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


export type ProductsQuery = { __typename?: 'Query', products?: Maybe<Array<{ __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> }>> };

export type CountProductsQueryVariables = Exact<{
  filter: ProductFilter;
  token?: Maybe<Scalars['String']>;
}>;


export type CountProductsQuery = { __typename?: 'Query', count_products: number };

export type OrderDetailsQueryVariables = Exact<{
  order_id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
}>;


export type OrderDetailsQuery = { __typename?: 'Query', order?: Maybe<{ __typename?: 'Order', id: string, state: string, error?: Maybe<string>, ordered_at: any, processed_at?: Maybe<any>, items: Array<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: Maybe<string>, processed_at?: Maybe<any>, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number>, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> } } }>, customer: { __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string }, stripe_checkout_session: { __typename?: 'StripeCheckoutSession', id: string, id_ext: string, allow_promotion_codes?: Maybe<boolean>, amount_subtotal?: Maybe<number>, amount_total?: Maybe<number>, billing_address_collection?: Maybe<string>, cancel_url?: Maybe<string>, client_reference_id?: Maybe<string>, currency?: Maybe<string>, customer_email?: Maybe<string>, livemode?: Maybe<boolean>, locale?: Maybe<string>, mode?: Maybe<string>, payment_method_types?: Maybe<Array<Maybe<string>>>, payment_status?: Maybe<string>, submit_type?: Maybe<string>, success_url?: Maybe<string>, url?: Maybe<string>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string, id_ext: string, amount: number, amount_capturable?: Maybe<number>, amount_received?: Maybe<number>, application_fee_amount?: Maybe<number>, canceled_at?: Maybe<any>, cancellation_reason?: Maybe<string>, capture_method?: Maybe<string>, confirmation_method?: Maybe<string>, created?: Maybe<any>, currency?: Maybe<string>, description?: Maybe<string>, invoice?: Maybe<string>, on_behalf_of?: Maybe<string>, payment_method?: Maybe<string>, payment_method_types?: Maybe<Array<Maybe<string>>>, receipt_email?: Maybe<string>, setup_future_usage?: Maybe<string>, statement_descriptor?: Maybe<string>, statement_descriptor_suffix?: Maybe<string>, status?: Maybe<string>, transfer_group?: Maybe<string>, charges?: Maybe<Array<Maybe<{ __typename?: 'Charge', id: string, id_ext: string, amount: number, amount_capturable?: Maybe<number>, amount_received?: Maybe<number>, application_fee_amount?: Maybe<number>, authorization_code?: Maybe<string>, calculated_statement_descriptor?: Maybe<string>, captured?: Maybe<boolean>, created?: Maybe<any>, currency?: Maybe<string>, description?: Maybe<string>, disputed?: Maybe<boolean>, failure_code?: Maybe<string>, failure_message?: Maybe<string>, invoice?: Maybe<string>, order?: Maybe<string>, paid?: Maybe<boolean>, payment_method?: Maybe<string>, receipt_email?: Maybe<string>, receipt_number?: Maybe<string>, receipt_url?: Maybe<string>, refunded?: Maybe<boolean>, source_transfer?: Maybe<string>, statement_descriptor?: Maybe<string>, statement_descriptor_suffix?: Maybe<string>, status?: Maybe<string>, transfer?: Maybe<string>, transfer_group?: Maybe<string>, balance_transaction?: Maybe<{ __typename?: 'BalanceTransaction', id: string, id_ext: string, amount: number, available_on: any, created: any, exchange_rate?: Maybe<number>, currency: string, description?: Maybe<string>, fee: number, net: number, status: string, reporting_category: string, type: string, source: string, fee_details?: Maybe<Array<{ __typename?: 'BalanceTransactionFeeDetails', amount: number, application?: Maybe<string>, currency: string, description?: Maybe<string>, type: string }>> }>, billing_details?: Maybe<{ __typename?: 'BillingDetails', email?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, fraud_details?: Maybe<{ __typename?: 'FraudDetails', stripe_report?: Maybe<string>, user_report?: Maybe<string> }>, outcome?: Maybe<{ __typename?: 'Outcome', network_status?: Maybe<string>, reason?: Maybe<string>, risk_level?: Maybe<string>, risk_score?: Maybe<number>, seller_message?: Maybe<string>, type?: Maybe<string>, rule?: Maybe<{ __typename?: 'OutcomeRule', action?: Maybe<string>, id?: Maybe<string>, predicate?: Maybe<string> }> }>, payment_intent?: Maybe<{ __typename?: 'PaymentIntent', id: string }> }>>>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string, id_ext: string, balance?: Maybe<number>, created?: Maybe<any>, currency?: Maybe<string>, delinquent?: Maybe<boolean>, description?: Maybe<string>, email?: Maybe<string>, invoice_prefix?: Maybe<string>, name?: Maybe<string>, next_invoice_sequence?: Maybe<number>, phone?: Maybe<string>, preferred_locales?: Maybe<Array<Maybe<string>>>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }>, customer?: Maybe<{ __typename?: 'Customer', id: string }> }>, shipping?: Maybe<{ __typename?: 'Shipping', carrier?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, tracking_number?: Maybe<string>, address?: Maybe<{ __typename?: 'Address', city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }> }>, customer?: Maybe<{ __typename?: 'StripeCustomer', id: string }>, line_items: Array<{ __typename?: 'LineItem', id: string, amount_subtotal: number, amount_total: number, currency: string, description: string, quantity?: Maybe<number>, price?: Maybe<{ __typename?: 'StripePrice', id: string, id_ext: string, active: boolean, billing_scheme: string, created?: Maybe<any>, currency: string, livemode: boolean, lookup_key?: Maybe<string>, nickname?: Maybe<string>, product?: Maybe<string>, tax_behavior?: Maybe<string>, tiers_mode?: Maybe<string>, type: string, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, recurring?: Maybe<{ __typename?: 'StripePriceRecurring', aggregate_usage?: Maybe<string>, interval: string, interval_count: number, trial_period_days?: Maybe<number>, usage_type?: Maybe<string> }>, tiers?: Maybe<Array<{ __typename?: 'StripePriceTier', flat_amount?: Maybe<number>, flat_amount_decimal?: Maybe<string>, unit_amount?: Maybe<number>, unit_amount_decimal?: Maybe<string>, up_to?: Maybe<number> }>>, transform_quantity?: Maybe<{ __typename?: 'StripePriceTransformQuantity', divide_by?: Maybe<number>, round?: Maybe<string> }> }> }> } }> };

export type OrderQueryVariables = Exact<{
  order_id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
}>;


export type OrderQuery = { __typename?: 'Query', order?: Maybe<{ __typename?: 'Order', id: string, state: string, error?: Maybe<string>, ordered_at: any, processed_at?: Maybe<any>, items: Array<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: Maybe<string>, processed_at?: Maybe<any>, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number>, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> } } }>, customer: { __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string }, stripe_checkout_session: { __typename?: 'StripeCheckoutSession', id: string, id_ext: string, amount_subtotal?: Maybe<number>, amount_total?: Maybe<number>, currency?: Maybe<string>, payment_status?: Maybe<string> } }> };

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


export type OrdersQuery = { __typename?: 'Query', orders?: Maybe<Array<{ __typename?: 'Order', id: string, state: string, error?: Maybe<string>, ordered_at: any, processed_at?: Maybe<any>, items: Array<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: Maybe<string>, processed_at?: Maybe<any>, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number>, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> } } }>, customer: { __typename?: 'Customer', id: string, name?: Maybe<string>, email_address: string }, stripe_checkout_session: { __typename?: 'StripeCheckoutSession', id: string, id_ext: string, amount_subtotal?: Maybe<number>, amount_total?: Maybe<number>, currency?: Maybe<string>, payment_status?: Maybe<string> } }>> };

export type CountOrdersQueryVariables = Exact<{
  filter: OrderFilter;
  token?: Maybe<Scalars['String']>;
}>;


export type CountOrdersQuery = { __typename?: 'Query', count_orders: number };

export type OrderItemQueryVariables = Exact<{
  order_item_id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
}>;


export type OrderItemQuery = { __typename?: 'Query', order_item?: Maybe<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: Maybe<string>, processed_at?: Maybe<any>, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number>, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> } } }> };

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


export type OrderItemsQuery = { __typename?: 'Query', order_items?: Maybe<Array<{ __typename?: 'OrderItem', id: string, state: string, stripe_line_item_id_ext: string, error?: Maybe<string>, processed_at?: Maybe<any>, order: { __typename?: 'Order', id: string }, price: { __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number>, product: { __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, agency: { __typename?: 'Agency', id: string }, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> } } }>> };

export type ProductAndAgencyFromUrlPartsQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
  product_url_name: Scalars['String'];
}>;


export type ProductAndAgencyFromUrlPartsQuery = { __typename?: 'Query', subdomains?: Maybe<Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, products?: Maybe<Array<{ __typename?: 'Product', id: string, name: string, url_name: string, description?: Maybe<string>, duration?: Maybe<string>, status: string, active: boolean, agency: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: Maybe<string>, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } }, default_price?: Maybe<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>, prices?: Maybe<Array<{ __typename?: 'Price', id: string, name: string, unit_amount: number, currency: string, status: string, active: boolean, type: string, recurring_interval?: Maybe<string>, recurring_interval_count?: Maybe<number> }>>, image_logo?: Maybe<{ __typename?: 'Image', id: string }>, image_hero?: Maybe<{ __typename?: 'Image', id: string }>, markdown_description?: Maybe<{ __typename?: 'Markdown', id: string, name: string, data: string }>, integrations?: Maybe<Array<{ __typename?: 'Integration', id: string }>> }>> } }>> };

export type SubdomainAgencyQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyQuery = { __typename?: 'Query', subdomains?: Maybe<Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, name: string, livemode: boolean, default_pricing_currency?: Maybe<string>, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } } }>> };

export type SubdomainAgencyExtendedQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyExtendedQuery = { __typename?: 'Query', subdomains?: Maybe<Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', supported_payment_currencies: Array<string>, id: string, name: string, livemode: boolean, default_pricing_currency?: Maybe<string>, subdomain: { __typename?: 'Subdomain', id: string, name: string }, theme: { __typename?: 'Theme', id: string, color_primary?: Maybe<string>, color_secondary?: Maybe<string>, color_accent?: Maybe<string>, color_background?: Maybe<string>, color_surface?: Maybe<string>, color_error?: Maybe<string>, color_success?: Maybe<string>, image_logo?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }>, image_hero?: Maybe<{ __typename?: 'Image', id: string, name: string, color: string, data: string, access: AccessLevel }> } } }>> };

export type SubdomainAgencyStripeAccountUpdateUrlQueryVariables = Exact<{
  subdomain_name: Scalars['String'];
}>;


export type SubdomainAgencyStripeAccountUpdateUrlQuery = { __typename?: 'Query', subdomains?: Maybe<Array<{ __typename?: 'Subdomain', id: string, name: string, agency: { __typename?: 'Agency', id: string, stripe_account: { __typename?: 'StripeAccount', account_update_url: { __typename?: 'StripeAccountLink', url: string } } } }>> };

export type AgencySettingsQueryVariables = Exact<{
  agency_id: Scalars['ID'];
}>;


export type AgencySettingsQuery = { __typename?: 'Query', agency?: Maybe<{ __typename?: 'Agency', id: string, settings: { __typename?: 'AgencySettings', id: string, checkout_success_url?: Maybe<string>, checkout_cancel_url?: Maybe<string> } }> };

export type ProductSettingsQueryVariables = Exact<{
  product_id: Scalars['ID'];
}>;


export type ProductSettingsQuery = { __typename?: 'Query', product?: Maybe<{ __typename?: 'Product', id: string, settings: { __typename?: 'ProductSettings', id: string, checkout_success_url?: Maybe<string>, checkout_cancel_url?: Maybe<string> } }> };

export type AgencyPagesQueryVariables = Exact<{
  agency_id: Scalars['ID'];
  page_definition_id?: Maybe<Scalars['ID']>;
}>;


export type AgencyPagesQuery = { __typename?: 'Query', pages?: Maybe<Array<{ __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: Maybe<{ __typename?: 'Product', id: string }>, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> }>> };

export type ProductPagesQueryVariables = Exact<{
  product_id: Scalars['ID'];
  page_definition_id?: Maybe<Scalars['ID']>;
}>;


export type ProductPagesQuery = { __typename?: 'Query', pages?: Maybe<Array<{ __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: Maybe<{ __typename?: 'Product', id: string }>, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> }>> };

export type PageQueryVariables = Exact<{
  page_id: Scalars['ID'];
}>;


export type PageQuery = { __typename?: 'Query', page?: Maybe<{ __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: Maybe<{ __typename?: 'Product', id: string }>, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> }> };

export type PageByUrlQueryVariables = Exact<{
  url: Scalars['String'];
}>;


export type PageByUrlQuery = { __typename?: 'Query', page_by_url?: Maybe<{ __typename?: 'Page', id: string, url_path: string, access: AccessLevel, agency: { __typename?: 'Agency', id: string }, product?: Maybe<{ __typename?: 'Product', id: string }>, definition: { __typename?: 'PageDefinition', id: string, name: string, url_path: string }, blocks: Array<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> }> };

export type PageBlockQueryVariables = Exact<{
  page_block_id: Scalars['ID'];
}>;


export type PageBlockQuery = { __typename?: 'Query', page_block?: Maybe<{ __typename?: 'PageBlock', id: string, data: any, page: { __typename?: 'Page', id: string }, definition: { __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> } }> };

export type PageDefinitionQueryVariables = Exact<{
  page_definition_id: Scalars['ID'];
}>;


export type PageDefinitionQuery = { __typename?: 'Query', page_definition?: Maybe<{ __typename?: 'PageDefinition', id: string, name: string, url_path: string }> };

export type PageBlockDefinitionQueryVariables = Exact<{
  page_block_definition_id: Scalars['ID'];
}>;


export type PageBlockDefinitionQuery = { __typename?: 'Query', page_block_definition?: Maybe<{ __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> }> };

export type PageDefinitionsByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type PageDefinitionsByNameQuery = { __typename?: 'Query', page_definitions?: Maybe<Array<{ __typename?: 'PageDefinition', id: string, name: string, url_path: string }>> };

export type PageDefinitionByUrlPathQueryVariables = Exact<{
  url_path: Scalars['String'];
}>;


export type PageDefinitionByUrlPathQuery = { __typename?: 'Query', page_definition_by_url_path?: Maybe<{ __typename?: 'PageDefinition', id: string, name: string, url_path: string }> };

export type PageBlockDefinitionsByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type PageBlockDefinitionsByNameQuery = { __typename?: 'Query', page_block_definitions?: Maybe<Array<{ __typename?: 'PageBlockDefinition', id: string, name: string, page: { __typename?: 'PageDefinition', id: string }, fields: Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> }>> };

export type CalculateTransactionFeeQueryVariables = Exact<{
  subscription_plan_id: Scalars['ID'];
  amount: Scalars['Int'];
  currency: Scalars['String'];
}>;


export type CalculateTransactionFeeQuery = { __typename?: 'Query', subscription_plan?: Maybe<{ __typename?: 'SubscriptionPlan', id: string, calculate_fee: number }> };

export type FormFieldQueryVariables = Exact<{
  form_field_id: Scalars['ID'];
}>;


export type FormFieldQuery = { __typename?: 'Query', form_field?: Maybe<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }> };

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


export type FormFieldsQuery = { __typename?: 'Query', form_fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> };

export type CredentialQueryVariables = Exact<{
  credential_id: Scalars['ID'];
}>;


export type CredentialQuery = { __typename?: 'Query', credential?: Maybe<{ __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> } }> };

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


export type CredentialsQuery = { __typename?: 'Query', credentials?: Maybe<Array<{ __typename?: 'Credential', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential_type: { __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> } }>> };

export type CredentialTypeQueryVariables = Exact<{
  credential_type_id: Scalars['ID'];
}>;


export type CredentialTypeQuery = { __typename?: 'Query', credential_type?: Maybe<{ __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> }> };

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


export type CredentialTypesQuery = { __typename?: 'Query', credential_types?: Maybe<Array<{ __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> }>> };

export type IntegrationQueryVariables = Exact<{
  integration_id: Scalars['ID'];
}>;


export type IntegrationQuery = { __typename?: 'Query', integration?: Maybe<{ __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, product?: Maybe<{ __typename?: 'Product', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: Maybe<{ __typename?: 'IntegrationConfig', id: string }> }> };

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


export type IntegrationsQuery = { __typename?: 'Query', integrations?: Maybe<Array<{ __typename?: 'Integration', id: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, product?: Maybe<{ __typename?: 'Product', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string }, integration_config?: Maybe<{ __typename?: 'IntegrationConfig', id: string }> }>> };

export type IntegrationConfigQueryVariables = Exact<{
  integration_config_id: Scalars['ID'];
}>;


export type IntegrationConfigQuery = { __typename?: 'Query', integration_config?: Maybe<{ __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string } }> };

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


export type IntegrationConfigsQuery = { __typename?: 'Query', integration_configs?: Maybe<Array<{ __typename?: 'IntegrationConfig', id: string, name: string, data: any, agency: { __typename?: 'Agency', id: string }, credential?: Maybe<{ __typename?: 'Credential', id: string }>, integration_type: { __typename?: 'IntegrationType', id: string } }>> };

export type IntegrationTypeQueryVariables = Exact<{
  integration_type_id: Scalars['ID'];
}>;


export type IntegrationTypeQuery = { __typename?: 'Query', integration_type?: Maybe<{ __typename?: 'IntegrationType', id: string, name: string, title: string, status: string, automatic_order_management: boolean, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>>, config_fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>>, credential_type?: Maybe<{ __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> }> }> };

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


export type IntegrationTypesQuery = { __typename?: 'Query', integration_types?: Maybe<Array<{ __typename?: 'IntegrationType', id: string, name: string, title: string, status: string, automatic_order_management: boolean, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>>, config_fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>>, credential_type?: Maybe<{ __typename?: 'CredentialType', id: string, name: string, fields?: Maybe<Array<{ __typename?: 'FormField', id: string, name: string, label: string, type: string, hint?: Maybe<string>, prefix?: Maybe<string>, suffix?: Maybe<string>, required: boolean, default?: Maybe<any> }>> }> }>> };

export const Stripe_AccountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_account"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"business_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mcc"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"product_description"}},{"kind":"Field","name":{"kind":"Name","value":"support_address"}},{"kind":"Field","name":{"kind":"Name","value":"support_email"}},{"kind":"Field","name":{"kind":"Name","value":"support_phone"}},{"kind":"Field","name":{"kind":"Name","value":"support_url"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"business_type"}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card_payments"}},{"kind":"Field","name":{"kind":"Name","value":"transfers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_deadline"}},{"kind":"Field","name":{"kind":"Name","value":"disabled_reason"}},{"kind":"Field","name":{"kind":"Name","value":"currently_due"}},{"kind":"Field","name":{"kind":"Name","value":"eventually_due"}},{"kind":"Field","name":{"kind":"Name","value":"past_due"}},{"kind":"Field","name":{"kind":"Name","value":"pending_verification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"primary_color"}},{"kind":"Field","name":{"kind":"Name","value":"secondary_color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"charges_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency"}},{"kind":"Field","name":{"kind":"Name","value":"details_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"payouts_enabled"}}]}}]} as unknown as DocumentNode<Stripe_AccountFragment, unknown>;
export const CouponFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"coupon"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount_off"}},{"kind":"Field","name":{"kind":"Name","value":"applies_to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"duration_in_months"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"max_redemptions"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"percent_off"}},{"kind":"Field","name":{"kind":"Name","value":"redeem_by"}},{"kind":"Field","name":{"kind":"Name","value":"times_redeemed"}},{"kind":"Field","name":{"kind":"Name","value":"valid"}}]}}]} as unknown as DocumentNode<CouponFragment, unknown>;
export const Balance_TransactionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"balance_transaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"available_on"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"exchange_rate"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"fee_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"application"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"net"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reporting_category"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<Balance_TransactionFragment, unknown>;
export const AddressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]} as unknown as DocumentNode<AddressFragment, unknown>;
export const ChargeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"charge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"authorization_code"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculated_statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"captured"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"disputed"}},{"kind":"Field","name":{"kind":"Name","value":"failure_code"}},{"kind":"Field","name":{"kind":"Name","value":"failure_message"}},{"kind":"Field","name":{"kind":"Name","value":"fraud_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_report"}},{"kind":"Field","name":{"kind":"Name","value":"user_report"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network_status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"risk_level"}},{"kind":"Field","name":{"kind":"Name","value":"risk_score"}},{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seller_message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_number"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_url"}},{"kind":"Field","name":{"kind":"Name","value":"refunded"}},{"kind":"Field","name":{"kind":"Name","value":"source_transfer"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}}]} as unknown as DocumentNode<ChargeFragment, unknown>;
export const Stripe_CustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"delinquent"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_prefix"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"next_invoice_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"preferred_locales"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Stripe_CustomerFragment, unknown>;
export const Payment_IntentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"payment_intent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentIntent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amount_capturable"}},{"kind":"Field","name":{"kind":"Name","value":"amount_received"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"cancellation_reason"}},{"kind":"Field","name":{"kind":"Name","value":"capture_method"}},{"kind":"Field","name":{"kind":"Name","value":"charges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"charge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmation_method"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"}},{"kind":"Field","name":{"kind":"Name","value":"on_behalf_of"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_email"}},{"kind":"Field","name":{"kind":"Name","value":"setup_future_usage"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"transfer_group"}}]}}]} as unknown as DocumentNode<Payment_IntentFragment, unknown>;
export const Product_SettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"product_settings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductSettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_success_url"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_cancel_url"}}]}}]} as unknown as DocumentNode<Product_SettingsFragment, unknown>;
export const Transaction_FeeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"transaction_fee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionFee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"transaction_amount_upper_bound"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Transaction_FeeFragment, unknown>;
export const Subscription_PlanFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"subscription_plan"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionPlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"transaction_fees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"transaction_fee"}}]}}]}}]} as unknown as DocumentNode<Subscription_PlanFragment, unknown>;
export const Agency_SettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"agency_settings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AgencySettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_success_url"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_cancel_url"}}]}}]} as unknown as DocumentNode<Agency_SettingsFragment, unknown>;
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
export const Stripe_PriceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"billing_scheme"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"lookup_key"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"recurring"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate_usage"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"interval_count"}},{"kind":"Field","name":{"kind":"Name","value":"trial_period_days"}},{"kind":"Field","name":{"kind":"Name","value":"usage_type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax_behavior"}},{"kind":"Field","name":{"kind":"Name","value":"tiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flat_amount"}},{"kind":"Field","name":{"kind":"Name","value":"flat_amount_decimal"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount_decimal"}},{"kind":"Field","name":{"kind":"Name","value":"up_to"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tiers_mode"}},{"kind":"Field","name":{"kind":"Name","value":"transform_quantity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"divide_by"}},{"kind":"Field","name":{"kind":"Name","value":"round"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount_decimal"}}]}}]} as unknown as DocumentNode<Stripe_PriceFragment, unknown>;
export const Line_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"line_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]} as unknown as DocumentNode<Line_ItemFragment, unknown>;
export const Stripe_Checkout_SessionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stripe_checkout_session"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCheckoutSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"allow_promotion_codes"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"billing_address_collection"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_url"}},{"kind":"Field","name":{"kind":"Name","value":"client_reference_id"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_email"}},{"kind":"Field","name":{"kind":"Name","value":"line_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"line_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_types"}},{"kind":"Field","name":{"kind":"Name","value":"payment_status"}},{"kind":"Field","name":{"kind":"Name","value":"submit_type"}},{"kind":"Field","name":{"kind":"Name","value":"success_url"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_url"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<Stripe_Checkout_SessionFragment, unknown>;
export const DiscountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"discount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Discount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"checkout_session"}},{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice_item"}},{"kind":"Field","name":{"kind":"Name","value":"promotion_code"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}}]}}]} as unknown as DocumentNode<DiscountFragment, unknown>;
export const InvoiceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"invoice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Invoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"account_country"}},{"kind":"Field","name":{"kind":"Name","value":"account_name"}},{"kind":"Field","name":{"kind":"Name","value":"account_tax_ids"}},{"kind":"Field","name":{"kind":"Name","value":"amount_due"}},{"kind":"Field","name":{"kind":"Name","value":"amount_paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount_remaining"}},{"kind":"Field","name":{"kind":"Name","value":"application_fee_amount"}},{"kind":"Field","name":{"kind":"Name","value":"attempt_count"}},{"kind":"Field","name":{"kind":"Name","value":"attempted"}},{"kind":"Field","name":{"kind":"Name","value":"auto_advance"}},{"kind":"Field","name":{"kind":"Name","value":"automatic_tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billing_reason"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collection_method"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"custom_fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_email"}},{"kind":"Field","name":{"kind":"Name","value":"customer_name"}},{"kind":"Field","name":{"kind":"Name","value":"customer_phone"}},{"kind":"Field","name":{"kind":"Name","value":"customer_shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer_tax_exempt"}},{"kind":"Field","name":{"kind":"Name","value":"customer_tax_ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_payment_method"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"discount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"discount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"due_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_balance"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"hosted_invoice_url"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_pdf"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"next_payment_attempt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"period_end"}},{"kind":"Field","name":{"kind":"Name","value":"period_start"}},{"kind":"Field","name":{"kind":"Name","value":"post_payment_credit_notes_amount"}},{"kind":"Field","name":{"kind":"Name","value":"pre_payment_credit_notes_amount"}},{"kind":"Field","name":{"kind":"Name","value":"receipt_number"}},{"kind":"Field","name":{"kind":"Name","value":"starting_balance"}},{"kind":"Field","name":{"kind":"Name","value":"statement_descriptor"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"status_transitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finalized_at"}},{"kind":"Field","name":{"kind":"Name","value":"marked_uncollectible_at"}},{"kind":"Field","name":{"kind":"Name","value":"paid_at"}},{"kind":"Field","name":{"kind":"Name","value":"voided_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscription_proration_date"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"webhooks_delivered_at"}}]}}]} as unknown as DocumentNode<InvoiceFragment, unknown>;
export const Invoice_Line_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"invoice_line_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount_amounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"discount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discountable"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_item"}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proration"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_item"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<Invoice_Line_ItemFragment, unknown>;
export const InvoiceitemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"invoiceitem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvoiceItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discountable"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"livemode"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proration"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount_decimal"}}]}}]} as unknown as DocumentNode<InvoiceitemFragment, unknown>;
export const PriceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Price"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval"}},{"kind":"Field","name":{"kind":"Name","value":"recurring_interval_count"}}]}}]} as unknown as DocumentNode<PriceFragment, unknown>;
export const MarkdownFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"markdown"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Markdown"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]} as unknown as DocumentNode<MarkdownFragment, unknown>;
export const ProductFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url_name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"default_price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image_hero"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"markdown_description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"markdown"}}]}},{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProductFragment, unknown>;
export const Order_ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"order_item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"product"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_line_item_id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"processed_at"}}]}}]} as unknown as DocumentNode<Order_ItemFragment, unknown>;
export const OrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ordered_at"}},{"kind":"Field","name":{"kind":"Name","value":"processed_at"}}]}}]} as unknown as DocumentNode<OrderFragment, unknown>;
export const Bank_AccountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"bank_account"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BankAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"account_holder_name"}},{"kind":"Field","name":{"kind":"Name","value":"account_holder_type"}},{"kind":"Field","name":{"kind":"Name","value":"available_payout_methods"}},{"kind":"Field","name":{"kind":"Name","value":"bank_name"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"default_for_currency"}},{"kind":"Field","name":{"kind":"Name","value":"fingerprint"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"routing_number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<Bank_AccountFragment, unknown>;
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
export const CreateInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auto_advance"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"footer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create_invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"customer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer"}}},{"kind":"Argument","name":{"kind":"Name","value":"auto_advance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auto_advance"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"footer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"footer"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscription"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}}},{"kind":"Argument","name":{"kind":"Name","value":"days_until_due"},"value":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_payment_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}}},{"kind":"Argument","name":{"kind":"Name","value":"due_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<CreateInvoiceMutation, CreateInvoiceMutationVariables>;
export const UpdateInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auto_advance"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"footer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"auto_advance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auto_advance"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"footer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"footer"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscription"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}}},{"kind":"Argument","name":{"kind":"Name","value":"days_until_due"},"value":{"kind":"Variable","name":{"kind":"Name","value":"days_until_due"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_payment_method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_payment_method"}}},{"kind":"Argument","name":{"kind":"Name","value":"default_source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default_source"}}},{"kind":"Argument","name":{"kind":"Name","value":"due_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"due_date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>;
export const DeleteInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;
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
export const AgencyStripeAccountBalanceTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBalanceTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance_transactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"balance_transaction"}}]}}]}}]}}]}},...Balance_TransactionFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountBalanceTransactionsQuery, AgencyStripeAccountBalanceTransactionsQueryVariables>;
export const AgencyStripeAccountPaymentIntentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountPaymentIntents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}}]}}]}}]}},...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountPaymentIntentsQuery, AgencyStripeAccountPaymentIntentsQueryVariables>;
export const AgencyStripeAccountBankAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountBankAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bank_accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"bank_account"}}]}}]}}]}}]}},...Bank_AccountFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountBankAccountsQuery, AgencyStripeAccountBankAccountsQueryVariables>;
export const AgencyStripeAccountCouponsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountCoupons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"coupons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"coupon"}}]}}]}}]}}]}},...CouponFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountCouponsQuery, AgencyStripeAccountCouponsQueryVariables>;
export const CouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Coupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"coupon_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"coupon"}}]}}]}},...CouponFragmentDoc.definitions]} as unknown as DocumentNode<CouponQuery, CouponQueryVariables>;
export const InvoiceItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvoiceItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoiceitem_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoiceitem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoiceitem_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoiceitem_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoiceitem"}}]}}]}},...InvoiceitemFragmentDoc.definitions]} as unknown as DocumentNode<InvoiceItemQuery, InvoiceItemQueryVariables>;
export const AgencyStripeAccountInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AgencyStripeAccountInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agency_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customer_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"starting_after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starting_after_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ending_before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ending_before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<AgencyStripeAccountInvoicesQuery, AgencyStripeAccountInvoicesQueryVariables>;
export const InvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Invoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripe_account_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripe_account_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invoice_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoice_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"invoice"}}]}}]}},...InvoiceFragmentDoc.definitions,...AddressFragmentDoc.definitions,...DiscountFragmentDoc.definitions]} as unknown as DocumentNode<InvoiceQuery, InvoiceQueryVariables>;
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
export const OrderDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_checkout_session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stripe_checkout_session"}},{"kind":"Field","name":{"kind":"Name","value":"payment_intent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"payment_intent"}}]}}]}}]}}]}},...OrderFragmentDoc.definitions,...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions,...Stripe_Checkout_SessionFragmentDoc.definitions,...Line_ItemFragmentDoc.definitions,...Stripe_PriceFragmentDoc.definitions,...Payment_IntentFragmentDoc.definitions,...ChargeFragmentDoc.definitions,...Balance_TransactionFragmentDoc.definitions,...AddressFragmentDoc.definitions,...Stripe_CustomerFragmentDoc.definitions]} as unknown as DocumentNode<OrderDetailsQuery, OrderDetailsQueryVariables>;
export const OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_checkout_session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"payment_status"}}]}}]}}]}},...OrderFragmentDoc.definitions,...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const OrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Orders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_by"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"before_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"after_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"order_item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_checkout_session"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"id_ext"}},{"kind":"Field","name":{"kind":"Name","value":"amount_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount_total"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"payment_status"}}]}}]}}]}},...OrderFragmentDoc.definitions,...Order_ItemFragmentDoc.definitions,...PriceFragmentDoc.definitions,...ProductFragmentDoc.definitions,...MarkdownFragmentDoc.definitions]} as unknown as DocumentNode<OrdersQuery, OrdersQueryVariables>;
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