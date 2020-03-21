import { pool } from '../../db';

export default {
  typeDef: `
    interface Connection {
      edges(uuids: [ID!]): [Edge!]!
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
