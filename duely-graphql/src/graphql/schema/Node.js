
export default {
  typeDef: `
    interface Node {
      uuid: ID!
      name: String!
    }
  `,
  resolvers: {
    Node: {
      __resolveType(node, context, info) {
        return node.type;
      }
    }
  }
};
