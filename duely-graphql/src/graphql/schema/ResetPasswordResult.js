import { pool } from '../../db';

export default {
  typeDef: `
    type ResetPasswordResult implements MutationResult {
      success: Boolean!
      message: String
      userUuid: ID
    }
  `,
  resolvers: {

  }
};
