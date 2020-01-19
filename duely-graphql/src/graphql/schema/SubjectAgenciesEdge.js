import { pool } from '../../db';

export default {
  typeDef: `
    type SubjectAgenciesEdge implements Edge {
      cursor: String
      node: Agency!
      roles: [String!]!
    }
  `,
  resolvers: {
    SubjectAgenciesEdge: {
      cursor(edge, args, context, info) {
        return Buffer.from(`${edge.subjectUuid},${edge.uuid_}`).toString('base64');
      },
      node(edge, args, context, info) {
        return { ...edge, type: 'Agency' };
      },
      roles(edge, args, context, info) {
        return edge.role_names_ || [];
      }
    }
  }
};
