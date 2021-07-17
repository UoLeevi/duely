import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

export const interfaces: GqlTypeDefinition = {
  typeDef: gql`
    interface Node {
      id: ID!
    }

    interface MutationResult {
      success: Boolean!
      message: String
    }
  `,
  resolvers: {
    Node: {
      __resolveType(node: { type: string }) {
        return node.type;
      }
    },
    MutationResult: {
      __resolveType(mutationResult: { type: string }) {
        return mutationResult.type;
      }
    }
  }
};
