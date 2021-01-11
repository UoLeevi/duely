import axios from 'axios';
import gql from 'graphql-tag';

let updateDateString: string | null = null;
let exchangeRatesPromise: Promise<Record<string, number> | null> | null = null;
let previousRates: Record<string, number> | null = null;
let date: Date | null;

export async function convertCurrency(amount: number, currency: string) {
  currency = currency.toUpperCase();
  if (currency === 'EUR') return amount;
  const rates = await fetchExhangeRates();
  const rate = rates?.[currency];
  return rate ? 1 / rate * amount : null;
}

// see: https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html
function fetchExhangeRates() {
  const today = new Date();
  const todayString = today.toDateString();

  if (todayString === updateDateString && exchangeRatesPromise) {
    return exchangeRatesPromise;
  }

  exchangeRatesPromise = axios
    .get<string>('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', {
      responseType: 'text'
    })
    .then((res) => {
      const xml = res.data;
      const rates = Object.fromEntries(
        Array.from(
          xml.matchAll(/<Cube currency=['"](\w\w\w)['"] rate=['"](\d+\.?\d*)['"]\/>/g)
        ).map((match) => [match[1], +match[2]])
      );
      updateDateString = todayString;
      previousRates = rates;
      date = new Date(Date.parse(xml.match(/<Cube time=['"](\d\d\d\d-\d\d-\d\d)['"]>/)![1]));
      return rates;
    })
    .catch((err) => previousRates);

  return exchangeRatesPromise;
}

export const ExchangeRate = {
  typeDef: gql`
    type ExchangeRate {
      date: Date!
      currency: String!
      rate_eur: Float!
    }

    extend type Query {
      exchange_rate(currency: String!): ExchangeRate
    }
  `,
  resolvers: {
    Query: {
      async exchange_rate(
        source: unknown,
        { currency }: { currency: string },
        context: { jwt?: string; ip?: string }
      ) {
        if (!context.jwt) throw new Error('Unauthorized');
        const rates = await fetchExhangeRates();
        currency = currency.toUpperCase();
        return {
          date,
          currency,
          rate_eur: rates?.[currency]
        };
      }
    }
  }
};
