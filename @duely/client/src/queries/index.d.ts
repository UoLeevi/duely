import { CountriesDocument, CurrentUserDocument, ServicesAgreementDocument, AgencyStripeAccountUpdateUrlDocument, AgencyStripeAccountBalanceDocument, AgencyStripeAccountBalanceTransactionsDocument, AgencyStripeAccountPaymentIntentsDocument, AgencyStripeAccountCustomersDocument, CurrentUserAgenciesDocument, SubdomainPublicDocument, AgencyServicesDocument, ServiceDocument, SubdomainAgencyDocument, SubdomainAgencyStripeAccountUpdateUrlDocument, AgencyThankYouPageSettingDocument, ServiceThankYouPageSettingDocument } from '@duely/core';
import { QueryOptions } from '@apollo/client';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
export interface TypedQueryOptions<TDocumentNode extends TypedDocumentNode<unknown, unknown>> extends QueryOptions<VariablesOf<TDocumentNode>, ResultOf<TDocumentNode>> {
    readonly query: TDocumentNode;
}
export interface QueryDefinition<TData, TVariables extends TBoundVariables, TBoundVariables extends {
    [key: string]: any;
}, TResult> extends Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'variables'> {
    readonly variables?: TBoundVariables;
    readonly result: (data: TData) => TResult;
}
export declare function query<TData, TVariables extends TBoundVariables, TBoundVariables extends {
    [key: string]: any;
}, TResult>(queryDef: QueryDefinition<TData, TVariables, TBoundVariables, TResult>, variables?: Omit<TVariables, keyof typeof queryDef.variables>, options?: Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'query' | 'variables'>): Promise<ReturnType<typeof queryDef.result>>;
export declare const current_user_Q: {
    query: TypedDocumentNode<import("@duely/core").CurrentUserQuery, import("@duely/core").Exact<{
        [key: string]: never;
    }>>;
    notifyOnNetworkStatusChange: boolean;
    result: (d: ResultOf<typeof CurrentUserDocument>) => ({
        __typename?: "User" | undefined;
    } & {
        memberships: ({
            __typename?: "Membership" | undefined;
        } & {
            __typename?: "Membership" | undefined;
        } & Pick<import("@duely/core").Membership, "id" | "access"> & {
            user: {
                __typename?: "User" | undefined;
            } & {
                __typename?: "User" | undefined;
            } & Pick<import("@duely/core").User, "id" | "name" | "email_address">;
            subdomain: {
                __typename?: "Subdomain" | undefined;
            } & Pick<import("@duely/core").Subdomain, "id"> & {
                agency: {
                    __typename?: "Agency" | undefined;
                } & Pick<import("@duely/core").Agency, "id">;
            };
        })[];
    } & {
        __typename?: "User" | undefined;
    } & Pick<import("@duely/core").User, "id" | "name" | "email_address">) | null | undefined;
};
export declare const countries_Q: {
    query: TypedDocumentNode<import("@duely/core").CountriesQuery, import("@duely/core").Exact<{
        [key: string]: never;
    }>>;
    result: (d: ResultOf<typeof CountriesDocument>) => import("@duely/core").Country[] | undefined;
};
export declare const services_agreement_Q: {
    query: TypedDocumentNode<import("@duely/core").ServicesAgreementQuery, import("@duely/core").Exact<{
        [key: string]: never;
    }>>;
    result: (d: ResultOf<typeof ServicesAgreementDocument>) => string | undefined;
};
export declare const agency_stripe_account_update_url_Q: {
    query: TypedDocumentNode<import("@duely/core").AgencyStripeAccountUpdateUrlQuery, import("@duely/core").Exact<{
        agency_id: string;
    }>>;
    fetchPolicy: string;
    result: (d: ResultOf<typeof AgencyStripeAccountUpdateUrlDocument>) => string | undefined;
};
export declare const agency_stripe_account_balance_Q: {
    query: TypedDocumentNode<import("@duely/core").AgencyStripeAccountBalanceQuery, import("@duely/core").Exact<{
        agency_id: string;
    }>>;
    result: (d: ResultOf<typeof AgencyStripeAccountBalanceDocument>) => ({
        __typename?: "StripeBalance" | undefined;
    } & {
        available: ({
            __typename?: "StripeCurrencyBalance" | undefined;
        } & Pick<import("@duely/core").StripeCurrencyBalance, "amount" | "currency"> & {
            source_types: {
                __typename?: "StripeBalanceSource" | undefined;
            } & Pick<import("@duely/core").StripeBalanceSource, "card" | "bank_account">;
        })[];
        pending: ({
            __typename?: "StripeCurrencyBalance" | undefined;
        } & Pick<import("@duely/core").StripeCurrencyBalance, "amount" | "currency"> & {
            source_types: {
                __typename?: "StripeBalanceSource" | undefined;
            } & Pick<import("@duely/core").StripeBalanceSource, "card" | "bank_account">;
        })[];
        connect_reserved?: ({
            __typename?: "StripeCurrencyBalance" | undefined;
        } & Pick<import("@duely/core").StripeCurrencyBalance, "amount" | "currency"> & {
            source_types: {
                __typename?: "StripeBalanceSource" | undefined;
            } & Pick<import("@duely/core").StripeBalanceSource, "card" | "bank_account">;
        })[] | null | undefined;
    }) | undefined;
};
export declare const agency_stripe_account_balance_transactions_Q: {
    query: TypedDocumentNode<import("@duely/core").AgencyStripeAccountBalanceTransactionsQuery, import("@duely/core").Exact<{
        agency_id: string;
        created?: any;
        starting_after_id?: string | null | undefined;
        ending_before_id?: string | null | undefined;
        limit?: number | null | undefined;
    }>>;
    result: (d: ResultOf<typeof AgencyStripeAccountBalanceTransactionsDocument>) => ({
        __typename?: "BalanceTransaction" | undefined;
    } & {
        __typename?: "BalanceTransaction" | undefined;
    } & Pick<import("@duely/core").BalanceTransaction, "id" | "id_ext" | "amount" | "available_on" | "created" | "exchange_rate" | "currency" | "description" | "fee" | "net" | "status" | "reporting_category" | "type" | "source"> & {
        fee_details?: ({
            __typename?: "BalanceTransactionFeeDetails" | undefined;
        } & Pick<import("@duely/core").BalanceTransactionFeeDetails, "amount" | "currency" | "description" | "type" | "application">)[] | null | undefined;
    })[] | undefined;
};
export declare const agency_stripe_account_payment_intents_Q: {
    query: TypedDocumentNode<import("@duely/core").AgencyStripeAccountPaymentIntentsQuery, import("@duely/core").Exact<{
        agency_id: string;
        created?: any;
        starting_after_id?: string | null | undefined;
        ending_before_id?: string | null | undefined;
        limit?: number | null | undefined;
    }>>;
    result: (d: ResultOf<typeof AgencyStripeAccountPaymentIntentsDocument>) => ({
        __typename?: "PaymentIntent" | undefined;
    } & {
        __typename?: "PaymentIntent" | undefined;
    } & Pick<import("@duely/core").PaymentIntent, "id" | "id_ext" | "amount" | "created" | "currency" | "description" | "status" | "amount_capturable" | "amount_received" | "application_fee_amount" | "canceled_at" | "cancellation_reason" | "capture_method" | "confirmation_method" | "invoice" | "on_behalf_of" | "payment_method" | "payment_method_types" | "receipt_email" | "setup_future_usage" | "statement_descriptor" | "statement_descriptor_suffix" | "transfer_group"> & {
        charges?: import("@duely/core").Maybe<{
            __typename?: "Charge" | undefined;
        } & {
            __typename?: "Charge" | undefined;
        } & Pick<import("@duely/core").Charge, "id" | "id_ext" | "amount" | "created" | "currency" | "description" | "status" | "amount_capturable" | "amount_received" | "application_fee_amount" | "invoice" | "payment_method" | "receipt_email" | "statement_descriptor" | "statement_descriptor_suffix" | "transfer_group" | "authorization_code" | "calculated_statement_descriptor" | "captured" | "disputed" | "failure_code" | "failure_message" | "order" | "paid" | "receipt_number" | "receipt_url" | "refunded" | "source_transfer" | "transfer"> & {
            balance_transaction?: ({
                __typename?: "BalanceTransaction" | undefined;
            } & {
                __typename?: "BalanceTransaction" | undefined;
            } & Pick<import("@duely/core").BalanceTransaction, "id" | "id_ext" | "amount" | "available_on" | "created" | "exchange_rate" | "currency" | "description" | "fee" | "net" | "status" | "reporting_category" | "type" | "source"> & {
                fee_details?: ({
                    __typename?: "BalanceTransactionFeeDetails" | undefined;
                } & Pick<import("@duely/core").BalanceTransactionFeeDetails, "amount" | "currency" | "description" | "type" | "application">)[] | null | undefined;
            }) | null | undefined;
            billing_details?: ({
                __typename?: "BillingDetails" | undefined;
            } & Pick<import("@duely/core").BillingDetails, "name" | "email" | "phone"> & {
                address?: ({
                    __typename?: "Address" | undefined;
                } & {
                    __typename?: "Address" | undefined;
                } & Pick<import("@duely/core").Address, "country" | "city" | "line1" | "line2" | "postal_code" | "state">) | null | undefined;
            }) | null | undefined;
            customer?: ({
                __typename?: "StripeCustomer" | undefined;
            } & Pick<import("@duely/core").StripeCustomer, "id">) | null | undefined;
            fraud_details?: ({
                __typename?: "FraudDetails" | undefined;
            } & Pick<import("@duely/core").FraudDetails, "stripe_report" | "user_report">) | null | undefined;
            outcome?: ({
                __typename?: "Outcome" | undefined;
            } & Pick<import("@duely/core").Outcome, "type" | "network_status" | "reason" | "risk_level" | "risk_score" | "seller_message"> & {
                rule?: ({
                    __typename?: "OutcomeRule" | undefined;
                } & Pick<import("@duely/core").OutcomeRule, "id" | "action" | "predicate">) | null | undefined;
            }) | null | undefined;
            payment_intent?: ({
                __typename?: "PaymentIntent" | undefined;
            } & Pick<import("@duely/core").PaymentIntent, "id">) | null | undefined;
        }>[] | null | undefined;
        customer?: ({
            __typename?: "StripeCustomer" | undefined;
        } & {
            __typename?: "StripeCustomer" | undefined;
        } & Pick<import("@duely/core").StripeCustomer, "id" | "name" | "id_ext" | "created" | "currency" | "description" | "balance" | "delinquent" | "email" | "invoice_prefix" | "next_invoice_sequence" | "phone" | "preferred_locales"> & {
            address?: ({
                __typename?: "Address" | undefined;
            } & {
                __typename?: "Address" | undefined;
            } & Pick<import("@duely/core").Address, "country" | "city" | "line1" | "line2" | "postal_code" | "state">) | null | undefined;
        }) | null | undefined;
        shipping?: ({
            __typename?: "Shipping" | undefined;
        } & Pick<import("@duely/core").Shipping, "name" | "phone" | "carrier" | "tracking_number"> & {
            address?: ({
                __typename?: "Address" | undefined;
            } & {
                __typename?: "Address" | undefined;
            } & Pick<import("@duely/core").Address, "country" | "city" | "line1" | "line2" | "postal_code" | "state">) | null | undefined;
        }) | null | undefined;
    })[] | undefined;
};
export declare const agency_stripe_account_customers_Q: {
    query: TypedDocumentNode<import("@duely/core").AgencyStripeAccountCustomersQuery, import("@duely/core").Exact<{
        agency_id: string;
        created?: any;
        starting_after_id?: string | null | undefined;
        ending_before_id?: string | null | undefined;
        limit?: number | null | undefined;
    }>>;
    result: (d: ResultOf<typeof AgencyStripeAccountCustomersDocument>) => ({
        __typename?: "StripeCustomer" | undefined;
    } & {
        __typename?: "StripeCustomer" | undefined;
    } & Pick<import("@duely/core").StripeCustomer, "id" | "name" | "id_ext" | "created" | "currency" | "description" | "balance" | "delinquent" | "email" | "invoice_prefix" | "next_invoice_sequence" | "phone" | "preferred_locales"> & {
        address?: ({
            __typename?: "Address" | undefined;
        } & {
            __typename?: "Address" | undefined;
        } & Pick<import("@duely/core").Address, "country" | "city" | "line1" | "line2" | "postal_code" | "state">) | null | undefined;
    })[] | undefined;
};
export declare const current_user_agencies_Q: {
    query: TypedDocumentNode<import("@duely/core").CurrentUserAgenciesQuery, import("@duely/core").Exact<{
        [key: string]: never;
    }>>;
    notifyOnNetworkStatusChange: boolean;
    result: (d: ResultOf<typeof CurrentUserAgenciesDocument>) => {
        subdomain: {
            __typename?: "Subdomain" | undefined;
        } & Pick<import("@duely/core").Subdomain, "id" | "name"> & {
            agency: {
                __typename?: "Agency" | undefined;
            } & {
                stripe_account: {
                    __typename?: "StripeAccount" | undefined;
                } & {
                    __typename?: "StripeAccount" | undefined;
                } & Pick<import("@duely/core").StripeAccount, "id" | "id_ext" | "created" | "email" | "business_type" | "charges_enabled" | "country" | "default_currency" | "details_submitted" | "payouts_enabled"> & {
                    business_profile: {
                        __typename?: "BusinessProfile" | undefined;
                    } & Pick<import("@duely/core").BusinessProfile, "name" | "url" | "mcc" | "product_description" | "support_address" | "support_email" | "support_phone" | "support_url">;
                    capabilities: {
                        __typename?: "StripeCapabilities" | undefined;
                    } & Pick<import("@duely/core").StripeCapabilities, "card_payments" | "transfers">;
                    requirements: {
                        __typename?: "StripeRequirements" | undefined;
                    } & Pick<import("@duely/core").StripeRequirements, "current_deadline" | "disabled_reason" | "currently_due" | "eventually_due" | "past_due" | "pending_verification">;
                    settings: {
                        __typename?: "StripeSettings" | undefined;
                    } & {
                        branding?: ({
                            __typename?: "StripeBranding" | undefined;
                        } & Pick<import("@duely/core").StripeBranding, "icon" | "logo" | "primary_color" | "secondary_color">) | null | undefined;
                    };
                };
            } & {
                __typename?: "Agency" | undefined;
            } & Pick<import("@duely/core").Agency, "id" | "name"> & {
                subdomain: {
                    __typename?: "Subdomain" | undefined;
                } & Pick<import("@duely/core").Subdomain, "id" | "name">;
                theme: {
                    __typename?: "Theme" | undefined;
                } & {
                    __typename?: "Theme" | undefined;
                } & Pick<import("@duely/core").Theme, "id" | "color_primary" | "color_secondary" | "color_accent" | "color_background" | "color_surface" | "color_error" | "color_success"> & {
                    image_logo?: ({
                        __typename?: "Image" | undefined;
                    } & {
                        __typename?: "Image" | undefined;
                    } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
                    image_hero?: ({
                        __typename?: "Image" | undefined;
                    } & {
                        __typename?: "Image" | undefined;
                    } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
                };
            };
            memberships: ({
                __typename?: "Membership" | undefined;
            } & {
                __typename?: "Membership" | undefined;
            } & Pick<import("@duely/core").Membership, "id" | "access"> & {
                user: {
                    __typename?: "User" | undefined;
                } & {
                    __typename?: "User" | undefined;
                } & Pick<import("@duely/core").User, "id" | "name" | "email_address">;
                subdomain: {
                    __typename?: "Subdomain" | undefined;
                } & Pick<import("@duely/core").Subdomain, "id"> & {
                    agency: {
                        __typename?: "Agency" | undefined;
                    } & Pick<import("@duely/core").Agency, "id">;
                };
            })[];
        };
        __typename?: "Agency" | undefined;
        stripe_account: {
            __typename?: "StripeAccount" | undefined;
        } & {
            __typename?: "StripeAccount" | undefined;
        } & Pick<import("@duely/core").StripeAccount, "id" | "id_ext" | "created" | "email" | "business_type" | "charges_enabled" | "country" | "default_currency" | "details_submitted" | "payouts_enabled"> & {
            business_profile: {
                __typename?: "BusinessProfile" | undefined;
            } & Pick<import("@duely/core").BusinessProfile, "name" | "url" | "mcc" | "product_description" | "support_address" | "support_email" | "support_phone" | "support_url">;
            capabilities: {
                __typename?: "StripeCapabilities" | undefined;
            } & Pick<import("@duely/core").StripeCapabilities, "card_payments" | "transfers">;
            requirements: {
                __typename?: "StripeRequirements" | undefined;
            } & Pick<import("@duely/core").StripeRequirements, "current_deadline" | "disabled_reason" | "currently_due" | "eventually_due" | "past_due" | "pending_verification">;
            settings: {
                __typename?: "StripeSettings" | undefined;
            } & {
                branding?: ({
                    __typename?: "StripeBranding" | undefined;
                } & Pick<import("@duely/core").StripeBranding, "icon" | "logo" | "primary_color" | "secondary_color">) | null | undefined;
            };
        };
        id: string;
        name: string;
        theme: {
            __typename?: "Theme" | undefined;
        } & {
            __typename?: "Theme" | undefined;
        } & Pick<import("@duely/core").Theme, "id" | "color_primary" | "color_secondary" | "color_accent" | "color_background" | "color_surface" | "color_error" | "color_success"> & {
            image_logo?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            image_hero?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
        };
    }[] | undefined;
};
export declare const subdomain_public_Q: {
    query: TypedDocumentNode<import("@duely/core").SubdomainPublicQuery, import("@duely/core").Exact<{
        subdomain_name: string;
    }>>;
    result: (d: ResultOf<typeof SubdomainPublicDocument>) => ({
        __typename?: "Subdomain" | undefined;
    } & Pick<import("@duely/core").Subdomain, "id" | "name"> & {
        agency: {
            __typename?: "Agency" | undefined;
        } & Pick<import("@duely/core").Agency, "id" | "name"> & {
            theme: {
                __typename?: "Theme" | undefined;
            } & {
                __typename?: "Theme" | undefined;
            } & Pick<import("@duely/core").Theme, "id" | "color_primary" | "color_secondary" | "color_accent" | "color_background" | "color_surface" | "color_error" | "color_success"> & {
                image_logo?: ({
                    __typename?: "Image" | undefined;
                } & {
                    __typename?: "Image" | undefined;
                } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
                image_hero?: ({
                    __typename?: "Image" | undefined;
                } & {
                    __typename?: "Image" | undefined;
                } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            };
        };
    }) | undefined;
};
export declare const current_subdomain_Q: {
    variables: {
        subdomain_name: string | null;
    };
    query: TypedDocumentNode<import("@duely/core").SubdomainPublicQuery, import("@duely/core").Exact<{
        subdomain_name: string;
    }>>;
    result: (d: ResultOf<typeof SubdomainPublicDocument>) => ({
        __typename?: "Subdomain" | undefined;
    } & Pick<import("@duely/core").Subdomain, "id" | "name"> & {
        agency: {
            __typename?: "Agency" | undefined;
        } & Pick<import("@duely/core").Agency, "id" | "name"> & {
            theme: {
                __typename?: "Theme" | undefined;
            } & {
                __typename?: "Theme" | undefined;
            } & Pick<import("@duely/core").Theme, "id" | "color_primary" | "color_secondary" | "color_accent" | "color_background" | "color_surface" | "color_error" | "color_success"> & {
                image_logo?: ({
                    __typename?: "Image" | undefined;
                } & {
                    __typename?: "Image" | undefined;
                } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
                image_hero?: ({
                    __typename?: "Image" | undefined;
                } & {
                    __typename?: "Image" | undefined;
                } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            };
        };
    }) | undefined;
};
export declare const agency_services_Q: {
    query: TypedDocumentNode<import("@duely/core").AgencyServicesQuery, import("@duely/core").Exact<{
        agency_id: string;
    }>>;
    result: (d: ResultOf<typeof AgencyServicesDocument>) => ({
        __typename?: "Service" | undefined;
    } & {
        __typename?: "Service" | undefined;
    } & Pick<import("@duely/core").Service, "id" | "name" | "url_name"> & {
        agency: {
            __typename?: "Agency" | undefined;
        } & Pick<import("@duely/core").Agency, "id">;
        default_variant: {
            __typename?: "ServiceVariant" | undefined;
        } & {
            __typename?: "ServiceVariant" | undefined;
        } & Pick<import("@duely/core").ServiceVariant, "id" | "name" | "description" | "status" | "duration"> & {
            default_price?: ({
                __typename?: "Price" | undefined;
            } & {
                __typename?: "Price" | undefined;
            } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">) | null | undefined;
            prices?: ({
                __typename?: "Price" | undefined;
            } & {
                __typename?: "Price" | undefined;
            } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">)[] | null | undefined;
            image_logo?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            image_hero?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            markdown_description?: ({
                __typename?: "Markdown" | undefined;
            } & {
                __typename?: "Markdown" | undefined;
            } & Pick<import("@duely/core").Markdown, "data" | "id" | "name">) | null | undefined;
        };
        variants?: ({
            __typename?: "ServiceVariant" | undefined;
        } & {
            __typename?: "ServiceVariant" | undefined;
        } & Pick<import("@duely/core").ServiceVariant, "id" | "name" | "description" | "status" | "duration"> & {
            default_price?: ({
                __typename?: "Price" | undefined;
            } & {
                __typename?: "Price" | undefined;
            } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">) | null | undefined;
            prices?: ({
                __typename?: "Price" | undefined;
            } & {
                __typename?: "Price" | undefined;
            } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">)[] | null | undefined;
            image_logo?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            image_hero?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            markdown_description?: ({
                __typename?: "Markdown" | undefined;
            } & {
                __typename?: "Markdown" | undefined;
            } & Pick<import("@duely/core").Markdown, "data" | "id" | "name">) | null | undefined;
        })[] | null | undefined;
    })[] | null | undefined;
};
export declare const service_Q: {
    query: TypedDocumentNode<import("@duely/core").ServiceQuery, import("@duely/core").Exact<{
        service_id: string;
    }>>;
    result: (d: ResultOf<typeof ServiceDocument>) => ({
        __typename?: "Service" | undefined;
    } & {
        __typename?: "Service" | undefined;
    } & Pick<import("@duely/core").Service, "id" | "name" | "url_name"> & {
        agency: {
            __typename?: "Agency" | undefined;
        } & Pick<import("@duely/core").Agency, "id">;
        default_variant: {
            __typename?: "ServiceVariant" | undefined;
        } & {
            __typename?: "ServiceVariant" | undefined;
        } & Pick<import("@duely/core").ServiceVariant, "id" | "name" | "description" | "status" | "duration"> & {
            default_price?: ({
                __typename?: "Price" | undefined;
            } & {
                __typename?: "Price" | undefined;
            } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">) | null | undefined;
            prices?: ({
                __typename?: "Price" | undefined;
            } & {
                __typename?: "Price" | undefined;
            } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">)[] | null | undefined;
            image_logo?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            image_hero?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            markdown_description?: ({
                __typename?: "Markdown" | undefined;
            } & {
                __typename?: "Markdown" | undefined;
            } & Pick<import("@duely/core").Markdown, "data" | "id" | "name">) | null | undefined;
        };
        variants?: ({
            __typename?: "ServiceVariant" | undefined;
        } & {
            __typename?: "ServiceVariant" | undefined;
        } & Pick<import("@duely/core").ServiceVariant, "id" | "name" | "description" | "status" | "duration"> & {
            default_price?: ({
                __typename?: "Price" | undefined;
            } & {
                __typename?: "Price" | undefined;
            } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">) | null | undefined;
            prices?: ({
                __typename?: "Price" | undefined;
            } & {
                __typename?: "Price" | undefined;
            } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">)[] | null | undefined;
            image_logo?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            image_hero?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            markdown_description?: ({
                __typename?: "Markdown" | undefined;
            } & {
                __typename?: "Markdown" | undefined;
            } & Pick<import("@duely/core").Markdown, "data" | "id" | "name">) | null | undefined;
        })[] | null | undefined;
    }) | null | undefined;
};
export declare const current_agency_Q: {
    query: TypedDocumentNode<import("@duely/core").SubdomainAgencyQuery, import("@duely/core").Exact<{
        subdomain_name: string;
    }>>;
    result: (d: ResultOf<typeof SubdomainAgencyDocument>) => ({
        __typename?: "Agency" | undefined;
    } & {
        services?: ({
            __typename?: "Service" | undefined;
        } & {
            __typename?: "Service" | undefined;
        } & Pick<import("@duely/core").Service, "id" | "name" | "url_name"> & {
            agency: {
                __typename?: "Agency" | undefined;
            } & Pick<import("@duely/core").Agency, "id">;
            default_variant: {
                __typename?: "ServiceVariant" | undefined;
            } & {
                __typename?: "ServiceVariant" | undefined;
            } & Pick<import("@duely/core").ServiceVariant, "id" | "name" | "description" | "status" | "duration"> & {
                default_price?: ({
                    __typename?: "Price" | undefined;
                } & {
                    __typename?: "Price" | undefined;
                } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">) | null | undefined;
                prices?: ({
                    __typename?: "Price" | undefined;
                } & {
                    __typename?: "Price" | undefined;
                } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">)[] | null | undefined;
                image_logo?: ({
                    __typename?: "Image" | undefined;
                } & {
                    __typename?: "Image" | undefined;
                } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
                image_hero?: ({
                    __typename?: "Image" | undefined;
                } & {
                    __typename?: "Image" | undefined;
                } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
                markdown_description?: ({
                    __typename?: "Markdown" | undefined;
                } & {
                    __typename?: "Markdown" | undefined;
                } & Pick<import("@duely/core").Markdown, "data" | "id" | "name">) | null | undefined;
            };
            variants?: ({
                __typename?: "ServiceVariant" | undefined;
            } & {
                __typename?: "ServiceVariant" | undefined;
            } & Pick<import("@duely/core").ServiceVariant, "id" | "name" | "description" | "status" | "duration"> & {
                default_price?: ({
                    __typename?: "Price" | undefined;
                } & {
                    __typename?: "Price" | undefined;
                } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">) | null | undefined;
                prices?: ({
                    __typename?: "Price" | undefined;
                } & {
                    __typename?: "Price" | undefined;
                } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">)[] | null | undefined;
                image_logo?: ({
                    __typename?: "Image" | undefined;
                } & {
                    __typename?: "Image" | undefined;
                } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
                image_hero?: ({
                    __typename?: "Image" | undefined;
                } & {
                    __typename?: "Image" | undefined;
                } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
                markdown_description?: ({
                    __typename?: "Markdown" | undefined;
                } & {
                    __typename?: "Markdown" | undefined;
                } & Pick<import("@duely/core").Markdown, "data" | "id" | "name">) | null | undefined;
            })[] | null | undefined;
        })[] | null | undefined;
    } & {
        __typename?: "Agency" | undefined;
    } & Pick<import("@duely/core").Agency, "id" | "name"> & {
        subdomain: {
            __typename?: "Subdomain" | undefined;
        } & Pick<import("@duely/core").Subdomain, "id" | "name">;
        theme: {
            __typename?: "Theme" | undefined;
        } & {
            __typename?: "Theme" | undefined;
        } & Pick<import("@duely/core").Theme, "id" | "color_primary" | "color_secondary" | "color_accent" | "color_background" | "color_surface" | "color_error" | "color_success"> & {
            image_logo?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
            image_hero?: ({
                __typename?: "Image" | undefined;
            } & {
                __typename?: "Image" | undefined;
            } & Pick<import("@duely/core").Image, "data" | "id" | "name" | "access" | "color">) | null | undefined;
        };
    }) | undefined;
    variables: {
        subdomain_name: string | null;
    };
};
export declare const current_agency_stripe_account_update_url_Q: {
    query: TypedDocumentNode<import("@duely/core").SubdomainAgencyStripeAccountUpdateUrlQuery, import("@duely/core").Exact<{
        subdomain_name: string;
    }>>;
    fetchPolicy: string;
    result: (d: ResultOf<typeof SubdomainAgencyStripeAccountUpdateUrlDocument>) => string | undefined;
    variables: {
        subdomain_name: string | null;
    };
};
export declare const agency_thank_ypu_page_settings_Q: {
    query: TypedDocumentNode<import("@duely/core").AgencyThankYouPageSettingQuery, import("@duely/core").Exact<{
        agency_id: string;
    }>>;
    result: (d: ResultOf<typeof AgencyThankYouPageSettingDocument>) => ({
        __typename?: "AgencyThankYouPageSetting" | undefined;
    } & Pick<import("@duely/core").AgencyThankYouPageSetting, "id" | "url">) | null | undefined;
};
export declare const service_thank_ypu_page_settings_Q: {
    query: TypedDocumentNode<import("@duely/core").ServiceThankYouPageSettingQuery, import("@duely/core").Exact<{
        service_id: string;
    }>>;
    result: (d: ResultOf<typeof ServiceThankYouPageSettingDocument>) => ({
        __typename?: "ServiceThankYouPageSetting" | undefined;
    } & Pick<import("@duely/core").ServiceThankYouPageSetting, "id" | "url">) | null | undefined;
};
