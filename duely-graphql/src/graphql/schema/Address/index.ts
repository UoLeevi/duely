import gql from 'graphql-tag';
import Stripe from 'stripe';
import { GqlTypeDefinition } from '../../types';

export const Address: GqlTypeDefinition<Stripe.Address> = {
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
