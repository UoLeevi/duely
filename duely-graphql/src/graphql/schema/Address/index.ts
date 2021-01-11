import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

export const Address: GqlTypeDefinition = {
  typeDef: gql`
    type Address {
      city: String
      country: String
      line1: String
      line2: String
      postal_code: String
      state: String
    }
  `
};
