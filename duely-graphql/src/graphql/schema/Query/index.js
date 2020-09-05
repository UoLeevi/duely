import me from './me';
import agency from './agency';
import countryCodes from './countryCodes';
import service from './service';

export default {
  typeDef: `
    type Query {
      me: Subject
      agency(uuid: ID, subdomainName: String): Agency
      countryCodes: [String!]!
      service(uuid: ID!): Service
    }
  `,
  resolvers: {
    Query: {
      me,
      agency,
      countryCodes,
      service
    }
  }
};
