export default {
  typeDef: `
    type CreateClientResult implements MutationResult {
      success: Boolean!
      message: String
      client: Client
    }
  `,
  resolvers: {
  }
};
