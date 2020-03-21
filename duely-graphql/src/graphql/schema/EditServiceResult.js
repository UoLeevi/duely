import { pool } from '../../db';

export default {
  typeDef: `
    type EditServiceResult implements MutationResult {
      success: Boolean!
      message: String
      service: Service
    }
  `,
  resolvers: {

  }
};
