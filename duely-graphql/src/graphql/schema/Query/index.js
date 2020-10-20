import me from './me';
import countryCodes from './countryCodes';
import service from './service';

export default {
  typeDef: `
    type Query {
      me: Subject
      countryCodes: [String!]!
      service(uuid: ID!): Service
    }
  `,
  resolvers: {
    Query: {
      me,
      countryCodes,
      service
    }
  }
};
