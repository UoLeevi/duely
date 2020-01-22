import me from './me';
import agency from './agency';
import countryCodes from './countryCodes';

export default {
  typeDef: `
    type Query {
      me: Subject
      agency(uuid: ID, subdomainName: String): [Agency!]
      countryCodes: [String!]!
    }
  `,
  resolvers: {
    Query: {
      me,
      agency,
      countryCodes
    }
  }
};
