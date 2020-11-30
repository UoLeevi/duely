import { gql } from '@apollo/client';

export const stripe_account_F = gql`
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

export const user_F = gql`
  fragment user_F on User {
    id
    name
    email_address
  }
`;

export const markdown_F = gql`
  fragment markdown_F on Markdown {
    id
    name
    data
  }
`;

export const image_F = gql`
  fragment image_F on Image {
    id
    name
    color
    data
  }
`;

export const theme_F = gql`
  fragment theme_F on Theme {
    id
    image_logo {
      ...image_F
    }
    image_hero {
      ...image_F
    }
  }
  ${image_F}
`;

export const price_F = gql`
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

export const service_variant_F = gql`
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

export const service_F = gql`
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

export const membership_F = gql`
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

export const agency_F = gql`
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

export const subdomain_F = gql`
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
