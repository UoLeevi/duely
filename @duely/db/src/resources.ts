type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];

export type Resources = {
  [K in FilteredKeys<
    ResourceDefinitions,
    Record<'resource', unknown>
  >]: ResourceDefinitions[K]['resource'];
};

export type ResourcesWithState = {
  [K in FilteredKeys<Resources, ResourceState>]: Resources[K];
};

export type Resource = Resources[keyof Resources];
export type ResourceWithState = ResourcesWithState[keyof ResourcesWithState];

export type ResourceId<K extends keyof ResourceDefinitions> =
  `${ResourceDefinitions[K]['prefix']}_${string}`;

export type ResourceName<R extends Resource> = FilteredKeys<Resources, R>;

export type ResourceState = {
  state: ProcessingState;
  error?: string | null;
  processed_at: Date;
};

export type SubdomainResource = {
  id: ResourceId<'subdomain'>;
  name: string;
};

export type AgencyResource = {
  id: ResourceId<'agency'>;
  name: string;
  livemode: boolean;
  subdomain_id: ResourceId<'subdomain'>;
  subscription_plan_id: ResourceId<'subscription plan'>;
  default_pricing_currency: string;
};

export type ThemeResource = {
  id: ResourceId<'theme'>;
  name: string;
  image_logo_id?: ResourceId<'image'> | null;
  image_hero_id?: ResourceId<'image'> | null;
  color_primary?: string | null;
  color_secondary?: string | null;
  color_accent?: string | null;
  color_background?: string | null;
  color_surface?: string | null;
  color_error?: string | null;
  color_success?: string | null;
  agency_id: ResourceId<'agency'>;
};

export type ImageResource = {
  id: ResourceId<'image'>;
  name: string;
  data: string;
  color: string;
  agency_id?: ResourceId<'agency'> | null;
  access: AccessLevel;
};

export type UserResource = {
  id: ResourceId<'user'>;
  name: string;
  email_address: string;
};

export type SignUpResource = {
  id: ResourceId<'sign up'>;
  user_id: ResourceId<'user'>;
  name: string;
  verification_code?: string | null;
  verified?: boolean | null;
  password?: string | null;
  data: object;
  email_address: string;
};

export type PasswordResetResource = {
  id: ResourceId<'password reset'>;
  user_id: ResourceId<'user'>;
  name: string;
  verification_code?: string | null;
  verified?: boolean | null;
  password?: string | null;
  data: object;
  email_address: string;
};

export type ProductResource = {
  id: ResourceId<'product'>;
  agency_id: ResourceId<'agency'>;
  name: string;
  url_name: string;
  status: string;
  active: boolean;
  description?: string | null;
  duration?: string | null;
  image_logo_id?: ResourceId<'image'> | null;
  image_hero_id?: ResourceId<'image'> | null;
  default_price_id?: ResourceId<'price'> | null;
  markdown_description_id?: ResourceId<'markdown'> | null;
  stripe_prod_id_ext_live?: string | null;
  stripe_prod_id_ext_test?: string | null;
};

export type MarkdownResource = {
  id: ResourceId<'markdown'>;
  agency_id?: ResourceId<'agency'> | null;
  name: string;
  data: string;
  access: AccessLevel;
};

export type MembershipResource = {
  id: ResourceId<'membership'>;
  subdomain_id: ResourceId<'subdomain'>;
  user_id: ResourceId<'user'>;
  access: AccessLevel;
};

export type NotificationDefinitionResource = {
  id: ResourceId<'notification definition'>;
  name: string;
  description?: string | null;
  stripe_event?: string | null;
  feed_template?: string | null;
  feed_notification_enabled?: boolean | null;
  feed_notification_default?: boolean | null;
  email_template?: string | null;
  email_notifications_enabled?: boolean | null;
  email_notifications_default?: boolean | null;
};

export type UserNotificationSettingResource = {
  id: ResourceId<'user notification setting'>;
  user_id: ResourceId<'user'>;
  subdomain_id: ResourceId<'subdomain'>;
  notification_definition_id: ResourceId<'notification definition'>;
  feed_notification?: boolean | null;
  email_notification?: boolean | null;
};

export type AgencyThankYouPageSettingResource = {
  id: ResourceId<'agency thank you page setting'>;
  agency_id: ResourceId<'agency'>;
  url: string;
};

export type PageBlockDefinitionResource = {
  id: ResourceId<'page block definition'>;
  page_definition_id: ResourceId<'page definition'>;
  form_id: ResourceId<'form'>;
  name: string;
};

export type ProductThankYouPageSettingResource = {
  id: ResourceId<'product thank you page setting'>;
  product_id: ResourceId<'product'>;
  url: string;
};

