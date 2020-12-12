import { withConnection } from '../db';
import { AuthenticationError } from 'apollo-server-core';

// Not yet used
export async function withCache(context, key, fetch) {
  let promise = context.cache.get(key);

  if (!promise) {
    promise = fetch();
    context.cache.set(key, promise);
  }

  return await promise;
}

export function withStripeAccountProperty(data, source) {
  if (data == null) return data;
  const stripeAccount = source.stripeAccount ?? source.stripe_id_ext;
  return typeof data[Symbol.iterator] === 'function'
    ? data.map(item => ({ stripeAccount, ...item }))
    : { stripeAccount, ...data };
}

export function createDefaultQueryResolversForResource({ table_name, name, plural }) {
  return {
    async [table_name ?? name](source, args, context, info) {
      if (!context.jwt)
        throw new AuthenticationError('Unauthorized');

      try {
        return await withConnection(context, async withSession => {
          return await withSession(async ({ queryResource }) => {
            return await queryResource(args.id);
          });
        });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async [plural ?? (table_name ?? name) + 's'](source, args, context, info) {
      if (!context.jwt)
        throw new AuthenticationError('Unauthorized');

      try {
        return await withConnection(context, async withSession => {
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

export function createResolverForReferencedResource({ name, resource_name, column_name, reverse }) {
  column_name = column_name ?? `${name}_id`;
  resource_name = resource_name ?? name;
  const createQueryArgs = reverse
    ? source => [resource_name, { [column_name]: source.id }]
    : source => [source[column_name]];

  return {
    async [name](source, args, context, info) {
      if (!context.jwt)
        throw new AuthenticationError('Unauthorized');

      try {
        return await withConnection(context, async withSession => {
          return await withSession(async ({ queryResource }) => {
            return await queryResource(...createQueryArgs(source));
          });
        });
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };
}

export function createResolverForReferencedResourceAll({ name, resource_name, column_name }) {
  column_name = column_name ?? `${name}_id`;
  resource_name = resource_name ?? name;

  return {
    async [name](source, args, context, info) {
      if (!context.jwt)
        throw new AuthenticationError('Unauthorized');

      try {
        return await withConnection(context, async withSession => {
          return await withSession(async ({ queryResourceAll }) => {
            return await queryResourceAll(resource_name, { ...args.filter, [column_name]: source.id });
          });
        });
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };
}
