export default {
  typeDef: `
    type DeleteServiceStepResult implements MutationResult {
      success: Boolean!
      message: String
      serviceStepUuid: ID
    }
  `,
  resolvers: {

  }
};
