import me from './me';
import agency from './agency';
import countrySpecs from './countrySpecs';

export default {
  typeDef: `
    type Query {
      me: Subject
      agency(uuid: ID, subdomainName: String): [Agency!]
      countrySpecs: String!
    }
  `,
  resolvers: {
    Query: {
      me,
      agency,
      countrySpecs
    }
  }
};
