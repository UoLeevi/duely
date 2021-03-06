import type { GraphQLResolveInfo } from 'graphql';
import { countResource, queryResource, queryResourceAll } from '@duely/db';
import { DuelyQqlContext } from './context';
import { Resources } from '@duely/db';
import { Util } from '@duely/core';
import { DuelyGraphQLError } from './errors';

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

export function withStripeAccountProperty<TData>(
  data: TData | Iterable<TData>,
  source: { livemode: boolean; stripeAccount?: string; stripe_id_ext?: string }
) {
  if (data == null) return data;
  const stripeAccount = source.stripeAccount ?? source.stripe_id_ext;
  const livemode = source.livemode;
  return Array.isArray(data)
    ? data.map((item) => ({ stripeAccount, ...item }))
    : { stripeAccount, livemode, ...data };
}

type CreateDefaultQueryResolversForResourceArgs<K extends keyof Resources> = {
  name: K;
  table_name?: string;
  plural?: string;
};

export function createDefaultQueryResolversForResource<
  K extends keyof Resources,
  TSource extends { id?: string },
  TContext extends DuelyQqlContext
>({ name, table_name, plural, ...rest }: CreateDefaultQueryResolversForResourceArgs<K>) {
  return {
    async [table_name ?? name](
      source: TSource,
      args: { id: string },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");
      return await queryResource(context, name, args.id);
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
      if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");
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
      if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");
      return await countResource(context, name, args.filter, args.token);
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
  const resource_name = (Util.hasProperty(rest, 'resource_name') ? rest.resource_name : name) as K;

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
      if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");

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
  const resource_name = (Util.hasProperty(rest, 'resource_name') ? rest.resource_name : name) as K;

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
      if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");
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
