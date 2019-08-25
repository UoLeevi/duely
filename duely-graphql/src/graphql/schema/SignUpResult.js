import pool from '../../db';

export default {
  typeDef: `
    type SignUpResult implements MutationResult {
      success: Boolean!
      message: String
      userUuid: String
    }
  `,
  resolvers: {

  }
};