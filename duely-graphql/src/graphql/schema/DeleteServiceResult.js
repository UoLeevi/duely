export default {
  typeDef: `
    type DeleteServiceResult implements MutationResult {
      success: Boolean!
      message: String
      serviceUuid: ID
    }
  `,
  resolvers: {

  }
};
