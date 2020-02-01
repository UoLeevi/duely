import { pool } from '../../db';

export default {
  typeDef: `
    type EditImageResult implements MutationResult {
      success: Boolean!
      message: String
      imageUuid: ID
    }
  `,
  resolvers: {

  }
};
