export default {
  typeDef: `
    type DeleteResult implements MutationResult {
      success: Boolean!
      message: String
      uuid: ID
    }
  `,
  resolvers: {

  }
};
