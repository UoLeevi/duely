import pool from '../../db';

export default {
  typeDef: `
    interface Connection {
      edges: [Edge!]!
    }
  `,
  resolvers: {
    Connection: {
      __resolveType(connection, context, info) {
        return connection.type;
      }
    }
  }
};
