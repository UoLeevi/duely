import { Agency, Country, CountryCode, Service, Subdomain, Theme, User } from '@duely/core';
import { QueryOptions, TypedDocumentNode } from '@apollo/client';
interface TypedQueryOptions<T = any, TVariables = void> extends QueryOptions<TVariables, T> {
    query: TypedDocumentNode<T, TVariables>;
}
interface QueryDefinition<TResult = any, TData = any, TBoundVariables = void, TVariables extends TBoundVariables = TBoundVariables> extends Omit<TypedQueryOptions<TData, TVariables>, 'variables'> {
    variables?: TBoundVariables;
    result(data: TData): TResult;
}
export declare function query<TResult = any, TData = any, TBoundVariables = void, TVariables extends TBoundVariables = TBoundVariables>(queryDef: QueryDefinition<TResult, TData, TBoundVariables, TVariables>, variables: Omit<TVariables, keyof typeof queryDef.variables>, options?: Omit<Partial<TypedQueryOptions<TData, TVariables>>, 'query' | 'variables'>): Promise<TResult>;
export declare const current_user_Q: QueryDefinition<User | null, {
    current_user: User | null;
}>;
export declare const countries_Q: QueryDefinition<Country[], {
    country_codes: CountryCode[];
}>;
export declare const services_agreement_Q: QueryDefinition<string, {
    markdowns: {
        data: string;
    }[];
}>;
export declare const agency_stripe_account_update_url_Q: QueryDefinition<string, {
    agency: {
        stripe_account: {
            account_update_url: {
                url: string;
            };
        };
    };
}>;
export declare const agency_stripe_account_balance_Q: QueryDefinition;
export declare const agency_stripe_account_balance_transactions_Q: QueryDefinition;
export declare const agency_stripe_account_payment_intents_Q: QueryDefinition;
export declare const agency_stripe_account_customers_Q: QueryDefinition;
export declare const current_user_agencies_Q: QueryDefinition<Agency[], {
    current_user: {
        memberships: {
            subdomain: {
                agency: Agency;
            };
        }[];
    };
}>;
export declare const subdomain_public_Q: QueryDefinition<Subdomain, {
    subdomains: (Subdomain & {
        agency: {
            theme: Theme;
        };
    })[];
}, {
    subdomain_name: string;
}>;
export declare const current_subdomain_Q: QueryDefinition<Subdomain, {
    subdomains: (Subdomain & {
        agency: {
            theme: Theme;
        };
    })[];
}, {
    subdomain_name: string | null;
}>;
export declare const agency_services_Q: QueryDefinition<Service[], {
    agency: {
        services: Service[];
    };
}, {}, {
    agency_id: string;
}>;
export declare const service_Q: QueryDefinition<Service, {
    service: Service;
}, {}, {
    service_id: string;
}>;
export declare const current_agency_Q: QueryDefinition<Agency, {
    subdomains: {
        agency: Agency;
    }[];
}, {}, {
    subdomain_name: string;
}>;
export declare const current_agency_stripe_account_update_url_Q: QueryDefinition<string, {
    subdomains: {
        agency: {
            stripe_account: {
                account_update_url: {
                    url: string;
                };
            };
        };
    }[];
}, {}, {
    subdomain_name: string;
}>;
export {};
