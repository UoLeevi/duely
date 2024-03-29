import type { GraphQLResolveInfo } from 'graphql';
import {
  AccessLevel,
  countResource,
  queryResource,
  queryResourceAccess,
  queryResourceAll,
  withSession
} from '@duely/db';
import { DuelyQqlContext } from './context';
import { Resources } from '@duely/db';
import { hasProperty, PathValue } from '@duely/util';
import { DuelyGraphQLError } from './errors';
import stripe, {
  StripeListParams,
  StripeObjectTypeResources,
  StripeResourceEndpointResponseObject,
  StripeRetrieveParams
} from '@duely/stripe';
import Stripe from 'stripe';
import { IResolvers } from '@graphql-tools/utils';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';

// Not yet used
export async function withCache<TKey, TValue>(
  context: { cache: Map<TKey, Promise<TValue>> },
  key: TKey,
  fetch: (key: TKey) => Promise<TValue>
) {
  let promise = context.cache.get(key);

  if (!promise) {
    promise = fetch(key);
    context.cache.set(key, promise);
  }

  return await promise;
}

export function withStripeAccountProperty(
  data: null,
  stripe_account: Resources['stripe account']
): null;
export function withStripeAccountProperty(
  data: undefined,
  stripe_account: Resources['stripe account']
): undefined;
export function withStripeAccountProperty<TData>(
  data: TData[],
  stripe_account: Resources['stripe account']
): (TData & { stripe_account: Resources['stripe account'] })[];
export function withStripeAccountProperty<TData>(
  data: TData,
  stripe_account: Resources['stripe account']
): TData & { stripe_account: Resources['stripe account'] };
export function withStripeAccountProperty<TData>(
  data: TData | TData[],
  stripe_account: Resources['stripe account']
):
  | (TData & { stripe_account: Resources['stripe account'] })
  | (TData & { stripe_account: Resources['stripe account'] })[]
  | null
  | undefined {
  if (data === null) return null;
  if (data === undefined) return undefined;
  return Array.isArray(data)
    ? data.map<TData & { stripe_account: Resources['stripe account'] }>((item) => ({
        ...item,
        stripe_account
      }))
    : { stripe_account, ...data };
}

type CreateDefaultQueryResolversForResourceArgs<K extends keyof Resources> = {
  name: K;
  table_name?: string;
  plural?: string;
};

export function createDefaultQueryResolversForResource<
  K extends keyof Resources,
  TSource extends { id?: string; token?: string },
  TContext extends DuelyQqlContext
>({ name, table_name, plural, ...rest }: CreateDefaultQueryResolversForResourceArgs<K>) {
  return {
    async [table_name ?? name](
      source: TSource,
      args: { id: string; token?: string },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) {
        throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');
      }

      return await queryResource(context, name, args.id, args.token);
    },
    async [plural ?? (table_name ?? name) + 's'](
      source: TSource,
      args: {
        filter?: Partial<Resources[K]>;
        token?: string;
        desc?: boolean;
        order_by?: string & keyof Resources[K];
        limit?: number;
        offset?: number;
        before_id?: Resources[K]['id'];
        after_id?: Resources[K]['id'];
      },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) {
        throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');
      }

      return await queryResourceAll(
        context,
        name,
        args.filter,
        args.token,
        args.desc,
        args.order_by,
        args.limit,
        args.offset,
        args.before_id,
        args.after_id
      );
    },
    async [`count_${plural ?? (table_name ?? name) + 's'}`](
      source: TSource,
      args: {
        filter?: Partial<Resources[K]>;
        token?: string;
      },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) {
        throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');
      }

      return await countResource(context, name, args.filter, args.token);
    }
  };
}

type CreateStripeRetrieveResolverForReferencedResourceArgs<
  TResolverName extends string,
  TStripeObjectType extends keyof StripeObjectTypeResources<'retrieve'>
> = {
  name: TResolverName;
  object: TStripeObjectType;
  expand?: string[];
  role?: AccessLevel;
};

export function createStripeRetrieveResolverForReferencedResource<
  TSource extends { stripe_account: Resources['stripe account'] } & Record<
    TResolverName,
    null | undefined | object | string
  >,
  TResolverName extends string & keyof TSource,
  TStripeObjectType extends keyof StripeObjectTypeResources<'retrieve'>,
  TContext extends DuelyQqlContext
>({
  name,
  object,
  expand,
  role
}: CreateStripeRetrieveResolverForReferencedResourceArgs<
  TResolverName,
  TStripeObjectType
>): IResolvers<
  TSource,
  DuelyQqlContext,
  StripeRetrieveParams<StripeObjectTypeResources<'retrieve'>[TStripeObjectType]>,
  Promise<
    Awaited<ReturnType<PathValue<Stripe, TStripeObjectType>['retrieve']>> & {
      stripe_account: Resources['stripe account'];
    }
  >
