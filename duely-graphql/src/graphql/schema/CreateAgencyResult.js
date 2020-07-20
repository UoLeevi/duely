export default {
  typeDef: `
    type CreateAgencyResult implements MutationResult {
      success: Boolean!
      message: String
      agency: Agency
      stripeVerificationUrl: String
    }
  `,
  resolvers: {
  }
};
