import pool from '../../db';

export default {
  typeDef: `
    type AgencyServicesEdge implements Edge {
      cursor: String
      node: Service!
    }
  `,
  resolvers: {
    AgencyServicesEdge: {
      cursor(edge, args, context, info) {
        return Buffer.from(`${edge.agencyUuid},${edge.uuid_}`).toString('base64');
      },
      node(edge, args, context, info) {
        return { ...edge, type: 'Service' };
      }
    }
  }
};
