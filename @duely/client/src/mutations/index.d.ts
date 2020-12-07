import { ApolloCache, MutationOptions, NormalizedCacheObject, OperationVariables, StoreObject, TypedDocumentNode } from '@apollo/client';
import { Agency, Price, Service } from '@duely/core';
interface MutationResult {
    success: boolean;
    message: string | null;
}
interface TypedMutationOptions<T = any, TVariables = OperationVariables> extends MutationOptions<T, TVariables> {
    mutation: TypedDocumentNode<T, TVariables>;
}
interface MutationDefinition<TResult = any, TData = any, TBoundVariables = void, TVariables extends TBoundVariables = TBoundVariables> extends Omit<TypedMutationOptions<TData, TVariables>, 'variables'> {
    variables?: TVariables;
    result(data: TData): TResult & MutationResult;
    after?(cache: ApolloCache<NormalizedCacheObject>, res: TResult & MutationResult, variables: TVariables): Promise<void>;
}
export declare function mutate<TResult = any, TData = any, TBoundVariables = void, TVariables extends TBoundVariables = TBoundVariables>(mutationDef: MutationDefinition<TResult, TData, TBoundVariables, TVariables>, variables: Omit<TVariables, keyof typeof mutationDef.variables>, options?: Omit<Partial<TypedMutationOptions<TData, TVariables>>, 'mutation' | 'variables'>): Promise<TResult & MutationResult>;
export declare const log_in_M: MutationDefinition<{
    jwt: string;
}, {
    log_in: {
        jwt: string;
    } & MutationResult;
}, {}, {
    email_address: string;
    password: string;
}>;
export declare const log_out_M: MutationDefinition;
export declare const verify_password_reset_M: MutationDefinition;
export declare const verify_sign_up_M: MutationDefinition;
export declare const start_password_reset_M: MutationDefinition;
export declare const start_sign_up_M: MutationDefinition;
export declare const create_agency_M: MutationDefinition<Agency>;
export declare const create_service_M: MutationDefinition<{
    service: Service & {
        agency: StoreObject;
    };
}>;
export declare const update_service_M: MutationDefinition<{
    service: Service;
}>;
export declare const delete_service_M: MutationDefinition<{
    service: {
        id: string;
    };
}>;
export declare const create_price_M: MutationDefinition<{
    price: Price;
}>;
export {};
