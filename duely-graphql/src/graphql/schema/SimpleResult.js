export default {
  typeDef: `
    type SimpleResult implements MutationResult {
      success: Boolean!
      message: String
    }
  `,
  resolvers: {

  }
};
