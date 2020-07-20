export default {
  typeDef: `
    type AcceptInviteResult implements MutationResult {
      success: Boolean!
      message: String
      invite: Invite
    }
  `,
  resolvers: {

  }
};
