export default {
  typeDef: `
    type DeleteAgencyResult implements MutationResult {
      success: Boolean!
      message: String
      agencyUuid: ID
    }
  `,
  resolvers: {

  }
};
