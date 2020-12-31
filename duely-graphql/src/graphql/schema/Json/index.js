import { GraphQLScalarType } from 'graphql';

export const Json = {
  typeDef: `
    scalar Json
  `,
  resolvers: {
    Json: new GraphQLScalarType({
      name: 'Json',
      description: 'Json custom scalar type',
      parseValue(value) {
        return JSON.parse(value);
      },
      serialize(value) {
        return JSON.stringify(value);
      }
    })
  }
};
