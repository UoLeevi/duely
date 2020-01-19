import agencyCreated from './agencyCreated';

export default {
  typeDef: `
    type Subscription {
      agencyCreated: Agency
    }
  `,
  resolvers: {
    Subscription: {
      agencyCreated
    }
  }
};
