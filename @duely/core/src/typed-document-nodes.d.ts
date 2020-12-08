import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export declare type Maybe<T> = T | null;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** Date custom scalar type */
    Date: any;
};
export declare type Query = {
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
export declare type QueryUserArgs = {
    id: Scalars['ID'];
};
export declare type QueryUsersArgs = {
    filter: UserFilter;
};
export declare type QueryAgencyArgs = {
    id: Scalars['ID'];
};
export declare type QueryAgenciesArgs = {
    filter: AgencyFilter;
};
export declare type QueryPriceArgs = {
    id: Scalars['ID'];
};
export declare type QueryPricesArgs = {
    filter: PriceFilter;
};
export declare type QueryStripe_AccountArgs = {
    id: Scalars['ID'];
};
export declare type QueryServiceArgs = {
    id: Scalars['ID'];
};
export declare type QueryServicesArgs = {
    filter: ServiceFilter;
};
export declare type QueryService_VariantArgs = {
    id: Scalars['ID'];
};
export declare type QueryService_VariantsArgs = {
    filter: ServiceVariantFilter;
};
export declare type QuerySubdomainArgs = {
    id: Scalars['ID'];
};
export declare type QuerySubdomainsArgs = {
    filter: SubdomainFilter;
};
export declare type QueryImageArgs = {
    id: Scalars['ID'];
};
export declare type QueryImagesArgs = {
    filter: ImageFilter;
};
export declare type QueryMarkdownArgs = {
    id: Scalars['ID'];
};
export declare type QueryMarkdownsArgs = {
    filter: MarkdownFilter;
};
export declare type QueryMembershipArgs = {
    id: Scalars['ID'];
};
export declare type QueryMembershipsArgs = {
    filter: MembershipFilter;
};
export declare type QueryThemeArgs = {
    id: Scalars['ID'];
};
export declare type QueryThemesArgs = {
    filter: ThemeFilter;
};
export declare type User = Node & {
    __typename?: 'User';
    id: Scalars['ID'];
    name: Scalars['String'];
    email_address: Scalars['String'];
    memberships: Array<Membership>;
};
export declare type UserMembershipsArgs = {
    filter?: Maybe<MembershipFilter>;
};
export declare type Node = {
    id: Scalars['ID'];
    name: Scalars['String'];
};
export declare type MembershipFilter = {
    access?: Maybe<AccessLevel>;
    user_id?: Maybe<Scalars['ID']>;
    subdomain_id?: Maybe<Scalars['ID']>;
};
export declare enum AccessLevel {
    Owner = "OWNER",
    Manager = "MANAGER",
    Agent = "AGENT",
    Client = "CLIENT",
    Public = "PUBLIC"
}
export declare type Membership = Node & {
    __typename?: 'Membership';
    id: Scalars['ID'];
    name: Scalars['String'];
    access: AccessLevel;
    user: User;
    subdomain: Subdomain;
};
export declare type Subdomain = Node & {
    __typename?: 'Subdomain';
    id: Scalars['ID'];
    name: Scalars['String'];
    agency: Agency;
    memberships: Array<Membership>;
};
export declare type SubdomainMembershipsArgs = {
    filter?: Maybe<MembershipFilter>;
};
export declare type Agency = Node & {
    __typename?: 'Agency';
    id: Scalars['ID'];
    name: Scalars['String'];
    stripe_account: StripeAccount;
    subdomain: Subdomain;
    theme: Theme;
    services?: Maybe<Array<Service>>;
};
export declare type AgencyServicesArgs = {
    filter?: Maybe<ServiceFilter>;
};
export declare type StripeAccount = {
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
export declare type StripeAccountBalance_TransactionsArgs = {
    payout_id?: Maybe<Scalars['ID']>;
    type?: Maybe<Scalars['String']>;
    available_on?: Maybe<Scalars['Date']>;
    created?: Maybe<Scalars['Date']>;
    currency?: Maybe<Scalars['String']>;
    starting_after_id?: Maybe<Scalars['String']>;
    ending_before_id?: Maybe<Scalars['String']>;
    limit?: Maybe<Scalars['Int']>;
};
export declare type StripeAccountPayment_IntentsArgs = {
    customer_id?: Maybe<Scalars['ID']>;
    created?: Maybe<Scalars['Date']>;
    starting_after_id?: Maybe<Scalars['String']>;
    ending_before_id?: Maybe<Scalars['String']>;
    limit?: Maybe<Scalars['Int']>;
};
export declare type StripeAccountCustomersArgs = {
    email?: Maybe<Scalars['String']>;
    created?: Maybe<Scalars['Date']>;
    starting_after_id?: Maybe<Scalars['String']>;
    ending_before_id?: Maybe<Scalars['String']>;
    limit?: Maybe<Scalars['Int']>;
};
export declare type StripeAccountLink = {
    __typename?: 'StripeAccountLink';
    type: Scalars['String'];
    url: Scalars['String'];
    created: Scalars['Date'];
    expires_at: Scalars['Date'];
};
export declare type StripeBalance = {
    __typename?: 'StripeBalance';
    available: Array<StripeCurrencyBalance>;
    pending: Array<StripeCurrencyBalance>;
    connect_reserved?: Maybe<Array<StripeCurrencyBalance>>;
    instant_available?: Maybe<Array<StripeCurrencyBalance>>;
};
export declare type StripeCurrencyBalance = {
    __typename?: 'StripeCurrencyBalance';
    amount: Scalars['Int'];
    currency: Scalars['String'];
    source_types: StripeBalanceSource;
};
export declare type StripeBalanceSource = {
    __typename?: 'StripeBalanceSource';
    bank_account?: Maybe<Scalars['Int']>;
    card?: Maybe<Scalars['Int']>;
};
export declare type BalanceTransaction = {
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
export declare type BalanceTransactionFeeDetails = {
    __typename?: 'BalanceTransactionFeeDetails';
    amount: Scalars['Int'];
    application?: Maybe<Scalars['String']>;
    currency: Scalars['String'];
    description?: Maybe<Scalars['String']>;
    type: Scalars['String'];
};
export declare type PaymentIntent = {
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
export declare type Charge = {
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
export declare type BillingDetails = {
    __typename?: 'BillingDetails';
    address?: Maybe<Address>;
    email?: Maybe<Scalars['String']>;
    name?: Maybe<Scalars['String']>;
    phone?: Maybe<Scalars['String']>;
};
export declare type Address = {
    __typename?: 'Address';
    city?: Maybe<Scalars['String']>;
    country?: Maybe<Scalars['String']>;
    line1?: Maybe<Scalars['String']>;
    line2?: Maybe<Scalars['String']>;
    postal_code?: Maybe<Scalars['String']>;
    state?: Maybe<Scalars['String']>;
};
export declare type StripeCustomer = {
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
export declare type FraudDetails = {
    __typename?: 'FraudDetails';
    stripe_report?: Maybe<Scalars['String']>;
    user_report?: Maybe<Scalars['String']>;
};
export declare type Outcome = {
    __typename?: 'Outcome';
    network_status?: Maybe<Scalars['String']>;
    reason?: Maybe<Scalars['String']>;
    risk_level?: Maybe<Scalars['String']>;
    risk_score?: Maybe<Scalars['Int']>;
    rule?: Maybe<OutcomeRule>;
    seller_message?: Maybe<Scalars['String']>;
    type?: Maybe<Scalars['String']>;
};
export declare type OutcomeRule = {
    __typename?: 'OutcomeRule';
    action?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['String']>;
    predicate?: Maybe<Scalars['String']>;
};
export declare type Shipping = {
    __typename?: 'Shipping';
    address?: Maybe<Address>;
    carrier?: Maybe<Scalars['String']>;
    name?: Maybe<Scalars['String']>;
    phone?: Maybe<Scalars['String']>;
    tracking_number?: Maybe<Scalars['String']>;
};
export declare type BusinessProfile = {
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
export declare type StripeCapabilities = {
    __typename?: 'StripeCapabilities';
    card_payments?: Maybe<Scalars['String']>;
    transfers?: Maybe<Scalars['String']>;
};
export declare type StripeRequirements = {
    __typename?: 'StripeRequirements';
    current_deadline?: Maybe<Scalars['String']>;
    disabled_reason?: Maybe<Scalars['String']>;
    currently_due: Array<Maybe<Scalars['String']>>;
    eventually_due: Array<Maybe<Scalars['String']>>;
    past_due: Array<Maybe<Scalars['String']>>;
    pending_verification: Array<Maybe<Scalars['String']>>;
};
export declare type StripeSettings = {
    __typename?: 'StripeSettings';
    branding?: Maybe<StripeBranding>;
};
export declare type StripeBranding = {
    __typename?: 'StripeBranding';
    icon?: Maybe<Scalars['String']>;
    logo?: Maybe<Scalars['String']>;
    primary_color?: Maybe<Scalars['String']>;
    secondary_color?: Maybe<Scalars['String']>;
};
export declare type Theme = Node & {
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
export declare type Image = Node & {
    __typename?: 'Image';
    id: Scalars['ID'];
    name: Scalars['String'];
    data: Scalars['String'];
    color: Scalars['String'];
    agency?: Maybe<Agency>;
    access: AccessLevel;
};
export declare type ServiceFilter = {
    name?: Maybe<Scalars['String']>;
    agency_id?: Maybe<Scalars['ID']>;
    url_name?: Maybe<Scalars['String']>;
};
export declare type Service = Node & {
    __typename?: 'Service';
    id: Scalars['ID'];
    name: Scalars['String'];
    url_name: Scalars['String'];
    status: Scalars['String'];
    agency: Agency;
    default_variant: ServiceVariant;
    variants?: Maybe<Array<ServiceVariant>>;
};
export declare type ServiceVariantsArgs = {
    filter?: Maybe<ServiceVariantFilter>;
};
export declare type ServiceVariant = Node & {
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
export declare type ServiceVariantPricesArgs = {
    filter?: Maybe<PriceFilter>;
};
export declare type Price = Node & {
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
export declare type PriceFilter = {
    service_variant_id?: Maybe<Scalars['ID']>;
};
export declare type Markdown = Node & {
    __typename?: 'Markdown';
    id: Scalars['ID'];
    name: Scalars['String'];
    data: Scalars['String'];
    agency?: Maybe<Agency>;
    access: AccessLevel;
};
export declare type ServiceVariantFilter = {
    name?: Maybe<Scalars['String']>;
    service_id?: Maybe<Scalars['ID']>;
};
export declare type UserFilter = {
    name?: Maybe<Scalars['String']>;
    email_address?: Maybe<Scalars['String']>;
};
export declare type AgencyFilter = {
    name?: Maybe<Scalars['String']>;
};
export declare type SubdomainFilter = {
    name?: Maybe<Scalars['String']>;
};
export declare type ImageFilter = {
    name?: Maybe<Scalars['String']>;
    agency_id?: Maybe<Scalars['ID']>;
};
export declare type MarkdownFilter = {
    name?: Maybe<Scalars['String']>;
    agency_id?: Maybe<Scalars['ID']>;
};
export declare type ThemeFilter = {
    name?: Maybe<Scalars['String']>;
    agency_id?: Maybe<Scalars['String']>;
};
export declare type Mutation = {
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
    create_price: PriceMutationResult;
    update_price: PriceMutationResult;
    delete_price: PriceMutationResult;
    create_stripe_checkout_session: CreateStripeCheckoutSessionResult;
    create_service: ServiceMutationResult;
    update_service: ServiceMutationResult;
    delete_service: ServiceMutationResult;
    create_service_variant: ServiceVariantMutationResult;
    update_service_variant: ServiceVariantMutationResult;
    delete_service_variant: ServiceVariantMutationResult;
    create_image: ImageMutationResult;
    update_image: ImageMutationResult;
    create_markdown: MarkdownMutationResult;
    update_markdown: MarkdownMutationResult;
    update_theme: UpdateThemeResult;
};
export declare type MutationLog_InArgs = {
    email_address: Scalars['String'];
    password: Scalars['String'];
};
export declare type MutationStart_Sign_UpArgs = {
    email_address: Scalars['String'];
    password: Scalars['String'];
    name: Scalars['String'];
    redirect_url?: Maybe<Scalars['String']>;
};
export declare type MutationVerify_Sign_UpArgs = {
    verification_code: Scalars['String'];
};
export declare type MutationStart_Password_ResetArgs = {
    email_address: Scalars['String'];
    redirect_url?: Maybe<Scalars['String']>;
};
export declare type MutationVerify_Password_ResetArgs = {
    verification_code: Scalars['String'];
    password: Scalars['String'];
};
export declare type MutationCreate_AgencyArgs = {
    name: Scalars['String'];
    subdomain_name: Scalars['String'];
    country_code: Scalars['String'];
    image_logo: ImageInput;
    return_url: Scalars['String'];
};
export declare type MutationDelete_AgencyArgs = {
    agency_id: Scalars['ID'];
};
export declare type MutationCreate_PriceArgs = {
    service_variant_id: Scalars['ID'];
    unit_amount: Scalars['Int'];
    currency: Scalars['String'];
    recurring_interval?: Maybe<Scalars['String']>;
    recurring_interval_count?: Maybe<Scalars['Int']>;
    status?: Maybe<Scalars['String']>;
};
export declare type MutationUpdate_PriceArgs = {
    price_id: Scalars['ID'];
    status: Scalars['String'];
};
export declare type MutationDelete_PriceArgs = {
    price_id: Scalars['ID'];
};
export declare type MutationCreate_Stripe_Checkout_SessionArgs = {
    price_id: Scalars['ID'];
};
export declare type MutationCreate_ServiceArgs = {
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
export declare type MutationUpdate_ServiceArgs = {
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
export declare type MutationDelete_ServiceArgs = {
    service_id: Scalars['ID'];
};
export declare type MutationCreate_Service_VariantArgs = {
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
export declare type MutationUpdate_Service_VariantArgs = {
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
export declare type MutationDelete_Service_VariantArgs = {
    service_variant_id: Scalars['ID'];
};
export declare type MutationCreate_ImageArgs = {
    agency_id?: Maybe<Scalars['ID']>;
    name: Scalars['String'];
    data: Scalars['String'];
    color: Scalars['String'];
    access?: Maybe<AccessLevel>;
};
export declare type MutationUpdate_ImageArgs = {
    image_id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
    data?: Maybe<Scalars['String']>;
    color?: Maybe<Scalars['String']>;
    access?: Maybe<AccessLevel>;
};
export declare type MutationCreate_MarkdownArgs = {
    agency_id?: Maybe<Scalars['ID']>;
    name: Scalars['String'];
    data: Scalars['String'];
    access?: Maybe<AccessLevel>;
};
export declare type MutationUpdate_MarkdownArgs = {
    markdown_id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
    data?: Maybe<Scalars['String']>;
    access?: Maybe<AccessLevel>;
};
export declare type MutationUpdate_ThemeArgs = {
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
export declare type BeginVisitResult = MutationResult & {
    __typename?: 'BeginVisitResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    jwt?: Maybe<Scalars['String']>;
};
export declare type MutationResult = {
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
};
export declare type SimpleResult = MutationResult & {
    __typename?: 'SimpleResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
};
export declare type LogInResult = MutationResult & {
    __typename?: 'LogInResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    jwt?: Maybe<Scalars['String']>;
};
export declare type ImageInput = {
    name: Scalars['String'];
    data: Scalars['String'];
    color: Scalars['String'];
};
export declare type CreateAgencyResult = MutationResult & {
    __typename?: 'CreateAgencyResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    agency?: Maybe<Agency>;
    stripe_verification_url?: Maybe<Scalars['String']>;
};
export declare type DeleteAgencyResult = MutationResult & {
    __typename?: 'DeleteAgencyResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    agency?: Maybe<Agency>;
};
export declare type PriceMutationResult = MutationResult & {
    __typename?: 'PriceMutationResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    price?: Maybe<Price>;
};
export declare type CreateStripeCheckoutSessionResult = MutationResult & {
    __typename?: 'CreateStripeCheckoutSessionResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    checkout_session_id?: Maybe<Scalars['String']>;
};
export declare type ServiceMutationResult = MutationResult & {
    __typename?: 'ServiceMutationResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    service?: Maybe<Service>;
};
export declare type ServiceVariantMutationResult = MutationResult & {
    __typename?: 'ServiceVariantMutationResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    service_variant?: Maybe<ServiceVariant>;
};
export declare type ImageMutationResult = MutationResult & {
    __typename?: 'ImageMutationResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    image?: Maybe<Image>;
};
export declare type MarkdownMutationResult = MutationResult & {
    __typename?: 'MarkdownMutationResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    markdown?: Maybe<Markdown>;
};
export declare type UpdateThemeResult = MutationResult & {
    __typename?: 'UpdateThemeResult';
    success: Scalars['Boolean'];
    message?: Maybe<Scalars['String']>;
    theme?: Maybe<Theme>;
};
export declare type Connection = {
    edges: Array<Edge>;
};
export declare type ConnectionEdgesArgs = {
    ids?: Maybe<Array<Scalars['ID']>>;
};
export declare type Edge = {
    cursor?: Maybe<Scalars['String']>;
    node: Node;
};
export declare type Stripe_AccountFragment = ({
    __typename?: 'StripeAccount';
} & Pick<StripeAccount, 'id' | 'id_ext' | 'business_type' | 'charges_enabled' | 'country' | 'created' | 'default_currency' | 'details_submitted' | 'email' | 'payouts_enabled'> & {
    business_profile: ({
        __typename?: 'BusinessProfile';
    } & Pick<BusinessProfile, 'mcc' | 'name' | 'product_description' | 'support_address' | 'support_email' | 'support_phone' | 'support_url' | 'url'>);
    capabilities: ({
        __typename?: 'StripeCapabilities';
    } & Pick<StripeCapabilities, 'card_payments' | 'transfers'>);
    requirements: ({
        __typename?: 'StripeRequirements';
    } & Pick<StripeRequirements, 'current_deadline' | 'disabled_reason' | 'currently_due' | 'eventually_due' | 'past_due' | 'pending_verification'>);
    settings: ({
        __typename?: 'StripeSettings';
    } & {
        branding?: Maybe<({
            __typename?: 'StripeBranding';
        } & Pick<StripeBranding, 'icon' | 'logo' | 'primary_color' | 'secondary_color'>)>;
    });
});
export declare type AddressFragment = ({
    __typename?: 'Address';
} & Pick<Address, 'city' | 'country' | 'line1' | 'line2' | 'postal_code' | 'state'>);
export declare type UserFragment = ({
    __typename?: 'User';
} & Pick<User, 'id' | 'name' | 'email_address'>);
export declare type MarkdownFragment = ({
    __typename?: 'Markdown';
} & Pick<Markdown, 'id' | 'name' | 'data'>);
export declare type ImageFragment = ({
    __typename?: 'Image';
} & Pick<Image, 'id' | 'name' | 'color' | 'data' | 'access'>);
export declare type ThemeFragment = ({
    __typename?: 'Theme';
} & Pick<Theme, 'id' | 'color_primary' | 'color_secondary' | 'color_accent' | 'color_background' | 'color_surface' | 'color_error' | 'color_success'> & {
    image_logo?: Maybe<({
        __typename?: 'Image';
    } & ImageFragment)>;
    image_hero?: Maybe<({
        __typename?: 'Image';
    } & ImageFragment)>;
});
export declare type PriceFragment = ({
    __typename?: 'Price';
} & Pick<Price, 'id' | 'name' | 'unit_amount' | 'currency' | 'type' | 'recurring_interval' | 'recurring_interval_count'>);
export declare type Balance_TransactionFragment = ({
    __typename?: 'BalanceTransaction';
} & Pick<BalanceTransaction, 'id' | 'id_ext' | 'amount' | 'available_on' | 'created' | 'exchange_rate' | 'currency' | 'description' | 'fee' | 'net' | 'status' | 'reporting_category' | 'type' | 'source'> & {
    fee_details?: Maybe<Array<({
        __typename?: 'BalanceTransactionFeeDetails';
    } & Pick<BalanceTransactionFeeDetails, 'amount' | 'application' | 'currency' | 'description' | 'type'>)>>;
});
export declare type CustomerFragment = ({
    __typename?: 'StripeCustomer';
} & Pick<StripeCustomer, 'id' | 'id_ext' | 'balance' | 'created' | 'currency' | 'delinquent' | 'description' | 'email' | 'invoice_prefix' | 'name' | 'next_invoice_sequence' | 'phone' | 'preferred_locales'> & {
    address?: Maybe<({
        __typename?: 'Address';
    } & AddressFragment)>;
});
export declare type ChargeFragment = ({
    __typename?: 'Charge';
} & Pick<Charge, 'id' | 'id_ext' | 'amount' | 'amount_capturable' | 'amount_received' | 'application_fee_amount' | 'authorization_code' | 'calculated_statement_descriptor' | 'captured' | 'created' | 'currency' | 'description' | 'disputed' | 'failure_code' | 'failure_message' | 'invoice' | 'order' | 'paid' | 'payment_method' | 'receipt_email' | 'receipt_number' | 'receipt_url' | 'refunded' | 'source_transfer' | 'statement_descriptor' | 'statement_descriptor_suffix' | 'status' | 'transfer' | 'transfer_group'> & {
    balance_transaction?: Maybe<({
        __typename?: 'BalanceTransaction';
    } & Balance_TransactionFragment)>;
    billing_details?: Maybe<({
        __typename?: 'BillingDetails';
    } & Pick<BillingDetails, 'email' | 'name' | 'phone'> & {
        address?: Maybe<({
            __typename?: 'Address';
        } & AddressFragment)>;
    })>;
    customer?: Maybe<({
        __typename?: 'StripeCustomer';
    } & Pick<StripeCustomer, 'id'>)>;
    fraud_details?: Maybe<({
        __typename?: 'FraudDetails';
    } & Pick<FraudDetails, 'stripe_report' | 'user_report'>)>;
    outcome?: Maybe<({
        __typename?: 'Outcome';
    } & Pick<Outcome, 'network_status' | 'reason' | 'risk_level' | 'risk_score' | 'seller_message' | 'type'> & {
        rule?: Maybe<({
            __typename?: 'OutcomeRule';
        } & Pick<OutcomeRule, 'action' | 'id' | 'predicate'>)>;
    })>;
    payment_intent?: Maybe<({
        __typename?: 'PaymentIntent';
    } & Pick<PaymentIntent, 'id'>)>;
});
export declare type Payment_IntentFragment = ({
    __typename?: 'PaymentIntent';
} & Pick<PaymentIntent, 'id' | 'id_ext' | 'amount' | 'amount_capturable' | 'amount_received' | 'application_fee_amount' | 'canceled_at' | 'cancellation_reason' | 'capture_method' | 'confirmation_method' | 'created' | 'currency' | 'description' | 'invoice' | 'on_behalf_of' | 'payment_method' | 'payment_method_types' | 'receipt_email' | 'setup_future_usage' | 'statement_descriptor' | 'statement_descriptor_suffix' | 'status' | 'transfer_group'> & {
    charges?: Maybe<Array<Maybe<({
        __typename?: 'Charge';
    } & ChargeFragment)>>>;
    customer?: Maybe<({
        __typename?: 'StripeCustomer';
    } & CustomerFragment)>;
    shipping?: Maybe<({
        __typename?: 'Shipping';
    } & Pick<Shipping, 'carrier' | 'name' | 'phone' | 'tracking_number'> & {
        address?: Maybe<({
            __typename?: 'Address';
        } & AddressFragment)>;
    })>;
});
export declare type Service_VariantFragment = ({
    __typename?: 'ServiceVariant';
} & Pick<ServiceVariant, 'id' | 'name' | 'description' | 'duration' | 'status'> & {
    default_price?: Maybe<({
        __typename?: 'Price';
    } & PriceFragment)>;
    prices?: Maybe<Array<({
        __typename?: 'Price';
    } & PriceFragment)>>;
    image_logo?: Maybe<({
        __typename?: 'Image';
    } & ImageFragment)>;
    image_hero?: Maybe<({
        __typename?: 'Image';
    } & ImageFragment)>;
    markdown_description?: Maybe<({
        __typename?: 'Markdown';
    } & MarkdownFragment)>;
});
export declare type ServiceFragment = ({
    __typename?: 'Service';
} & Pick<Service, 'id' | 'name' | 'url_name'> & {
    agency: ({
        __typename?: 'Agency';
    } & Pick<Agency, 'id'>);
    default_variant: ({
        __typename?: 'ServiceVariant';
    } & Service_VariantFragment);
    variants?: Maybe<Array<({
        __typename?: 'ServiceVariant';
    } & Service_VariantFragment)>>;
});
export declare type MembershipFragment = ({
    __typename?: 'Membership';
} & Pick<Membership, 'id' | 'access'> & {
    user: ({
        __typename?: 'User';
    } & UserFragment);
    subdomain: ({
        __typename?: 'Subdomain';
    } & Pick<Subdomain, 'id'> & {
        agency: ({
            __typename?: 'Agency';
        } & Pick<Agency, 'id'>);
    });
});
export declare type AgencyFragment = ({
    __typename?: 'Agency';
} & Pick<Agency, 'id' | 'name'> & {
    subdomain: ({
        __typename?: 'Subdomain';
    } & Pick<Subdomain, 'id' | 'name'>);
    theme: ({
        __typename?: 'Theme';
    } & ThemeFragment);
});
export declare type SubdomainFragment = ({
    __typename?: 'Subdomain';
} & Pick<Subdomain, 'id' | 'name'> & {
    agency: ({
        __typename?: 'Agency';
    } & AgencyFragment);
    memberships: Array<({
        __typename?: 'Membership';
    } & MembershipFragment)>;
});
export declare type LogInMutationVariables = Exact<{
    email_address: Scalars['String'];
    password: Scalars['String'];
}>;
export declare type LogInMutation = ({
    __typename?: 'Mutation';
} & {
    log_in: ({
        __typename?: 'LogInResult';
    } & Pick<LogInResult, 'success' | 'message' | 'jwt'>);
});
export declare type LogOutMutationVariables = Exact<{
    [key: string]: never;
}>;
export declare type LogOutMutation = ({
    __typename?: 'Mutation';
} & {
    log_out: ({
        __typename?: 'SimpleResult';
    } & Pick<SimpleResult, 'success' | 'message'>);
});
export declare type VerifyPasswordResetMutationVariables = Exact<{
    verification_code: Scalars['String'];
    password: Scalars['String'];
}>;
export declare type VerifyPasswordResetMutation = ({
    __typename?: 'Mutation';
} & {
    verify_password_reset: ({
        __typename?: 'SimpleResult';
    } & Pick<SimpleResult, 'success' | 'message'>);
});
export declare type VerifySignUpMutationVariables = Exact<{
    verification_code: Scalars['String'];
}>;
export declare type VerifySignUpMutation = ({
    __typename?: 'Mutation';
} & {
    verify_sign_up: ({
        __typename?: 'SimpleResult';
    } & Pick<SimpleResult, 'success' | 'message'>);
});
export declare type StartPasswordResetMutationVariables = Exact<{
    email_address: Scalars['String'];
    redirect_url?: Maybe<Scalars['String']>;
}>;
export declare type StartPasswordResetMutation = ({
    __typename?: 'Mutation';
} & {
    start_password_reset: ({
        __typename?: 'SimpleResult';
    } & Pick<SimpleResult, 'success' | 'message'>);
});
export declare type StartSignUpMutationVariables = Exact<{
    email_address: Scalars['String'];
    password: Scalars['String'];
    name: Scalars['String'];
    redirect_url?: Maybe<Scalars['String']>;
}>;
export declare type StartSignUpMutation = ({
    __typename?: 'Mutation';
} & {
    start_sign_up: ({
        __typename?: 'SimpleResult';
    } & Pick<SimpleResult, 'success' | 'message'>);
});
export declare type CreateAgencyMutationVariables = Exact<{
    name: Scalars['String'];
    subdomain_name: Scalars['String'];
    country_code: Scalars['String'];
    image_logo: ImageInput;
    return_url: Scalars['String'];
}>;
export declare type CreateAgencyMutation = ({
    __typename?: 'Mutation';
} & {
    create_agency: ({
        __typename?: 'CreateAgencyResult';
    } & Pick<CreateAgencyResult, 'stripe_verification_url' | 'message' | 'success'> & {
        agency?: Maybe<({
            __typename?: 'Agency';
        } & Pick<Agency, 'id' | 'name'> & {
            subdomain: ({
                __typename?: 'Subdomain';
            } & Pick<Subdomain, 'id' | 'name'>);
        })>;
    });
});
export declare type CreateServiceMutationVariables = Exact<{
    agency_id: Scalars['ID'];
    name: Scalars['String'];
    description: Scalars['String'];
    url_name: Scalars['String'];
    duration?: Maybe<Scalars['String']>;
    image_logo?: Maybe<ImageInput>;
    image_hero?: Maybe<ImageInput>;
    status?: Maybe<Scalars['String']>;
}>;
export declare type CreateServiceMutation = ({
    __typename?: 'Mutation';
} & {
    create_service: ({
        __typename?: 'ServiceMutationResult';
    } & Pick<ServiceMutationResult, 'success' | 'message'> & {
        service?: Maybe<({
            __typename?: 'Service';
        } & ServiceFragment)>;
    });
});
export declare type UpdateServiceMutationVariables = Exact<{
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
export declare type UpdateServiceMutation = ({
    __typename?: 'Mutation';
} & {
    update_service: ({
        __typename?: 'ServiceMutationResult';
    } & Pick<ServiceMutationResult, 'success' | 'message'> & {
        service?: Maybe<({
            __typename?: 'Service';
        } & ServiceFragment)>;
    });
});
export declare type DeleteServiceMutationVariables = Exact<{
    service_id: Scalars['ID'];
}>;
export declare type DeleteServiceMutation = ({
    __typename?: 'Mutation';
} & {
    delete_service: ({
        __typename?: 'ServiceMutationResult';
    } & Pick<ServiceMutationResult, 'success' | 'message'> & {
        service?: Maybe<({
            __typename?: 'Service';
        } & Pick<Service, 'id'>)>;
    });
});
export declare type CreatePriceMutationVariables = Exact<{
    service_variant_id: Scalars['ID'];
    unit_amount: Scalars['Int'];
    currency: Scalars['String'];
    recurring_interval?: Maybe<Scalars['String']>;
    recurring_interval_count?: Maybe<Scalars['Int']>;
    status?: Maybe<Scalars['String']>;
}>;
export declare type CreatePriceMutation = ({
    __typename?: 'Mutation';
} & {
    create_price: ({
        __typename?: 'PriceMutationResult';
    } & Pick<PriceMutationResult, 'success' | 'message'> & {
        price?: Maybe<({
            __typename?: 'Price';
        } & PriceFragment)>;
    });
});
export declare type CurrentUserQueryVariables = Exact<{
    [key: string]: never;
}>;
export declare type CurrentUserQuery = ({
    __typename?: 'Query';
} & {
    current_user?: Maybe<({
        __typename?: 'User';
    } & {
        memberships: Array<({
            __typename?: 'Membership';
        } & MembershipFragment)>;
    } & UserFragment)>;
});
export declare type CountriesQueryVariables = Exact<{
    [key: string]: never;
}>;
export declare type CountriesQuery = ({
    __typename?: 'Query';
} & Pick<Query, 'country_codes'>);
export declare type ServicesAgreementQueryVariables = Exact<{
    [key: string]: never;
}>;
export declare type ServicesAgreementQuery = ({
    __typename?: 'Query';
} & {
    markdowns?: Maybe<Array<({
        __typename?: 'Markdown';
    } & MarkdownFragment)>>;
});
export declare type AgencyStripeAccountUpdateUrlQueryVariables = Exact<{
    agency_id: Scalars['ID'];
}>;
export declare type AgencyStripeAccountUpdateUrlQuery = ({
    __typename?: 'Query';
} & {
    agency?: Maybe<({
        __typename?: 'Agency';
    } & {
        stripe_account: ({
            __typename?: 'StripeAccount';
        } & {
            account_update_url: ({
                __typename?: 'StripeAccountLink';
            } & Pick<StripeAccountLink, 'url'>);
        });
    })>;
});
export declare type AgencyStripeAccountBalanceQueryVariables = Exact<{
    agency_id: Scalars['ID'];
}>;
export declare type AgencyStripeAccountBalanceQuery = ({
    __typename?: 'Query';
} & {
    agency?: Maybe<({
        __typename?: 'Agency';
    } & {
        stripe_account: ({
            __typename?: 'StripeAccount';
        } & Pick<StripeAccount, 'id'> & {
            balance: ({
                __typename?: 'StripeBalance';
            } & {
                available: Array<({
                    __typename?: 'StripeCurrencyBalance';
                } & Pick<StripeCurrencyBalance, 'amount' | 'currency'> & {
                    source_types: ({
                        __typename?: 'StripeBalanceSource';
                    } & Pick<StripeBalanceSource, 'card' | 'bank_account'>);
                })>;
                pending: Array<({
                    __typename?: 'StripeCurrencyBalance';
                } & Pick<StripeCurrencyBalance, 'amount' | 'currency'> & {
                    source_types: ({
                        __typename?: 'StripeBalanceSource';
                    } & Pick<StripeBalanceSource, 'card' | 'bank_account'>);
                })>;
                connect_reserved?: Maybe<Array<({
                    __typename?: 'StripeCurrencyBalance';
                } & Pick<StripeCurrencyBalance, 'amount' | 'currency'> & {
                    source_types: ({
                        __typename?: 'StripeBalanceSource';
                    } & Pick<StripeBalanceSource, 'card' | 'bank_account'>);
                })>>;
            });
        });
    })>;
});
export declare type AgencyStripeAccountBalanceTransactionsQueryVariables = Exact<{
    agency_id: Scalars['ID'];
    created?: Maybe<Scalars['Date']>;
    starting_after_id?: Maybe<Scalars['String']>;
    ending_before_id?: Maybe<Scalars['String']>;
    limit?: Maybe<Scalars['Int']>;
}>;
export declare type AgencyStripeAccountBalanceTransactionsQuery = ({
    __typename?: 'Query';
} & {
    agency?: Maybe<({
        __typename?: 'Agency';
    } & {
        stripe_account: ({
            __typename?: 'StripeAccount';
        } & Pick<StripeAccount, 'id'> & {
            balance_transactions: Array<({
                __typename?: 'BalanceTransaction';
            } & Balance_TransactionFragment)>;
        });
    })>;
});
export declare type AgencyStripeAccountPaymentIntentsQueryVariables = Exact<{
    agency_id: Scalars['ID'];
    created?: Maybe<Scalars['Date']>;
    starting_after_id?: Maybe<Scalars['String']>;
    ending_before_id?: Maybe<Scalars['String']>;
    limit?: Maybe<Scalars['Int']>;
}>;
export declare type AgencyStripeAccountPaymentIntentsQuery = ({
    __typename?: 'Query';
} & {
    agency?: Maybe<({
        __typename?: 'Agency';
    } & {
        stripe_account: ({
            __typename?: 'StripeAccount';
        } & Pick<StripeAccount, 'id'> & {
            payment_intents: Array<({
                __typename?: 'PaymentIntent';
            } & Payment_IntentFragment)>;
        });
    })>;
});
export declare type AgencyStripeAccountCustomersQueryVariables = Exact<{
    agency_id: Scalars['ID'];
    created?: Maybe<Scalars['Date']>;
    starting_after_id?: Maybe<Scalars['String']>;
    ending_before_id?: Maybe<Scalars['String']>;
    limit?: Maybe<Scalars['Int']>;
}>;
export declare type AgencyStripeAccountCustomersQuery = ({
    __typename?: 'Query';
} & {
    agency?: Maybe<({
        __typename?: 'Agency';
    } & {
        stripe_account: ({
            __typename?: 'StripeAccount';
        } & Pick<StripeAccount, 'id'> & {
            customers: Array<({
                __typename?: 'StripeCustomer';
            } & CustomerFragment)>;
        });
    })>;
});
export declare type CurrentUserAgenciesQueryVariables = Exact<{
    [key: string]: never;
}>;
export declare type CurrentUserAgenciesQuery = ({
    __typename?: 'Query';
} & {
    current_user?: Maybe<({
        __typename?: 'User';
    } & Pick<User, 'id'> & {
        memberships: Array<({
            __typename?: 'Membership';
        } & Pick<Membership, 'id' | 'access'> & {
            subdomain: ({
                __typename?: 'Subdomain';
            } & Pick<Subdomain, 'id' | 'name'> & {
                agency: ({
                    __typename?: 'Agency';
                } & {
                    stripe_account: ({
                        __typename?: 'StripeAccount';
                    } & Stripe_AccountFragment);
                } & AgencyFragment);
                memberships: Array<({
                    __typename?: 'Membership';
                } & MembershipFragment)>;
            });
            user: ({
                __typename?: 'User';
            } & Pick<User, 'id'>);
        })>;
    })>;
});
export declare type SubdomainPublicQueryVariables = Exact<{
    subdomain_name: Scalars['String'];
}>;
export declare type SubdomainPublicQuery = ({
    __typename?: 'Query';
} & {
    subdomains?: Maybe<Array<({
        __typename?: 'Subdomain';
    } & Pick<Subdomain, 'id' | 'name'> & {
        agency: ({
            __typename?: 'Agency';
        } & Pick<Agency, 'id' | 'name'> & {
            theme: ({
                __typename?: 'Theme';
            } & ThemeFragment);
        });
    })>>;
});
export declare type AgencyServicesQueryVariables = Exact<{
    agency_id: Scalars['ID'];
}>;
export declare type AgencyServicesQuery = ({
    __typename?: 'Query';
} & {
    agency?: Maybe<({
        __typename?: 'Agency';
    } & Pick<Agency, 'id'> & {
        services?: Maybe<Array<({
            __typename?: 'Service';
        } & ServiceFragment)>>;
    })>;
});
export declare type ServiceQueryVariables = Exact<{
    service_id: Scalars['ID'];
}>;
export declare type ServiceQuery = ({
    __typename?: 'Query';
} & {
    service?: Maybe<({
        __typename?: 'Service';
    } & ServiceFragment)>;
});
export declare type SubdomainAgencyQueryVariables = Exact<{
    subdomain_name: Scalars['String'];
}>;
export declare type SubdomainAgencyQuery = ({
    __typename?: 'Query';
} & {
    subdomains?: Maybe<Array<({
        __typename?: 'Subdomain';
    } & Pick<Subdomain, 'id' | 'name'> & {
        agency: ({
            __typename?: 'Agency';
        } & {
            services?: Maybe<Array<({
                __typename?: 'Service';
            } & ServiceFragment)>>;
        } & AgencyFragment);
    })>>;
});
export declare type SubdomainAgencyStripeAccountUpdateUrlQueryVariables = Exact<{
    subdomain_name: Scalars['String'];
}>;
export declare type SubdomainAgencyStripeAccountUpdateUrlQuery = ({
    __typename?: 'Query';
} & {
    subdomains?: Maybe<Array<({
        __typename?: 'Subdomain';
    } & Pick<Subdomain, 'id' | 'name'> & {
        agency: ({
            __typename?: 'Agency';
        } & {
            stripe_account: ({
                __typename?: 'StripeAccount';
            } & {
                account_update_url: ({
                    __typename?: 'StripeAccountLink';
                } & Pick<StripeAccountLink, 'url'>);
            });
        });
    })>>;
});
export declare const Stripe_AccountFragmentDoc: DocumentNode<Stripe_AccountFragment, unknown>;
export declare const Balance_TransactionFragmentDoc: DocumentNode<Balance_TransactionFragment, unknown>;
export declare const AddressFragmentDoc: DocumentNode<AddressFragment, unknown>;
export declare const ChargeFragmentDoc: DocumentNode<ChargeFragment, unknown>;
export declare const CustomerFragmentDoc: DocumentNode<CustomerFragment, unknown>;
export declare const Payment_IntentFragmentDoc: DocumentNode<Payment_IntentFragment, unknown>;
export declare const PriceFragmentDoc: DocumentNode<PriceFragment, unknown>;
export declare const ImageFragmentDoc: DocumentNode<ImageFragment, unknown>;
export declare const MarkdownFragmentDoc: DocumentNode<MarkdownFragment, unknown>;
export declare const Service_VariantFragmentDoc: DocumentNode<Service_VariantFragment, unknown>;
export declare const ServiceFragmentDoc: DocumentNode<ServiceFragment, unknown>;
export declare const ThemeFragmentDoc: DocumentNode<ThemeFragment, unknown>;
export declare const AgencyFragmentDoc: DocumentNode<AgencyFragment, unknown>;
export declare const UserFragmentDoc: DocumentNode<UserFragment, unknown>;
export declare const MembershipFragmentDoc: DocumentNode<MembershipFragment, unknown>;
export declare const SubdomainFragmentDoc: DocumentNode<SubdomainFragment, unknown>;
export declare const LogInDocument: DocumentNode<LogInMutation, LogInMutationVariables>;
export declare const LogOutDocument: DocumentNode<LogOutMutation, LogOutMutationVariables>;
export declare const VerifyPasswordResetDocument: DocumentNode<VerifyPasswordResetMutation, VerifyPasswordResetMutationVariables>;
export declare const VerifySignUpDocument: DocumentNode<VerifySignUpMutation, VerifySignUpMutationVariables>;
export declare const StartPasswordResetDocument: DocumentNode<StartPasswordResetMutation, StartPasswordResetMutationVariables>;
export declare const StartSignUpDocument: DocumentNode<StartSignUpMutation, StartSignUpMutationVariables>;
export declare const CreateAgencyDocument: DocumentNode<CreateAgencyMutation, CreateAgencyMutationVariables>;
export declare const CreateServiceDocument: DocumentNode<CreateServiceMutation, CreateServiceMutationVariables>;
export declare const UpdateServiceDocument: DocumentNode<UpdateServiceMutation, UpdateServiceMutationVariables>;
export declare const DeleteServiceDocument: DocumentNode<DeleteServiceMutation, DeleteServiceMutationVariables>;
export declare const CreatePriceDocument: DocumentNode<CreatePriceMutation, CreatePriceMutationVariables>;
export declare const CurrentUserDocument: DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export declare const CountriesDocument: DocumentNode<CountriesQuery, CountriesQueryVariables>;
export declare const ServicesAgreementDocument: DocumentNode<ServicesAgreementQuery, ServicesAgreementQueryVariables>;
export declare const AgencyStripeAccountUpdateUrlDocument: DocumentNode<AgencyStripeAccountUpdateUrlQuery, AgencyStripeAccountUpdateUrlQueryVariables>;
export declare const AgencyStripeAccountBalanceDocument: DocumentNode<AgencyStripeAccountBalanceQuery, AgencyStripeAccountBalanceQueryVariables>;
export declare const AgencyStripeAccountBalanceTransactionsDocument: DocumentNode<AgencyStripeAccountBalanceTransactionsQuery, AgencyStripeAccountBalanceTransactionsQueryVariables>;
export declare const AgencyStripeAccountPaymentIntentsDocument: DocumentNode<AgencyStripeAccountPaymentIntentsQuery, AgencyStripeAccountPaymentIntentsQueryVariables>;
export declare const AgencyStripeAccountCustomersDocument: DocumentNode<AgencyStripeAccountCustomersQuery, AgencyStripeAccountCustomersQueryVariables>;
export declare const CurrentUserAgenciesDocument: DocumentNode<CurrentUserAgenciesQuery, CurrentUserAgenciesQueryVariables>;
export declare const SubdomainPublicDocument: DocumentNode<SubdomainPublicQuery, SubdomainPublicQueryVariables>;
export declare const AgencyServicesDocument: DocumentNode<AgencyServicesQuery, AgencyServicesQueryVariables>;
export declare const ServiceDocument: DocumentNode<ServiceQuery, ServiceQueryVariables>;
export declare const SubdomainAgencyDocument: DocumentNode<SubdomainAgencyQuery, SubdomainAgencyQueryVariables>;
export declare const SubdomainAgencyStripeAccountUpdateUrlDocument: DocumentNode<SubdomainAgencyStripeAccountUpdateUrlQuery, SubdomainAgencyStripeAccountUpdateUrlQueryVariables>;
