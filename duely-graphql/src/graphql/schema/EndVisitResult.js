export default {
  typeDef: `
    type EndVisitResult implements MutationResult {
      success: Boolean!
      message: String
    }
  `,
  resolvers: {
  }
};
