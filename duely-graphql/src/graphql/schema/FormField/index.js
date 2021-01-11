import gql from 'graphql-tag';

export const FormField = {
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
