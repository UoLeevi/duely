import { pool } from '../../db';

export default {
  typeDef: `
    type EditAgencyThemeResult implements MutationResult {
      success: Boolean!
      message: String
      themeUuid: ID
    }
  `,
  resolvers: {

  }
};
