import { CountriesDocument, CurrentUserDocument, ServicesAgreementDocument, AgencyStripeAccountUpdateUrlDocument, AgencyStripeAccountBalanceDocument, AgencyStripeAccountBalanceTransactionsDocument, AgencyStripeAccountPaymentIntentsDocument, AgencyStripeAccountCustomersDocument, CurrentUserAgenciesDocument, SubdomainPublicDocument, AgencyServicesDocument, ServiceDocument, SubdomainAgencyDocument, SubdomainAgencyStripeAccountUpdateUrlDocument } from '@duely/core';
import { QueryOptions } from '@apollo/client';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
interface TypedQueryOptions<TDocumentNode extends TypedDocumentNode<unknown, unknown>> extends QueryOptions<VariablesOf<TDocumentNode>, ResultOf<TDocumentNode>> {
    query: TDocumentNode;
}
interface QueryDefinition<TDocumentNode extends TypedDocumentNode<unknown, unknown>, TResult = any, TBoundVariables = void> extends Omit<TypedQueryOptions<TDocumentNode>, 'variables'> {
    readonly variables?: VariablesOf<TDocumentNode> extends TBoundVariables ? TBoundVariables : never;
    result(data: ResultOf<TDocumentNode>): TResult;
}
export declare function query<TResult, TData, TBoundVariables, TVariables extends TBoundVariables, TQueryDefinition extends QueryDefinition<TypedDocumentNode<TData, TVariables>, TResult, TBoundVariables>>(queryDef: TQueryDefinition, variables: Omit<TVariables, keyof typeof queryDef.variables>, options?: Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'query' | 'variables'>): Promise<TResult>;
export declare const current_user_Q: QueryDefinition<typeof CurrentUserDocument>;
export declare const countries_Q: QueryDefinition<typeof CountriesDocument>;
export declare const services_agreement_Q: QueryDefinition<typeof ServicesAgreementDocument>;
export declare const agency_stripe_account_update_url_Q: QueryDefinition<typeof AgencyStripeAccountUpdateUrlDocument>;
export declare const agency_stripe_account_balance_Q: QueryDefinition<typeof AgencyStripeAccountBalanceDocument>;
export declare const agency_stripe_account_balance_transactions_Q: QueryDefinition<typeof AgencyStripeAccountBalanceTransactionsDocument>;
export declare const agency_stripe_account_payment_intents_Q: QueryDefinition<typeof AgencyStripeAccountPaymentIntentsDocument>;
export declare const agency_stripe_account_customers_Q: QueryDefinition<typeof AgencyStripeAccountCustomersDocument>;
export declare const current_user_agencies_Q: QueryDefinition<typeof CurrentUserAgenciesDocument>;
export declare const subdomain_public_Q: QueryDefinition<typeof SubdomainPublicDocument>;
export declare const current_subdomain_Q: QueryDefinition<typeof SubdomainPublicDocument, any, {
    subdomain_name: string | null;
}>;
export declare const agency_services_Q: QueryDefinition<typeof AgencyServicesDocument>;
export declare const service_Q: QueryDefinition<typeof ServiceDocument>;
export declare const current_agency_Q: QueryDefinition<typeof SubdomainAgencyDocument, any, {
    subdomain_name: string | null;
}>;
export declare const current_agency_stripe_account_update_url_Q: QueryDefinition<typeof SubdomainAgencyStripeAccountUpdateUrlDocument, any, {
    subdomain_name: string | null;
}>;
export {};
