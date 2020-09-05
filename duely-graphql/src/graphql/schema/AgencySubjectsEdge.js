import { withConnection } from '../../db';

export default {
  typeDef: `
    type AgencySubjectsEdge implements Edge {
      cursor: String
      node: Subject!
      roles: [String!]!
    }
  `,
  resolvers: {
    AgencySubjectsEdge: {
      cursor(edge, args, context, info) {
        return Buffer.from(`${edge.agencyUuid},${edge.uuid_}`).toString('base64');
      },
      node(edge, args, context, info) {
        return { ...edge, type: 'Subject' };
      },
      roles(edge, args, context, info) {
        return edge.role_names_ || [];
      }
    }
  }
};
