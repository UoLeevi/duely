import me from './me';
import agency from './agency';
import countryCodes from './countryCodes';
import service from './service';
import user from './user';

export default {
  typeDef: `
    type Query {
      me: Subject
      agency(uuid: ID, subdomainName: String): Agency
      countryCodes: [String!]!
      service(uuid: ID!): Service
      user(emailAddress: String!): Subject
    }
  `,
  resolvers: {
    Query: {
      me,
      agency,
      countryCodes,
      service,
      user
    }
  }
};
