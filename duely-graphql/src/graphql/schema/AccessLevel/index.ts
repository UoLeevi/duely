import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

export const AccessLevel: GqlTypeDefinition = {
  typeDef: gql`
    enum AccessLevel {
      OWNER
      MANAGER
      AGENT
      CLIENT
      PUBLIC
    }
  `,
  resolvers: {
    AccessLevel: {
      OWNER: 'owner',
      MANAGER: 'manager',
      AGENT: 'agent',
      CLIENT: 'client',
      PUBLIC: 'public'
    }
  }
};
