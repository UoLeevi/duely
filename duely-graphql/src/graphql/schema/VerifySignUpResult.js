import { pool } from '../../db';

export default {
  typeDef: `
    type VerifySignUpResult implements MutationResult {
      success: Boolean!
      message: String
      jwt: String
    }
  `,
  resolvers: {

  }
};
