import { GraphQLScalarType } from 'graphql';
import gql from 'graphql-tag';
import { Kind } from 'graphql/language';
import { GqlTypeDefinition } from '../../types';

export const DateTime: GqlTypeDefinition = {
  typeDef: gql`
    scalar DateTime
  `,
  resolvers: {
    DateTime: new GraphQLScalarType({
      name: 'DateTime',
      description: 'DateTime custom scalar type',
      parseValue(value) {
        return new Date(value);
      },
      serialize(value) {
        return Number.isInteger(value) ? value : value.getTime();
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) return parseInt(ast.value, 10);

        return null;
      }
    })
  }
};
