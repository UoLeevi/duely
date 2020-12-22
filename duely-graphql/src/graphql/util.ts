import type { GraphQLResolveInfo } from 'graphql';
import { withConnection } from '../db';

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
  source: { stripeAccount?: string; stripe_id_ext?: string }
) {
  if (data == null) return data;
  const stripeAccount = source.stripeAccount ?? source.stripe_id_ext;
  return Array.isArray(data)
    ? data.map((item) => ({ stripeAccount, ...item }))
    : { stripeAccount, ...data };
}

type CreateDefaultQueryResolversForResourceArgs = {
  name: string;
  table_name?: string;
  plural?: string;
};

export function createDefaultQueryResolversForResource<
  TResult,
  TSource extends { id?: string },
  TContext extends { jwt?: string; ip?: string },
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

      try {
        return await withConnection<TResult>(context, async (withSession) => {
          return await withSession(async ({ queryResource }) => {
            return await queryResource(args.id);
          });
        });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async [plural ?? (table_name ?? name) + 's'](
      source: TSource,
      args: { filter?: TFilterArg },
      context: TContext,
      info: GraphQLResolveInfo
    ) {
      if (!context.jwt) throw new Error('Unauthorized');

      try {
        return await withConnection<TResult[]>(context, async (withSession) => {
          return await withSession(async ({ queryResourceAll }) => {
            return await queryResourceAll(name, args.filter);
          });
        });
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };
}

type CreateResolverForReferencedResourceArgs = {
  name: string;
  resource_name?: string;
  column_name?: string;
  reverse?: boolean;
};

export function createResolverForReferencedResource<
  TResult,
  TSource extends { id?: string },
  TContext extends { jwt?: string; ip?: string },
  TFilterArg
>({ name, resource_name, column_name, reverse }: CreateResolverForReferencedResourceArgs) {
  column_name = column_name ?? `${name}_id`;
  resource_name = resource_name ?? name;
  const createQueryArgs: (
    source: TSource,
    args: { filter?: TFilterArg }
  ) => [string, Record<string, any>?] = reverse
    ? (source, args) => [
        resource_name!,
        { ...args.filter, [column_name!]: source.id ?? source[column_name! as keyof TSource] }
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

      try {
        return await withConnection(context, async (withSession) => {
          return await withSession(async ({ queryResource }) => {
            return await queryResource<TResult>(...createQueryArgs(source, args));
          });
        });
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };
}

type CreateResolverForReferencedResourceAllArgs = {
  name: string;
  resource_name?: string;
  column_name?: string;
};

export function createResolverForReferencedResourceAll<
  TResult,
  TSource extends { id?: string },
  TContext extends { jwt?: string; ip?: string },
  TFilterArg
>({ name, resource_name, column_name }: CreateResolverForReferencedResourceAllArgs) {
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

      try {
        return await withConnection<TResult[]>(context, async (withSession) => {
          return await withSession(async ({ queryResourceAll }) => {
            return await queryResourceAll<TResult>(resource_name!, {
              ...args.filter,
              [column_name!]: source.id ?? source[column_name! as keyof TSource]
            });
          });
        });
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };
}
