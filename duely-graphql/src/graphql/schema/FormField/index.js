export const FormField = {
  typeDef: `
    type FormField implements Node {
      id: ID!
      name: String!
      label: String!
      type: String!
      default: String
    }
  `
};
