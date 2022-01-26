// see: https://stripe.com/docs/currencies#presentment-currencies
export type CurrencyUppercase =
  | 'USD'
  | 'AED'
  | 'AFN'
  | 'ALL'
  | 'AMD'
  | 'ANG'
  | 'AOA'
  | 'ARS'
  | 'AUD'
  | 'AWG'
  | 'AZN'
  | 'BAM'
  | 'BBD'
  | 'BDT'
  | 'BGN'
  | 'BIF'
  | 'BMD'
  | 'BND'
  | 'BOB'
  | 'BRL'
  | 'BSD'
  | 'BWP'
  | 'BZD'
  | 'CAD'
  | 'CDF'
  | 'CHF'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'CRC'
  | 'CVE'
  | 'CZK'
  | 'DJF'
  | 'DKK'
  | 'DOP'
  | 'DZD'
  | 'EGP'
  | 'ETB'
  | 'EUR'
  | 'FJD'
  | 'FKP'
  | 'GBP'
  | 'GEL'
  | 'GIP'
  | 'GMD'
  | 'GNF'
  | 'GTQ'
  | 'GYD'
  | 'HKD'
  | 'HNL'
  | 'HRK'
  | 'HTG'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'ISK'
  | 'JMD'
  | 'JPY'
  | 'KES'
  | 'KGS'
  | 'KHR'
  | 'KMF'
  | 'KRW'
  | 'KYD'
  | 'KZT'
  | 'LAK'
  | 'LBP'
  | 'LKR'
  | 'LRD'
  | 'LSL'
  | 'MAD'
  | 'MDL'
  | 'MGA'
  | 'MKD'
  | 'MMK'
  | 'MNT'
  | 'MOP'
  | 'MRO'
  | 'MUR'
  | 'MVR'
  | 'MWK'
  | 'MXN'
  | 'MYR'
  | 'MZN'
  | 'NAD'
  | 'NGN'
  | 'NIO'
  | 'NOK'
  | 'NPR'
  | 'NZD'
  | 'PAB'
  | 'PEN'
  | 'PGK'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'PYG'
  | 'QAR'
  | 'RON'
  | 'RSD'
  | 'RUB'
  | 'RWF'
  | 'SAR'
  | 'SBD'
  | 'SCR'
  | 'SEK'
  | 'SGD'
  | 'SHP'
  | 'SLL'
  | 'SOS'
  | 'SRD'
  | 'STD'
  | 'SZL'
  | 'THB'
  | 'TJS'
  | 'TOP'
  | 'TRY'
  | 'TTD'
  | 'TWD'
  | 'TZS'
  | 'UAH'
  | 'UGX'
  | 'UYU'
  | 'UZS'
  | 'VND'
  | 'VUV'
  | 'WST'
  | 'XAF'
  | 'XCD'
  | 'XOF'
  | 'XPF'
  | 'YER'
  | 'ZAR'
  | 'ZMW';
export type CurrencyLowercase = Lowercase<CurrencyUppercase>;
export type Currency = CurrencyUppercase | CurrencyLowercase;

// see: https://stripe.com/docs/currencies#zero-decimal
const zeroDecimalCurrencies = new Set<CurrencyUppercase>([
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'JPY',
  'KMF',
  'KRW',
  'MGA',
  'PYG',
  'RWF',
  'UGX',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF'
]);

export function numberToMinorCurrencyAmount(number: number, currency: Currency): number {
  currency = currency.toUpperCase() as CurrencyUppercase;
  return zeroDecimalCurrencies.has(currency) ? number : Math.floor(number * 100);
}

export function minorCurrencyAmountToNumber(amount: number, currency: Currency): number {
  currency = currency.toUpperCase() as CurrencyUppercase;
  return zeroDecimalCurrencies.has(currency) ? amount : amount / 100;
}

export function formatCurrency(amount: number, currency: Currency, locales?: string): string {
  currency = currency.toUpperCase() as CurrencyUppercase;
  const number = minorCurrencyAmountToNumber(amount, currency);
  return new Intl.NumberFormat(locales, {
    currency,
    currencySign: 'accounting',
    style: 'currency'
  }).format(number);
}

export function formatPrice(price: {
  unit_amount?: number | null;
  currency: string;
  recurring?: { interval_count: number; interval: string } | null;
  recurring_interval?: string | null;
  recurring_interval_count?: number | null;
}): string {
  const amountPart = formatCurrency(price.unit_amount!, price.currency as Currency);
  const recurring_interval = price.recurring_interval ?? price.recurring?.interval;
  const recurring_interval_count =
    price.recurring_interval_count ?? price.recurring?.interval_count;
  if (!recurring_interval) return amountPart;
  if (recurring_interval_count === 1) return `${amountPart} / ${recurring_interval}`;
  return `${amountPart} / ${recurring_interval_count} ${recurring_interval}s`;
}
