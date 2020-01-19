import { pool } from '../../db';

export default {
  typeDef: `
    type StartEmailAddressVerificationResult implements MutationResult {
      success: Boolean!
      message: String
    }
  `,
  resolvers: {
  }
};
