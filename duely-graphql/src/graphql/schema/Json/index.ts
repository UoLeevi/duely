import { GraphQLScalarType } from 'graphql';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

export const Json: GqlTypeDefinition = {
  typeDef: gql`
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
