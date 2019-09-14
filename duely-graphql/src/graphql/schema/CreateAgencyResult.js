import pool from '../../db';

export default {
  typeDef: `
    type CreateAgencyResult implements MutationResult {
      success: Boolean!
      message: String
      agencyUuid: ID
    }
  `,
  resolvers: {

  }
};
