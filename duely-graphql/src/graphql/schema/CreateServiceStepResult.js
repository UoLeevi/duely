export default {
  typeDef: `
    type CreateServiceStepResult implements MutationResult {
      success: Boolean!
      message: String
      step: ServiceStep
    }
  `,
  resolvers: {

  }
};
