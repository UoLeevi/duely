import { pool } from '../../db';

export default {
  typeDef: `
    type EditAgencyThemeResult implements MutationResult {
      success: Boolean!
      message: String
      theme: Theme
    }
  `,
  resolvers: {

  }
};
