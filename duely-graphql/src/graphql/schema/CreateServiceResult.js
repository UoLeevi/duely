import { pool } from '../../db';

export default {
  typeDef: `
    type CreateServiceResult implements MutationResult {
      success: Boolean!
      message: String
      service: Service
    }
  `,
  resolvers: {
  }
};
