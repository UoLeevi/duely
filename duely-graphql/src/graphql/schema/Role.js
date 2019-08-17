import pool from '../../db';

export default {
  typeDef: `
    type Role implements Node {
      uuid: ID!
      name: String!
    }
  `,
  resolvers: {
    Role: {
      uuid: source => source.uuid_,
      name: source => source.name_
    }
  }
};
