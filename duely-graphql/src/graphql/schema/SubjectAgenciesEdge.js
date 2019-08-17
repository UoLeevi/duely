import pool from '../../db';

export default {
  typeDef: `
    type SubjectAgenciesEdge implements Edge {
      cursor: String
      node: Agency!
      roles: [Role!]!
    }
  `,
  resolvers: {
    
  }
};
