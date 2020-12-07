import { Address, Agency, Image, Markdown, Membership, Price, Service, ServiceVariant, StripeAccount, Subdomain, Theme, User } from '@duely/core';
import { gql, TypedDocumentNode } from '@apollo/client';

export const stripe_account_F: TypedDocumentNode<StripeAccount> = gql`
  fragment stripe_account_F on StripeAccount {
    id
    id_ext
    business_profile {
      mcc
      name
      product_description
      support_address
      support_email
      support_phone
      support_url
      url
    }
    business_type
    capabilities {
      card_payments
      transfers
    }
    requirements {
      current_deadline
      disabled_reason
      currently_due
      eventually_due
      past_due
      pending_verification
    }
    settings {
      branding {
        icon
        logo
        primary_color
        secondary_color
      }
    }
    charges_enabled
    country
    created
    default_currency
    details_submitted
    email
    payouts_enabled
  }
`;

export const address_F: TypedDocumentNode<Address> = gql`
  fragment address_F on Address {
    city
    country
    line1
    line2
    postal_code
    state
  }
`;

export const user_F: TypedDocumentNode<User> = gql`
  fragment user_F on User {
    id
    name
    email_address
  }
`;

export const markdown_F: TypedDocumentNode<Markdown> = gql`
  fragment markdown_F on Markdown {
    id
    name
    data
  }
`;

export const image_F: TypedDocumentNode<Image> = gql`
  fragment image_F on Image {
    id
    name
    color
    data
    access
  }
`;

export const theme_F: TypedDocumentNode<Theme> = gql`
  fragment theme_F on Theme {
    id
    image_logo {
      ...image_F
    }
    image_hero {
      ...image_F
    }
    color_primary
    color_secondary
    color_accent
    color_background
    color_surface
    color_error
    color_success
  }
  ${image_F}
`;

export const price_F: TypedDocumentNode<Price> = gql`
  fragment price_F on Price {
    id
    name
    unit_amount
    currency
    type
    recurring_interval
    recurring_interval_count
  }
`;

export const balance_transaction_F = gql`
  fragment balance_transaction_F on BalanceTransaction {
    id
    id_ext
    amount
    available_on
    created
    exchange_rate
    currency
    description
    fee
    fee_details {
      amount
      application
      currency
      description
      type
    }
    net
    status
    reporting_category
    type
    source
  }
`;

export const customer_F = gql`
  fragment customer_F on StripeCustomer {
    id
    id_ext
    address {
      ...address_F
    }
    balance
    created
    currency
    delinquent
    description
    email
    invoice_prefix
    name
    next_invoice_sequence
    phone
    preferred_locales
  }
  ${address_F}
`;

export const charge_F = gql`
  fragment charge_F on Charge {
    id
    id_ext
    amount
    amount_capturable
    amount_received
    application_fee_amount
    authorization_code
    balance_transaction {
      ...balance_transaction_F
    }
    billing_details {
      address
      email
      name
      phone
    }
    calculated_statement_descriptor
    captured
    created
    currency
    customer {
      id
    }
    description
    disputed
    failure_code
    failure_message
    fraud_details {
      stripe_report
      user_report
    }
    invoice
    order
    outcome {
      network_status
      reason
      risk_level
      risk_score
      rule {
        action
        id
        predicate
      }
      seller_message
      type
    }
    paid
    payment_intent {
      id
    }
    payment_method
    receipt_email
    receipt_number
    receipt_url
    refunded
    source_transfer
    statement_descriptor
    statement_descriptor_suffix
    status
    transfer
    transfer_group
  }
  ${balance_transaction_F}
`;

export const payment_intent_F = gql`
  fragment payment_intent_F on PaymentIntent {
    id
    id_ext
    amount
    amount_capturable
    amount_received
    application_fee_amount
    canceled_at
    cancellation_reason
    capture_method
    charges {
      ...charge_F
    }
    confirmation_method
    created
    currency
    customer {
      ...customer_F
    }
    description
    invoice
    on_behalf_of
    payment_method
    payment_method_types
    receipt_email
    setup_future_usage
    shipping
    statement_descriptor
    statement_descriptor_suffix
    status
    transfer_group
  }
  ${charge_F}
  ${customer_F}
`;

export const service_variant_F: TypedDocumentNode<ServiceVariant> = gql`
  fragment service_variant_F on ServiceVariant {
    id
    name
    description
    duration
    status
    default_price {
      ...price_F
    }
    prices {
      ...price_F
    }
    image_logo {
      ...image_F
    }
    image_hero {
      ...image_F
    }
    markdown_description {
      ...markdown_F
    }
  }
  ${price_F}
  ${image_F}
  ${markdown_F}
`;

export const service_F: TypedDocumentNode<Service> = gql`
  fragment service_F on Service {
    id
    name
    url_name
    agency {
      id
    }
    default_variant {
      ...service_variant_F
    }
    variants {
      ...service_variant_F
    }
  }
  ${service_variant_F}
`;

export const membership_F: TypedDocumentNode<Membership> = gql`
  fragment membership_F on Membership {
    id
    access
    user {
      ...user_F
    }
    subdomain {
      id
      agency {
        id
      }
    }
  }
  ${user_F}
`;

export const agency_F: TypedDocumentNode<Agency> = gql`
  fragment agency_F on Agency {
    id
    name
    subdomain {
      id
      name
    }
    theme {
      ...theme_F
    }
  }
  ${theme_F}
`;

export const subdomain_F: TypedDocumentNode<Subdomain> = gql`
  fragment subdomain_F on Subdomain {
    id
    name
    agency {
      ...agency_F
    }
    memberships {
      ...membership_F
    }
  }
  ${agency_F}
  ${membership_F}
`;
