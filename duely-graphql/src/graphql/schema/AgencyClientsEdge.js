import { withConnection } from '../../db';

export default {
  typeDef: `
    type AgencyClientsEdge implements Edge {
      cursor: String
      node: Client!
    }
  `,
  resolvers: {
    AgencyClientsEdge: {
      cursor(edge, args, context, info) {
        return Buffer.from(`${edge.agencyUuid},${edge.uuid_}`).toString('base64');
      },
      node(edge, args, context, info) {
        return { ...edge, type: 'Client' };
      }
    }
  }
};