> {
  return {
    async [name](
      source: TSource,
      args: StripeRetrieveParams<StripeObjectTypeResources<'retrieve'>[TStripeObjectType]>,
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (role) {
        const access = await queryResourceAccess(context, source.stripe_account.id);

        if (access !== role) {
          throw new DuelyGraphQLError('FORBIDDEN', `Only ${role} can access this information`);
        }
      }

      const value = source[name];

      if (value == null) return null;
      if (typeof value === 'object') return withStripeAccountProperty(value, source.stripe_account);

      const resolveTree = parseResolveInfo(info) as ResolveTree;
      const fields = Object.keys(Object.values(resolveTree.fieldsByTypeName)[0]);
      if (fields.length === 1 && fields[0] === 'id') return { id: value };

      const response = await stripe.retrieve(stripe.get(source.stripe_account), object, value, {
        expand,
        ...args
      });

      return withStripeAccountProperty(response, source.stripe_account);
    }
  };
}

type CreateStripeListResolverForReferencedResourceArgs<
  TResolverName extends string,
  TStripeObjectType extends keyof StripeObjectTypeResources<'list'>
> = {
  name: TResolverName;
  param?: keyof StripeListParams<StripeObjectTypeResources<'list'>[TStripeObjectType]>;
  object: TStripeObjectType;
  expand?: string[];
  role?: AccessLevel;
};

export function createStripeListResolverForReferencedResource<
  TSource extends { id: string; stripe_account: Resources['stripe account'] } & Record<
    TResolverName,
    null | undefined | object | string
  >,
  TResolverName extends string & keyof TSource,
  TStripeObjectType extends keyof StripeObjectTypeResources<'list'>,
  TContext extends DuelyQqlContext
>({
  name,
  param,
  object,
  expand,
  role
}: CreateStripeListResolverForReferencedResourceArgs<TResolverName, TStripeObjectType>): IResolvers<
  TSource,
  DuelyQqlContext,
  StripeListParams<StripeObjectTypeResources<'list'>[TStripeObjectType]>,
  Promise<
    StripeResourceEndpointResponseObject<'list'>[StripeObjectTypeResources<'list'>[TStripeObjectType]]
  > & {
    stripe_account: Resources['stripe account'];
  }
> {
  return {
    async [name](
      source: TSource,
      args: StripeListParams<StripeObjectTypeResources<'list'>[TStripeObjectType]>,
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (role) {
        const access = await queryResourceAccess(context, source.stripe_account.id);

        if (access !== role) {
          throw new DuelyGraphQLError('FORBIDDEN', `Only ${role} can access this information`);
        }
      }

      const params: StripeListParams<StripeObjectTypeResources<'list'>[TStripeObjectType]> = {
        expand: expand?.map((path) => (path.startsWith('data.') ? path : `data.${path}`)),
        ...args
      };

      if (param) {
        (params as any)[param] = source.id;
      }

      const response = await stripe.list(stripe.get(source.stripe_account), object, params);
      return withStripeAccountProperty(response.data, source.stripe_account);
    }
  };
}

type CreateStripeRetrieveQueryResolverArgs<
  TResolverName extends string,
  TStripeObjectType extends keyof StripeObjectTypeResources<'retrieve'>
> = {
  name: TResolverName;
  object: TStripeObjectType;
  expand?: string[];
  role?: AccessLevel;
};

export function createStripeRetrieveQueryResolver<
  TResolverName extends string,
  TStripeObjectType extends keyof StripeObjectTypeResources<'retrieve'>,
  TContext extends DuelyQqlContext
>({
  name,
  object,
  expand,
  role
}: CreateStripeRetrieveQueryResolverArgs<TResolverName, TStripeObjectType>): IResolvers<
  unknown,
  DuelyQqlContext,
  { stripe_account_id: string } & Record<`${TResolverName}_id`, string> &
    StripeRetrieveParams<StripeObjectTypeResources<'retrieve'>[TStripeObjectType]>,
  Promise<
    Awaited<ReturnType<PathValue<Stripe, TStripeObjectType>['retrieve']>> & {
      stripe_account: Resources['stripe account'];
    }
  >
> {
  return {
    async [name](
      source,
      {
        stripe_account_id,
        [`${name}_id` as const]: id,
        ...params
      }: { stripe_account_id: string } & Record<`${TResolverName}_id`, string> &
        StripeRetrieveParams<StripeObjectTypeResources<'retrieve'>[TStripeObjectType]>,
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt)
        throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

      try {
        return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
          const stripe_account = await queryResource('stripe account', stripe_account_id);

          if (role) {
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== role) {
              throw new DuelyGraphQLError('FORBIDDEN', `Only ${role} can access this information`);
            }
          }

          const response = await stripe.retrieve(
            stripe.get(stripe_account),
            object,
            id as unknown as string,
            {
              expand,
              ...(params as unknown as StripeRetrieveParams<
                StripeObjectTypeResources<'retrieve'>[TStripeObjectType]
              >)
            }
          );

          return withStripeAccountProperty(response, stripe_account);
        });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  };
}

