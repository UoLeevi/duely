import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { DocumentNode } from 'graphql';
import { DuelyQqlContext } from './context';
import { IResolvers } from '@graphql-tools/utils';

type GqlResolvers = Exclude<
  NonNullable<IExecutableSchemaDefinition<DuelyQqlContext>['resolvers']>,
  unknown[]
>;

export type GqlResolver = GqlResolvers[keyof GqlResolvers];

export type GqlTypeDefinition<TSource = any> = {
  typeDef?: DocumentNode;
  resolvers?: IResolvers<TSource, DuelyQqlContext>;
};
