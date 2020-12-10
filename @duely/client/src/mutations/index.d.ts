import { ApolloCache, MutationOptions, NormalizedCacheObject } from '@apollo/client';
import { CreateAgencyDocument, CreatePriceDocument, CreateServiceDocument, DeleteServiceDocument, LogInDocument, LogOutDocument, StartPasswordResetDocument, StartSignUpDocument, UpdateServiceDocument, VerifyPasswordResetDocument, VerifySignUpDocument } from '@duely/core';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
interface TypedMutationOptions<TDocumentNode extends TypedDocumentNode<unknown, unknown>> extends MutationOptions<ResultOf<TDocumentNode>, VariablesOf<TDocumentNode>> {
    mutation: TDocumentNode;
}
interface MutationDefinition<TDocumentNode extends TypedDocumentNode<unknown, unknown>, TResult = any, TBoundVariables = void> extends Omit<TypedMutationOptions<TDocumentNode>, 'variables'> {
    variables?: VariablesOf<TDocumentNode> extends TBoundVariables ? TBoundVariables : never;
    result(data: ResultOf<TDocumentNode>): TResult;
    after?(cache: ApolloCache<NormalizedCacheObject>, res: TResult, variables: VariablesOf<TDocumentNode>): Promise<void>;
}
export declare function mutate<TResult, TData, TBoundVariables, TVariables extends TBoundVariables, TMutationDefinition extends MutationDefinition<TypedDocumentNode<TData, TVariables>, TResult, TBoundVariables>>(mutationDef: TMutationDefinition, variables: Omit<TVariables, keyof typeof mutationDef.variables>, options?: Omit<TypedMutationOptions<TypedDocumentNode<TData, TVariables>>, 'mutation' | 'variables'>): Promise<TResult>;
export declare const log_in_M: MutationDefinition<typeof LogInDocument>;
export declare const log_out_M: MutationDefinition<typeof LogOutDocument>;
export declare const verify_password_reset_M: MutationDefinition<typeof VerifyPasswordResetDocument>;
export declare const verify_sign_up_M: MutationDefinition<typeof VerifySignUpDocument>;
export declare const start_password_reset_M: MutationDefinition<typeof StartPasswordResetDocument>;
export declare const start_sign_up_M: MutationDefinition<typeof StartSignUpDocument>;
export declare const create_agency_M: MutationDefinition<typeof CreateAgencyDocument>;
export declare const create_service_M: MutationDefinition<typeof CreateServiceDocument>;
export declare const update_service_M: MutationDefinition<typeof UpdateServiceDocument>;
export declare const delete_service_M: MutationDefinition<typeof DeleteServiceDocument>;
export declare const create_price_M: MutationDefinition<typeof CreatePriceDocument>;
export {};
