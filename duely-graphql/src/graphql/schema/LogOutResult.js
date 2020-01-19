import { pool } from '../../db';

export default {
  typeDef: `
    type LogOutResult implements MutationResult {
      success: Boolean!
      message: String
    }
  `,
  resolvers: {
  }
};
