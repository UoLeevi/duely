import { pool } from '../../db';

export default {
  typeDef: `
    type LogInResult implements MutationResult {
      success: Boolean!
      message: String
      jwt: String
    }
  `,
  resolvers: {
  }
};
