
export default {
  typeDef: `
    type SubjectInvitesEdge implements Edge {
      cursor: String
      node: Invite!
    }
  `,
  resolvers: {
    SubjectInvitesEdge: {
      cursor(edge, args, context, info) {
        return Buffer.from(`${edge.subjectUuid},${edge.uuid_}`).toString('base64');
      },
      node(edge, args, context, info) {
        return { ...edge, type: 'Invite' };
      }
    }
  }
};
