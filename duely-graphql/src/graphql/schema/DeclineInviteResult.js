export default {
  typeDef: `
    type DeclineInviteResult implements MutationResult {
      success: Boolean!
      message: String
      invite: Invite
    }
  `,
  resolvers: {

  }
};