export type FormFieldResource = {
  id: ResourceId<'form field'>;
  form_id: ResourceId<'form'>;
  name: string;
  type: string;
  label: string;
  hint?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  required: boolean;
  default?: object | null;
  sort_key: number;
};

export type PageBlockResource = {
  id: ResourceId<'page block'>;
  page_block_definition_id: ResourceId<'page block definition'>;
  page_id: ResourceId<'page'>;
  data: object;
  after_id?: ResourceId<'page block'> | null;
};

export type FormResource = {
  id: ResourceId<'form'>;
};

export type TransactionFeeResource = {
  id: ResourceId<'transaction fee'>;
  subscription_plan_id: ResourceId<'subscription plan'>;
  numerator: number;
  denominator: number;
  fixed_amount: number;
  currency: string;
  transaction_amount_upper_bound?: number | null;
  data: object;
};

export type PageDefinitionResource = {
  id: ResourceId<'page definition'>;
  name: string;
  default_block_uuids: string[];
  url_path: string;
};

export type PageResource = {
  id: ResourceId<'page'>;
  agency_id: ResourceId<'agency'>;
  page_definition_id: ResourceId<'page definition'>;
  access: AccessLevel;
  product_id?: ResourceId<'product'> | null;
  url_path: string;
};

export type StripeAccountResource = {
  id: ResourceId<'stripe account'>;
  agency_id: ResourceId<'agency'>;
  stripe_id_ext: string;
  livemode: boolean;
};

export type SubscriptionPlanResource = {
  id: ResourceId<'subscription plan'>;
  name: string;
  stripe_prod_id_ext_live?: string | null;
  stripe_prod_id_ext_test?: string | null;
  data: object;
};

export type CustomerResource = {
  id: ResourceId<'customer'>;
  name?: string | null;
  email_address: string;
  default_stripe_id_ext: string;
  stripe_account_id: ResourceId<'stripe account'>;
  user_id?: ResourceId<'user'> | null;
};

export type WebhookEventResource = {
  id: ResourceId<'webhook event'>;
  id_ext: string;
  source: string;
  data: object;
  agency_id: ResourceId<'agency'>;
  event_at: Date;
  livemode: boolean;
} & ResourceState;

export type PriceResource = {
  id: ResourceId<'price'>;
  product_id: ResourceId<'product'>;
  type: string;
  unit_amount: number;
  currency: string;
  recurring_interal?: string | null;
  recurring_inteval_count?: number | null;
  stripe_price_id_ext_live?: string | null;
  stripe_price_id_ext_test?: string | null;
  status: string;
  active: boolean;
};

export type OrderResource = {
  id: ResourceId<'order'>;
  customer_id: ResourceId<'customer'>;
  stripe_account_id: ResourceId<'stripe account'>;
  stripe_checkout_session_id_ext: string;
  ordered_at: Date;
} & ResourceState;

export type CredentialTypeResource = {
  id: ResourceId<'credential type'>;
  name: string;
  form_id: ResourceId<'form'>;
};

export type CredentialResource = {
  id: ResourceId<'credential'>;
  name: string;
  credential_type_id: ResourceId<'credential type'>;
  agency_id: ResourceId<'agency'>;
  data: object;
};

export type IntegrationTypeResource = {
  id: ResourceId<'integration type'>;
  name: string;
  title: string;
  status: string;
  form_id: ResourceId<'form'>;
  config_form_id: ResourceId<'form'>;
  credential_type_id: ResourceId<'credential type'>;
  automatic_order_management: boolean;
};

export type IntegrationConfigResource = {
  id: ResourceId<'integration config'>;
  name: string;
  integration_type_id: ResourceId<'integration type'>;
  agency_id: ResourceId<'agency'>;
  credential_id?: ResourceId<'credential'> | null;
  data: object;
};

export type IntegrationResource = {
  id: ResourceId<'integration'>;
  integration_type_id: ResourceId<'integration type'>;
  integration_config_id: ResourceId<'integration config'>;
  agency_id: ResourceId<'agency'>;
  credential_id?: ResourceId<'credential'> | null;
  product_id?: ResourceId<'product'> | null;
  data: object;
};

export type OrderItemResource = {
  id: ResourceId<'order item'>;
  order_id: ResourceId<'order'>;
  price_id: ResourceId<'price'>;
  stripe_line_item_id_ext: string;
} & ResourceState;

