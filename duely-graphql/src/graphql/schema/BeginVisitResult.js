import { pool } from '../../db';

export default {
  typeDef: `
    type BeginVisitResult implements MutationResult {
      success: Boolean!
      message: String
      jwt: String
    }
  `,
  resolvers: {
  }
};
