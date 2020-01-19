import { pool } from '../../db';

export default {
  typeDef: `
    interface Edge {
      cursor: String
      node: Node!
    }
  `,
  resolvers: {
    Edge: {
      __resolveType(edge, context, info) {
        return edge.type;
      }
    }
  }
};
