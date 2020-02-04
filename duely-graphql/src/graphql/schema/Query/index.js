import me from './me';
import agency from './agency';
import service from './service';
import countryCodes from './countryCodes';

export default {
  typeDef: `
    type Query {
      me: Subject
      agency(uuid: ID, subdomainName: String): Agency
      service(uuid: ID!): Service
      countryCodes: [String!]!
    }
  `,
  resolvers: {
    Query: {
      me,
      agency,
      service,
      countryCodes
    }
  }
};
