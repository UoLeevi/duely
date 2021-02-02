import type { GraphQLResolveInfo } from 'graphql';
import { queryResource, queryResourceAll } from '@duely/db';
import { DuelyQqlContext } from './context';

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

type CreateDefaultQueryResolversForResourceArgs = {
  name: string;
  table_name?: string;
  plural?: string;
};

export function createDefaultQueryResolversForResource<
  TResult,
  TSource extends { id?: string },
  TContext extends DuelyQqlContext,
  TFilterArg
>({ table_name, name, plural }: CreateDefaultQueryResolversForResourceArgs) {
  return {
    async [table_name ?? name](
      source: TSource,
      args: { id: string },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) throw new Error('Unauthorized');
      return await queryResource(context, args.id);
    },
    async [plural ?? (table_name ?? name) + 's'](
      source: TSource,
      args: { filter?: TFilterArg },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) throw new Error('Unauthorized');
      return await queryResourceAll(context, name, args.filter);
    }
  };
}

type CreateResolverForReferencedResourceArgs = {
  name: string;
  resource_name?: string;
  column_name?: string;
  reverse_column_name?: string;
  reverse?: boolean;
};

export function createResolverForReferencedResource<
  TResult,
  TSource extends { id?: string },
  TContext extends DuelyQqlContext,
  TFilterArg
>({
  name,
  resource_name,
  column_name,
  reverse_column_name,
  reverse
}: CreateResolverForReferencedResourceArgs) {
  column_name = column_name ?? `${name}_id`;
  resource_name = resource_name ?? name;
  const createQueryArgs: (
    source: TSource,
    args: { filter?: TFilterArg }
  ) => [string, Record<string, any>?] = reverse
    ? (source, args) => [
        resource_name!,
        {
          ...args.filter,
          [column_name!]: reverse_column_name
            ? source[reverse_column_name as keyof TSource]
            : source.id ?? source[column_name! as keyof TSource]
        }
      ]
    : (source, args) => [(source[column_name! as keyof TSource]! as unknown) as string];

  return {
    async [name](
      source: TSource,
      args: { filter?: TFilterArg },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) throw new Error('Unauthorized');
      return await queryResource<TResult>(context, ...createQueryArgs(source, args));
    }
  };
}

type CreateResolverForReferencedResourceAllArgs = {
  name: string;
  resource_name?: string;
  column_name?: string;
  reverse_column_name?: string;
};

export function createResolverForReferencedResourceAll<
  TResult,
  TSource extends { id?: string },
  TContext extends { jwt?: string; ip?: string },
  TFilterArg
>({
  name,
  resource_name,
  column_name,
  reverse_column_name
}: CreateResolverForReferencedResourceAllArgs) {
  column_name = column_name ?? `${name}_id`;
  resource_name = resource_name ?? name;

  return {
    async [name](
      source: TSource,
      args: { filter?: TFilterArg },
      context: TContext,
      info: GraphQLResolveInfo
    ): Promise<TResult[]> {
      if (!context.jwt) throw new Error('Unauthorized');
      return await queryResourceAll<TResult>(context, resource_name!, {
        ...args.filter,
        [column_name!]: reverse_column_name
          ? source[reverse_column_name as keyof TSource]
          : source.id ?? source[column_name! as keyof TSource]
      });
    }
  };
}
