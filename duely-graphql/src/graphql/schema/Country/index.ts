import gql from 'graphql-tag';
import Stripe from 'stripe';
import stripe from '../../../stripe';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';

let countriesPromise: Promise<Map<string, Stripe.CountrySpec>> | null = null;
let country_codes: string[];
let countries: Map<string, Stripe.CountrySpec> | null = null;

export async function fetchCountries() {
  if (countries !== null) return countries;

  let has_more = true;
  let countrySpecs = new Map<string, Stripe.CountrySpec>();
  let starting_after = null;

  while (has_more) {
    const res: Stripe.ApiList<Stripe.CountrySpec> = await stripe.live.countrySpecs.list(
      starting_after ? { limit: 100, starting_after } : { limit: 100 }
    );

    for (const countrySpec of res.data) {
      countrySpecs.set(countrySpec.id, countrySpec);
    }

    starting_after = res.data[res.data.length - 1].id;
    has_more = res.has_more;
  }

  countries = countrySpecs;
  country_codes = Array.from(countrySpecs.keys()).sort();

  return countrySpecs;
}

export const Country: GqlTypeDefinition = {
  typeDef: gql`
    type CountrySpec {
      id: ID!
      default_currency: String!
      supported_payment_currencies: [String!]!
      supported_payment_methods: [String!]!
      supported_transfer_countries: [String!]!
      verification_fields: CountrySpecVerificationFields
    }

    type CountrySpecVerificationFields {
      company: CountrySpecVerificationFieldsCompany
      individual: CountrySpecVerificationFieldsIndividual
    }

    type CountrySpecVerificationFieldsCompany {
      additional: [String!]!
      minimum: [String!]!
    }

    type CountrySpecVerificationFieldsIndividual {
      additional: [String!]!
      minimum: [String!]!
    }

    extend type Query {
      country_codes: [String!]!
      country_spec(country_code: ID!): CountrySpec
    }
  `,
  resolvers: {
    Query: {
      async country_codes(source, args, context) {
        if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");

        if (countriesPromise === null) {
          countriesPromise = fetchCountries();
        }

        await countriesPromise;
        return country_codes;
      },
      async country_spec(source, { country_code }, context) {
        if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");

        if (countriesPromise === null) {
          countriesPromise = fetchCountries();
        }

        await countriesPromise;
        return countries!.get(country_code);
      }
    }
  }
};
