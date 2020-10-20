import { withConnection } from '../db';
import { AuthenticationError } from 'apollo-server-core';

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
