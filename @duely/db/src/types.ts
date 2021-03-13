type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];

export type Resources = {
  [K in FilteredKeys<
    ResourceDefinitions,
    Record<'resource', unknown>
  >]: ResourceDefinitions[K]['resource'];
};

export type Resource<K extends keyof Resources> = Resources[K];

export type ResourceId<
  K extends keyof ResourceDefinitions
> = `${ResourceDefinitions[K]['prefix']}_${string}`;

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
};

export type ThemeResource = {
  id: ResourceId<'theme'>;
  name: string;
  image_logo_id: ResourceId<'image'>;
  image_hero_id: ResourceId<'image'>;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  color_background: string;
  color_surface: string;
  color_error: string;
  color_success: string;
  agency_id: ResourceId<'agency'>;
};

export type ImageResource = {
  id: ResourceId<'image'>;
  name: string;
  data: string;
  color: string;
  agency_id: ResourceId<'agency'>;
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
  data: object;
  email_address: string;
};

export type PasswordResetResource = {
  id: ResourceId<'password reset'>;
  user_id: ResourceId<'user'>;
  name: string;
  data: object;
  email_address: string;
};

export type ProductResource = {
  id: ResourceId<'product'>;
  agency_id: ResourceId<'agency'>;
  name: string;
  url_name: string;
  description: string;
  duration: string;
  image_logo_id: ResourceId<'image'>;
  image_hero_id: ResourceId<'image'>;
  default_price_id: ResourceId<'price'>;
  markdown_description_id: ResourceId<'markdown'>;
  stripe_prod_id_ext_live: string;
  stripe_prod_id_ext_test: string;
  integration_id: ResourceId<'integration'>;
};

export type MarkdownResource = {
  id: ResourceId<'markdown'>;
  agency_id: ResourceId<'agency'>;
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
  description: string;
  stripe_event: string;
  feed_template: string;
  feed_notification_enabled: boolean;
  feed_notification_default: boolean;
  email_template: string;
  email_notifications_enabled: boolean;
  email_notifications_default: boolean;
};

export type UserNotificationSettingResource = {
  id: ResourceId<'user notification setting'>;
  user_id: ResourceId<'user'>;
  subdomain_id: ResourceId<'subdomain'>;
  notification_definition_id: ResourceId<'notification definition'>;
  feed_notification: boolean;
  email_notification: boolean;
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
  default: object;
  sort_key: number;
};

export type PageBlockResource = {
  id: ResourceId<'page block'>;
  page_block_definition_id: ResourceId<'page block definition'>;
  page_id: ResourceId<'page'>;
  data: object;
  after_id: ResourceId<'page block'>;
};

export type FormResource = {
  id: ResourceId<'form'>;
};

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
    resource: AgencyThankYouPageSettingResource
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
  };
  'page definition': {
    name: 'page definition';
    prefix: 'pagedef';
    table_name: 'page_definition';
  };
  page: {
    name: 'page';
    prefix: 'page';
    table_name: 'page';
  };
  'stripe account': {
    name: 'stripe account';
    prefix: 'stripe';
    table_name: 'stripe_account';
  };
  'subscription plan': {
    name: 'subscription plan';
    prefix: 'subplan';
    table_name: 'subscription_plan';
  };
  customer: {
    name: 'customer';
    prefix: 'cus';
    table_name: 'customer';
  };
  'webhook event': {
    name: 'webhook event';
    prefix: 'whevt';
    table_name: 'webhook_event';
  };
  price: {
    name: 'price';
    prefix: 'price';
    table_name: 'price';
  };
  order: {
    name: 'order';
    prefix: 'ord';
    table_name: 'order';
  };
  credential: {
    name: 'credential';
    prefix: 'cred';
    table_name: 'credential';
  };
  integration: {
    name: 'integration';
    prefix: 'inte';
    table_name: 'integration';
  };
  'order item': {
    name: 'order item';
    prefix: 'orditm';
    table_name: 'order_item';
  };
};

export type AccessLevel = 'owner' | 'manager' | 'agent' | 'client' | 'public';
export type OperationType = 'query' | 'create' | 'update' | 'delete';
export type ProcessingState = 'pending' | 'processing' | 'processed' | 'failed';
export type VerificationStatus = 'started' | 'verified' | 'cancelled' | 'expired';
