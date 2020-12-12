import { QueryDefinition, TypedQueryOptions } from '../queries';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
export declare function useQuery<TData, TVariables extends TBoundVariables, TBoundVariables extends {
    [key: string]: any;
}, TResult>(queryDef: QueryDefinition<TData, TVariables, TBoundVariables, TResult>, variables?: Omit<TVariables, keyof typeof queryDef.variables>, options?: Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'query' | 'variables'>): {
    client: import("@apollo/client").ApolloClient<any>;
    previousData?: TData | undefined;
    error?: import("@apollo/client").ApolloError | undefined;
    called: true;
    variables: {
        [x: string]: any;
    } | undefined;
    startPolling: (pollInterval: number) => void;
    stopPolling: () => void;
    subscribeToMore: <TSubscriptionData = TData, TSubscriptionVariables = {
        [x: string]: any;
    }>(options: import("@apollo/client").SubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData>) => () => void;
    updateQuery: <TVars = {
        [x: string]: any;
    }>(mapFn: (previousQueryResult: TData, options: Pick<import("@apollo/client").WatchQueryOptions<TVars, TData>, "variables">) => TData) => void;
    refetch: (variables?: Partial<{
        [x: string]: any;
    }> | undefined) => Promise<import("@apollo/client").ApolloQueryResult<TData>>;
    fetchMore: (<K extends string | number>(fetchMoreOptions: import("@apollo/client").FetchMoreQueryOptions<{
        [x: string]: any;
    }, K, TData> & import("@apollo/client").FetchMoreOptions<TData, {
        [x: string]: any;
    }>) => Promise<import("@apollo/client").ApolloQueryResult<TData>>) & (<TData2, TVariables2, K_1 extends keyof TVariables2>(fetchMoreOptions: {
        query?: import("@apollo/client").DocumentNode | TypedDocumentNode<TData, {
            [x: string]: any;
        }> | undefined;
    } & import("@apollo/client").FetchMoreQueryOptions<TVariables2, K_1, TData> & import("@apollo/client").FetchMoreOptions<TData2, TVariables2>) => Promise<import("@apollo/client").ApolloQueryResult<TData2>>);
    data: TResult | undefined;
    loading: boolean;
    initialLoading: boolean;
};
