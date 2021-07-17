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
      hint: String
      prefix: String
      suffix: String
      required: Boolean!
      type: String!
      default: Json
    }

    input FormFieldFilter {
      form_id: ID
    }

    extend type Query {
      form_field(id: ID!): FormField
      form_fields(filter: FormFieldFilter!, token: String, desc: Boolean, order_by: String, limit: Number, after_id: ID): [FormField!]
    }
  `,
  resolvers: {
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
