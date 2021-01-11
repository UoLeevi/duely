import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { DocumentNode } from 'graphql';
import { DuelyQqlContext } from './context';

type GqlResolvers = Exclude<
  NonNullable<IExecutableSchemaDefinition<DuelyQqlContext>['resolvers']>,
  unknown[]
>;

export type GqlResolver = GqlResolvers[keyof GqlResolvers];

export type GqlTypeDefinition = {
  typeDef?: DocumentNode;
  resolvers?: Record<string, GqlResolver>;
};
