export const interfaces = {
  typeDef: `
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
      __resolveType(node, context, info) {
        return node.type;
      }
    },
    MutationResult: {
      __resolveType(mutationResult, context, info) {
        return mutationResult.type;
      }
    },
    Connection: {
      __resolveType(connection, context, info) {
        return connection.type;
      }
    },
    Edge: {
      __resolveType(edge, context, info) {
        return edge.type;
      }
    }
  }
};
