import { GraphQLScalarType } from 'graphql';
import gql from 'graphql-tag';
import { Kind } from 'graphql/language';

export const Date = {
  typeDef: gql`
    scalar Date
  `,
  resolvers: {
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
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
