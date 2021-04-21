import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { createDefaultQueryResolversForResource } from '../../util';

const resource = {
  name: 'form field',
  table_name: 'form_field'
} as const;

export const FormField: GqlTypeDefinition = {
  typeDef: gql`
    type FormField implements Node {
      id: ID!
      name: String!
      label: String!
      type: String!
      default: Json
    }

    input FormFieldFilter {
      form_id: ID
    }

    extend type Query {
      form_field(id: ID!): FormField
      form_fields(filter: FormFieldFilter!): [FormField!]
    }
  `,
  resolvers: {
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
