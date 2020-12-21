import stripe from '../../../stripe';

let countryCodesPromise = null;

async function fetchCountryCodes() {
  let has_more = true;
  let countryCodes = [];
  let starting_after = null;

  while (has_more) {
    const res = await stripe.countrySpecs.list(starting_after
      ? { limit: 100, starting_after }
      : { limit: 100 });

    countryCodes.push(...res.data.map(s => s.id));
    starting_after = countryCodes[countryCodes.length - 1];
    has_more = res.has_more;
  }

  return countryCodes;
}

export default async function countryCodes(obj, args, context, info) {
  if (!context.jwt)
    throw new Error('Unauthorized');

  if (countryCodesPromise === null)
    countryCodesPromise = fetchCountryCodes();

  return await countryCodesPromise;
};
