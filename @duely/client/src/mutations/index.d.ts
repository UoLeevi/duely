import { ApolloCache, MutationOptions, NormalizedCacheObject } from '@apollo/client';
import { CreateAgencyDocument, CreateAgencyThankYouPageSettingDocument, CreatePriceDocument, CreateServiceDocument, CreateServiceThankYouPageSettingDocument, DeleteAgencyThankYouPageSettingDocument, DeleteServiceDocument, DeleteServiceThankYouPageSettingDocument, LogInDocument, LogOutDocument, StartPasswordResetDocument, StartSignUpDocument, UpdateAgencyThankYouPageSettingDocument, UpdateServiceDocument, UpdateServiceThankYouPageSettingDocument, VerifyPasswordResetDocument, VerifySignUpDocument } from '@duely/core';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
export interface TypedMutationOptions<TDocumentNode extends TypedDocumentNode<unknown, unknown>> extends MutationOptions<ResultOf<TDocumentNode>, VariablesOf<TDocumentNode>> {
    mutation: TDocumentNode;
}
export interface MutationDefinition<TData, TVariables extends TBoundVariables, TBoundVariables extends {
    [key: string]: any;
}, TResult> extends Omit<TypedMutationOptions<TypedDocumentNode<TData, TVariables>>, 'variables'> {
    readonly variables?: TBoundVariables;
    readonly result: (data: TData) => TResult;
    readonly after?: (cache?: ApolloCache<NormalizedCacheObject>, res?: TResult | null | undefined, variables?: TVariables) => Promise<void>;
}
export declare function mutate<TData, TVariables extends TBoundVariables, TBoundVariables extends {
    [key: string]: any;
}, TResult>(mutationDef: MutationDefinition<TData, TVariables, TBoundVariables, TResult>, variables: Omit<TVariables, keyof typeof mutationDef.variables>, options?: Omit<TypedMutationOptions<TypedDocumentNode<TData, TVariables>>, 'mutation' | 'variables'>): Promise<ReturnType<typeof mutationDef.result> | null | undefined>;
declare const log_in_R: (d: ResultOf<typeof LogInDocument>) => {
    __typename?: "LogInResult" | undefined;
} & Pick<import("@duely/core").LogInResult, "success" | "message" | "jwt">;
export declare const log_in_M: {
    mutation: TypedDocumentNode<import("@duely/core").LogInMutation, import("@duely/core").Exact<{
        email_address: string;
        password: string;
    }>>;
    result: (d: ResultOf<typeof LogInDocument>) => {
        __typename?: "LogInResult" | undefined;
    } & Pick<import("@duely/core").LogInResult, "success" | "message" | "jwt">;
    after(cache: ApolloCache<NormalizedCacheObject>, result: ReturnType<typeof log_in_R>): Promise<void>;
};
declare const log_out_R: (d: ResultOf<typeof LogOutDocument>) => {
    __typename?: "SimpleResult" | undefined;
} & Pick<import("@duely/core").SimpleResult, "success" | "message">;
export declare const log_out_M: {
    mutation: TypedDocumentNode<import("@duely/core").LogOutMutation, import("@duely/core").Exact<{
        [key: string]: never;
    }>>;
    result: (d: ResultOf<typeof LogOutDocument>) => {
        __typename?: "SimpleResult" | undefined;
    } & Pick<import("@duely/core").SimpleResult, "success" | "message">;
    after(cache: ApolloCache<NormalizedCacheObject>, result: ReturnType<typeof log_out_R>): Promise<void>;
};
export declare const verify_password_reset_M: {
    mutation: TypedDocumentNode<import("@duely/core").VerifyPasswordResetMutation, import("@duely/core").Exact<{
        verification_code: string;
        password: string;
    }>>;
    result: (d: ResultOf<typeof VerifyPasswordResetDocument>) => {
        __typename?: "SimpleResult" | undefined;
    } & Pick<import("@duely/core").SimpleResult, "success" | "message">;
};
export declare const verify_sign_up_M: {
    mutation: TypedDocumentNode<import("@duely/core").VerifySignUpMutation, import("@duely/core").Exact<{
        verification_code: string;
    }>>;
    result: (d: ResultOf<typeof VerifySignUpDocument>) => {
        __typename?: "SimpleResult" | undefined;
    } & Pick<import("@duely/core").SimpleResult, "success" | "message">;
};
export declare const start_password_reset_M: {
    mutation: TypedDocumentNode<import("@duely/core").StartPasswordResetMutation, import("@duely/core").Exact<{
        email_address: string;
        redirect_url?: string | null | undefined;
    }>>;
    result: (d: ResultOf<typeof StartPasswordResetDocument>) => {
        __typename?: "SimpleResult" | undefined;
    } & Pick<import("@duely/core").SimpleResult, "success" | "message">;
};
export declare const start_sign_up_M: {
    mutation: TypedDocumentNode<import("@duely/core").StartSignUpMutation, import("@duely/core").Exact<{
        email_address: string;
        password: string;
        name: string;
        redirect_url?: string | null | undefined;
    }>>;
    result: (d: ResultOf<typeof StartSignUpDocument>) => {
        __typename?: "SimpleResult" | undefined;
    } & Pick<import("@duely/core").SimpleResult, "success" | "message">;
};
export declare const create_agency_M: {
    mutation: TypedDocumentNode<import("@duely/core").CreateAgencyMutation, import("@duely/core").Exact<{
        name: string;
        subdomain_name: string;
        country_code: string;
        image_logo: import("@duely/core").ImageInput;
        return_url: string;
    }>>;
    result: (d: ResultOf<typeof CreateAgencyDocument>) => {
        __typename?: "CreateAgencyResult" | undefined;
    } & Pick<import("@duely/core").CreateAgencyResult, "success" | "message" | "stripe_verification_url"> & {
        agency?: ({
            __typename?: "Agency" | undefined;
        } & Pick<import("@duely/core").Agency, "id" | "name"> & {
            subdomain: {
                __typename?: "Subdomain" | undefined;
            } & Pick<import("@duely/core").Subdomain, "id" | "name">;
        }) | null | undefined;
    };
};
declare const create_service_R: (d: ResultOf<typeof CreateServiceDocument>) => {
    __typename?: "ServiceMutationResult" | undefined;
} & Pick<import("@duely/core").ServiceMutationResult, "success" | "message"> & {
    service?: ({
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
export declare const create_service_M: {
    mutation: TypedDocumentNode<import("@duely/core").CreateServiceMutation, import("@duely/core").Exact<{
        agency_id: string;
        name: string;
        description: string;
        url_name: string;
        duration?: string | null | undefined;
        image_logo?: import("@duely/core").ImageInput | null | undefined;
        image_hero?: import("@duely/core").ImageInput | null | undefined;
        status?: string | null | undefined;
    }>>;
    result: (d: ResultOf<typeof CreateServiceDocument>) => {
        __typename?: "ServiceMutationResult" | undefined;
    } & Pick<import("@duely/core").ServiceMutationResult, "success" | "message"> & {
        service?: ({
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
    after(cache: ApolloCache<NormalizedCacheObject>, result: ReturnType<typeof create_service_R>): Promise<void>;
};
export declare const update_service_M: {
    mutation: TypedDocumentNode<import("@duely/core").UpdateServiceMutation, import("@duely/core").Exact<{
        service_id: string;
        name?: string | null | undefined;
        description?: string | null | undefined;
        url_name?: string | null | undefined;
        duration?: string | null | undefined;
        default_price_id?: string | null | undefined;
        image_logo?: import("@duely/core").ImageInput | null | undefined;
        image_hero?: import("@duely/core").ImageInput | null | undefined;
        status?: string | null | undefined;
    }>>;
    result: (d: ResultOf<typeof UpdateServiceDocument>) => {
        __typename?: "ServiceMutationResult" | undefined;
    } & Pick<import("@duely/core").ServiceMutationResult, "success" | "message"> & {
        service?: ({
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
};
declare const delete_service_R: (d: ResultOf<typeof DeleteServiceDocument>) => {
    __typename?: "ServiceMutationResult" | undefined;
} & Pick<import("@duely/core").ServiceMutationResult, "success" | "message"> & {
    service?: ({
        __typename?: "Service" | undefined;
    } & Pick<import("@duely/core").Service, "id">) | null | undefined;
};
export declare const delete_service_M: {
    mutation: TypedDocumentNode<import("@duely/core").DeleteServiceMutation, import("@duely/core").Exact<{
        service_id: string;
    }>>;
    result: (d: ResultOf<typeof DeleteServiceDocument>) => {
        __typename?: "ServiceMutationResult" | undefined;
    } & Pick<import("@duely/core").ServiceMutationResult, "success" | "message"> & {
        service?: ({
            __typename?: "Service" | undefined;
        } & Pick<import("@duely/core").Service, "id">) | null | undefined;
    };
    after(cache: ApolloCache<NormalizedCacheObject>, result: ReturnType<typeof delete_service_R>): Promise<void>;
};
export declare const create_price_M: {
    mutation: TypedDocumentNode<import("@duely/core").CreatePriceMutation, import("@duely/core").Exact<{
        service_variant_id: string;
        unit_amount: number;
        currency: string;
        recurring_interval?: string | null | undefined;
        recurring_interval_count?: number | null | undefined;
        status?: string | null | undefined;
    }>>;
    result: (d: ResultOf<typeof CreatePriceDocument>) => {
        __typename?: "PriceMutationResult" | undefined;
    } & Pick<import("@duely/core").PriceMutationResult, "success" | "message"> & {
        price?: ({
            __typename?: "Price" | undefined;
        } & {
            __typename?: "Price" | undefined;
        } & Pick<import("@duely/core").Price, "id" | "name" | "currency" | "type" | "unit_amount" | "recurring_interval" | "recurring_interval_count">) | null | undefined;
    };
};
export declare const create_agency_thank_you_page_setting_M: {
    mutation: TypedDocumentNode<import("@duely/core").CreateAgencyThankYouPageSettingMutation, import("@duely/core").Exact<{
        agency_id: string;
        url: string;
    }>>;
    result: (d: ResultOf<typeof CreateAgencyThankYouPageSettingDocument>) => {
        __typename?: "AgencyThankYouPageSettingMutationResult" | undefined;
    } & Pick<import("@duely/core").AgencyThankYouPageSettingMutationResult, "success" | "message"> & {
        setting?: ({
            __typename?: "AgencyThankYouPageSetting" | undefined;
        } & Pick<import("@duely/core").AgencyThankYouPageSetting, "id" | "url">) | null | undefined;
    };
};
export declare const create_service_thank_you_page_setting_M: {
    mutation: TypedDocumentNode<import("@duely/core").CreateServiceThankYouPageSettingMutation, import("@duely/core").Exact<{
        service_id: string;
        url: string;
    }>>;
    result: (d: ResultOf<typeof CreateServiceThankYouPageSettingDocument>) => {
        __typename?: "ServiceThankYouPageSettingMutationResult" | undefined;
    } & Pick<import("@duely/core").ServiceThankYouPageSettingMutationResult, "success" | "message"> & {
        setting?: ({
            __typename?: "ServiceThankYouPageSetting" | undefined;
        } & Pick<import("@duely/core").ServiceThankYouPageSetting, "id" | "url">) | null | undefined;
    };
};
export declare const update_agency_thank_you_page_setting_M: {
    mutation: TypedDocumentNode<import("@duely/core").UpdateAgencyThankYouPageSettingMutation, import("@duely/core").Exact<{
        setting_id: string;
        url: string;
    }>>;
    result: (d: ResultOf<typeof UpdateAgencyThankYouPageSettingDocument>) => {
        __typename?: "AgencyThankYouPageSettingMutationResult" | undefined;
    } & Pick<import("@duely/core").AgencyThankYouPageSettingMutationResult, "success" | "message"> & {
        setting?: ({
            __typename?: "AgencyThankYouPageSetting" | undefined;
        } & Pick<import("@duely/core").AgencyThankYouPageSetting, "id" | "url">) | null | undefined;
    };
};
export declare const update_service_thank_you_page_setting_M: {
    mutation: TypedDocumentNode<import("@duely/core").UpdateServiceThankYouPageSettingMutation, import("@duely/core").Exact<{
        setting_id: string;
        url: string;
    }>>;
    result: (d: ResultOf<typeof UpdateServiceThankYouPageSettingDocument>) => {
        __typename?: "ServiceThankYouPageSettingMutationResult" | undefined;
    } & Pick<import("@duely/core").ServiceThankYouPageSettingMutationResult, "success" | "message"> & {
        setting?: ({
            __typename?: "ServiceThankYouPageSetting" | undefined;
        } & Pick<import("@duely/core").ServiceThankYouPageSetting, "id" | "url">) | null | undefined;
    };
};
export declare const delete_agency_thank_you_page_setting_M: {
    mutation: TypedDocumentNode<import("@duely/core").DeleteAgencyThankYouPageSettingMutation, import("@duely/core").Exact<{
        setting_id: string;
    }>>;
    result: (d: ResultOf<typeof DeleteAgencyThankYouPageSettingDocument>) => {
        __typename?: "AgencyThankYouPageSettingMutationResult" | undefined;
    } & Pick<import("@duely/core").AgencyThankYouPageSettingMutationResult, "success" | "message"> & {
        setting?: ({
            __typename?: "AgencyThankYouPageSetting" | undefined;
        } & Pick<import("@duely/core").AgencyThankYouPageSetting, "id" | "url">) | null | undefined;
    };
};
export declare const delete_service_thank_you_page_setting_M: {
    mutation: TypedDocumentNode<import("@duely/core").DeleteServiceThankYouPageSettingMutation, import("@duely/core").Exact<{
        setting_id: string;
    }>>;
    result: (d: ResultOf<typeof DeleteServiceThankYouPageSettingDocument>) => {
        __typename?: "ServiceThankYouPageSettingMutationResult" | undefined;
    } & Pick<import("@duely/core").ServiceThankYouPageSettingMutationResult, "success" | "message"> & {
        setting?: ({
            __typename?: "ServiceThankYouPageSetting" | undefined;
        } & Pick<import("@duely/core").ServiceThankYouPageSetting, "id" | "url">) | null | undefined;
    };
};
export {};
