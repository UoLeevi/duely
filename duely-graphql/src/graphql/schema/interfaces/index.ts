import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

export const interfaces: GqlTypeDefinition = {
  typeDef: gql`
    interface Node {
      id: ID!
      name: String!
    }

    interface MutationResult {
      success: Boolean!
      message: String
    }

    interface Connection {
      edges(ids: [ID!]): [Edge!]!
    }

    interface Edge {
      cursor: String
      node: Node!
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
    },
    Connection: {
      __resolveType(connection: { type: string }) {
        return connection.type;
      }
    },
    Edge: {
      __resolveType(edge: { type: string }) {
        return edge.type;
      }
    }
  }
};
