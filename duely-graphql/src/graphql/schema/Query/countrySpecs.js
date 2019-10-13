import stripe from '../../../stripe';
import { AuthenticationError } from 'apollo-server-core';

export default async function countrySpecs(obj, args, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const countrySpecs = await stripe.getCountrySpecs();

  return JSON.stringify(countrySpecs);
};
