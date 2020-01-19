import { pool } from '../../db';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export default {
  typeDef: `
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
        return value.getTime();
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT)
          return new Date(ast.value);
  
        return null;
      }
    })
  }
};
