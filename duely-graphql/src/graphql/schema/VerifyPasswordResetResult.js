import { pool } from '../../db';

export default {
  typeDef: `
    type VerifyPasswordResetResult implements MutationResult {
      success: Boolean!
      message: String
      jwt: String
    }
  `,
  resolvers: {

  }
};