export type ResourceDefinitions = {
  subdomain: {
    name: 'subdomain';
    prefix: 'sub';
    table_name: 'subdomain';
    resource: SubdomainResource;
  };
  agency: {
    name: 'agency';
    prefix: 'agcy';
    table_name: 'agency';
    resource: AgencyResource;
  };
  theme: {
    name: 'theme';
    prefix: 'theme';
    table_name: 'theme';
    resource: ThemeResource;
  };
  image: {
    name: 'image';
    prefix: 'img';
    table_name: 'image';
    resource: ImageResource;
  };
  user: {
    name: 'user';
    prefix: 'user';
    table_name: 'user';
    resource: UserResource;
  };
  'sign up': {
    name: 'sign up';
    prefix: 'su';
    table_name: 'sign_up';
    resource: SignUpResource;
  };
  'password reset': {
    name: 'password reset';
    prefix: 'pwd';
    table_name: 'password_reset';
    resource: PasswordResetResource;
  };
  product: {
    name: 'product';
    prefix: 'prod';
    table_name: 'product';
    resource: ProductResource;
  };
  markdown: {
    name: 'markdown';
    prefix: 'md';
    table_name: 'markdown';
    resource: MarkdownResource;
  };
  membership: {
    name: 'membership';
    prefix: 'member';
    table_name: 'membership';
    resource: MembershipResource;
  };
  'notification definition': {
    name: 'notification definition';
    prefix: 'notidef';
    table_name: 'notification_definition';
    resource: NotificationDefinitionResource;
  };
  'user notification setting': {
    name: 'user notification setting';
    prefix: 'set';
    table_name: 'user_notification_setting';
    resoruce: UserNotificationSettingResource;
  };
  form: {
    name: 'form';
    prefix: 'form';
    table_name: 'form';
    resource: FormResource;
  };
  'agency thank you page setting': {
    name: 'agency thank you page setting';
    prefix: 'set';
    table_name: 'agency_thank_you_page_setting';
    resource: AgencyThankYouPageSettingResource;
  };
  'page block definition': {
    name: 'page block definition';
    prefix: 'pblkdef';
    table_name: 'page_block_definition';
    resource: PageBlockDefinitionResource;
  };
  'product thank you page setting': {
    name: 'product thank you page setting';
    prefix: 'set';
    table_name: 'product_thank_you_page_setting';
    resource: ProductThankYouPageSettingResource;
  };
  'form field': {
    name: 'form field';
    prefix: 'formfld';
    table_name: 'form_field';
    resource: FormFieldResource;
  };
  'page block': {
    name: 'page block';
    prefix: 'pblk';
    table_name: 'page_block';
    resource: PageBlockResource;
  };
  'transaction fee': {
    name: 'transaction fee';
    prefix: 'txnfee';
    table_name: 'transaction_fee';
    resource: TransactionFeeResource;
  };
  'page definition': {
    name: 'page definition';
    prefix: 'pagedef';
    table_name: 'page_definition';
    resource: PageDefinitionResource;
  };
  page: {
    name: 'page';
    prefix: 'page';
    table_name: 'page';
    resource: PageResource;
  };
  'stripe account': {
    name: 'stripe account';
    prefix: 'stripe';
    table_name: 'stripe_account';
    resource: StripeAccountResource;
  };
  'subscription plan': {
    name: 'subscription plan';
    prefix: 'subplan';
    table_name: 'subscription_plan';
    resource: SubscriptionPlanResource;
  };
  customer: {
    name: 'customer';
    prefix: 'cus';
    table_name: 'customer';
    resource: CustomerResource;
  };
  'webhook event': {
    name: 'webhook event';
    prefix: 'whevt';
    table_name: 'webhook_event';
    resource: WebhookEventResource;
  };
  price: {
    name: 'price';
    prefix: 'price';
    table_name: 'price';
    resource: PriceResource;
  };
  order: {
    name: 'order';
    prefix: 'ord';
    table_name: 'order';
    resource: OrderResource;
  };
  'credential type': {
    name: 'credential type';
    prefix: 'credtype';
    table_name: 'credential_type';
    resource: CredentialTypeResource;
  };
  credential: {
    name: 'credential';
    prefix: 'cred';
    table_name: 'credential';
    resource: CredentialResource;
  };
  'integration type': {
    name: 'integration type';
    prefix: 'intetype';
    table_name: 'integration_type';
    resource: IntegrationTypeResource;
  };
  'integration config': {
    name: 'integration config';
    prefix: 'inteconf';
    table_name: 'integration_config';
    resource: IntegrationConfigResource;
  };
  integration: {
    name: 'integration';
    prefix: 'inte';
    table_name: 'integration';
    resource: IntegrationResource;
  };
  'order item': {
    name: 'order item';
    prefix: 'orditm';
    table_name: 'order_item';
    resource: OrderItemResource;
  };
};

export type AccessLevel = 'owner' | 'manager' | 'agent' | 'client' | 'public';
export type OperationType = 'query' | 'create' | 'update' | 'delete';
export type ProcessingState = 'pending' | 'processing' | 'processed' | 'failed';
export type VerificationStatus = 'started' | 'verified' | 'cancelled' | 'expired';
