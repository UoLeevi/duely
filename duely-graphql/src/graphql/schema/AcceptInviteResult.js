import { pool } from '../../db';

export default {
  typeDef: `
    type AcceptInviteResult implements MutationResult {
      success: Boolean!
      message: String
      inviteUuid: ID
    }
  `,
  resolvers: {

  }
};
