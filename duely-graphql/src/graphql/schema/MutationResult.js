import pool from '../../db';

export default {
  typeDef: `
    interface MutationResult {
      success: Boolean!
      message: String
    }
  `,
  resolvers: {
    MutationResult: {
      __resolveType(mutationResult, context, info) {
        return mutationResult.type;
      }
    }
  }
};
