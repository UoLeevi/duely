export const AccessLevel = {
  typeDef: `
    enum AccessLevel {
      OWNER
      MANAGER
      AGENT
      CLIENT
      PUBLIC
    }
  `,
  resolvers: {
    AccessLevel: {
      OWNER: 'owner',
      MANAGER: 'manager',
      AGENT: 'agent',
      CLIENT: 'client',
      PUBLIC: 'public'
    }
  }
};
