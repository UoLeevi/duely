import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

export const FormField: GqlTypeDefinition = {
  typeDef: gql`
    type FormField implements Node {
      id: ID!
      name: String!
      label: String!
      type: String!
      default: Json
    }
  `
};
