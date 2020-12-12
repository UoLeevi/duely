import { MutationDefinition, TypedMutationOptions } from '../mutations';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { MutationResult } from '@duely/core';
declare type MutationState<T> = {
    loading: boolean;
    error: T | Error | undefined;
    data: T | undefined;
};
declare type MutationHookOptions = {
    resetErrorMs: number;
};
export declare function useMutation<TData, TVariables extends TBoundVariables, TBoundVariables extends {
    [key: string]: any;
}, TResult extends MutationResult>(mutationDef: MutationDefinition<TData, TVariables, TBoundVariables, TResult>, options?: MutationHookOptions): (MutationState<unknown> | ((variables: Pick<TVariables, Exclude<keyof TVariables, never>>, options: Omit<TypedMutationOptions<TypedDocumentNode<TData, TVariables>>, 'mutation' | 'variables'>) => Promise<any>))[];
export {};