type CreateStripeListQueryResolverArgs<
  TResolverName extends string,
  TStripeObjectType extends keyof StripeObjectTypeResources<'list'>
> = {
  name: TResolverName;
  object: TStripeObjectType;
  expand?: string[];
  role?: AccessLevel;
};

export function createStripeListQueryResolver<
  TResolverName extends string,
  TStripeObjectType extends keyof StripeObjectTypeResources<'list'>,
  TContext extends DuelyQqlContext
>({
  name,
  object,
  expand,
  role
}: CreateStripeListQueryResolverArgs<TResolverName, TStripeObjectType>): IResolvers<
  unknown,
  DuelyQqlContext,
  Promise<
    StripeResourceEndpointResponseObject<'list'>[StripeObjectTypeResources<'list'>[TStripeObjectType]]
  > & {
    stripe_account: Resources['stripe account'];
  }
> {
  return {
    async [name](
      source,
      {
        stripe_account_id,
        ...params
      }: { stripe_account_id: string } & StripeListParams<
        StripeObjectTypeResources<'list'>[TStripeObjectType]
      >,
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt)
        throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

      try {
        return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
          const stripe_account = await queryResource('stripe account', stripe_account_id);

          if (role) {
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== role) {
              throw new DuelyGraphQLError('FORBIDDEN', `Only ${role} can access this information`);
            }
          }

          const response = await stripe.list(stripe.get(stripe_account), object, {
            expand: expand?.map((path) => (path.startsWith('data.') ? path : `data.${path}`)),
            ...(params as unknown as StripeListParams<
              StripeObjectTypeResources<'list'>[TStripeObjectType]
            >)
          });

          return withStripeAccountProperty(response.data, stripe_account);
        });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  };
}

type CreateResolverForReferencedResourceArgs<K extends keyof Resources> = (
  | { name: K }
  | { name: string; resource_name: K }
) & {
  column_name?: string;
  reverse_column_name?: string;
  reverse?: boolean;
};

export function createResolverForReferencedResource<
  K extends keyof Resources,
  TSource extends { id?: string },
  TContext extends DuelyQqlContext
>({
  name,
  column_name,
  reverse_column_name,
  reverse,
  ...rest
}: CreateResolverForReferencedResourceArgs<K>) {
  column_name = column_name ?? `${name}_id`;
  const resource_name = (hasProperty(rest, 'resource_name') ? rest.resource_name : name) as K;

  const createIdOrFilterArg: (
    source: TSource,
    args: {
      filter?: Partial<Resources[K]>;
      token?: string;
    }
  ) => string | Partial<Resources[K]> = reverse
    ? (source, args) =>
        ({
          ...args.filter,
          [column_name as keyof Resources[K]]: reverse_column_name
            ? source[reverse_column_name as keyof TSource]
            : source.id ?? source[column_name! as keyof TSource]
        } as Partial<Resources[K]>)
    : (source, args) => source[column_name! as keyof TSource]! as unknown as string;

  return {
    async [name](
      source: TSource,
      args: {
        filter?: Partial<Resources[K]>;
        token?: string;
      },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) {
        throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');
      }

      const id_or_filter = createIdOrFilterArg(source, args);

      if (!id_or_filter) return null;

      return await queryResource(context, resource_name, id_or_filter, args.token);
    }
  };
}

type CreateResolverForReferencedResourceAllArgs<K extends keyof Resources> = (
  | { name: K }
  | { name: string; resource_name: K }
) & {
  column_name?: string;
  reverse_column_name?: string;
};

export function createResolverForReferencedResourceAll<
  K extends keyof Resources,
  TSource extends { id?: string },
  TContext extends { jwt: string | null; ip?: string }
>({
  name,
  column_name,
  reverse_column_name,
  ...rest
}: CreateResolverForReferencedResourceAllArgs<K>) {
  column_name = column_name ?? `${name}_id`;
  const resource_name = (hasProperty(rest, 'resource_name') ? rest.resource_name : name) as K;

  return {
    async [name](
      source: TSource,
      args: {
        filter?: Partial<Resources[K]>;
        token?: string;
        desc?: boolean;
        order_by?: string & keyof Resources[K];
        limit?: number;
        offset?: number;
        before_id?: Resources[K]['id'];
        after_id?: Resources[K]['id'];
      },
      context: TContext,
      info: GraphQLResolveInfo
    ): Promise<Resources[K][]> {
      if (!context.jwt) {
        throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');
      }

      return await queryResourceAll(
        context,
        resource_name!,
        {
          ...args.filter,
          [column_name!]: reverse_column_name
            ? source[reverse_column_name as keyof TSource]
            : source.id ?? source[column_name! as keyof TSource]
        } as Partial<Resources[K]>,
        args.token,
        args.desc,
        args.order_by,
        args.limit,
        args.offset,
        args.before_id,
        args.after_id
      );
    }
  };
}
