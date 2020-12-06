import { Currency } from '.';

test('properly converts to minor currency amount', () => {
  // upper case currency code
  expect(Currency.numberToMinorCurrencyAmount(5, 'USD')).toBe(500);
  expect(Currency.numberToMinorCurrencyAmount(5.01, 'USD')).toBe(501);
  expect(Currency.numberToMinorCurrencyAmount(1234.56, 'EUR')).toBe(123456);
  expect(Currency.numberToMinorCurrencyAmount(1234, 'JPY')).toBe(1234);
  // lower case currency code
  expect(Currency.numberToMinorCurrencyAmount(5, 'usd')).toBe(500);
  expect(Currency.numberToMinorCurrencyAmount(5.01, 'usd')).toBe(501);
  expect(Currency.numberToMinorCurrencyAmount(1234.56, 'eur')).toBe(123456);
  expect(Currency.numberToMinorCurrencyAmount(1234, 'jpy')).toBe(1234);
});

test('properly converts from minor currency amount', () => {
  // upper case currency code
  expect(Currency.minorCurrencyAmountToNumber(500, 'USD')).toBe(5);
  expect(Currency.minorCurrencyAmountToNumber(501, 'USD')).toBe(5.01);
  expect(Currency.minorCurrencyAmountToNumber(123456, 'EUR')).toBe(1234.56);
  expect(Currency.minorCurrencyAmountToNumber(1234, 'JPY')).toBe(1234);
  // lower case currency code
  expect(Currency.minorCurrencyAmountToNumber(500, 'usd')).toBe(5);
  expect(Currency.minorCurrencyAmountToNumber(501, 'usd')).toBe(5.01);
  expect(Currency.minorCurrencyAmountToNumber(123456, 'eur')).toBe(1234.56);
  expect(Currency.minorCurrencyAmountToNumber(1234, 'jpy')).toBe(1234);
});

test('properly converts from minor currency amount', () => {
  // upper case currency code
  expect(Currency.format(500, 'USD')).toBeDefined();
  expect(Currency.format(501, 'USD')).toBeDefined();
  expect(Currency.format(123456, 'EUR')).toBeDefined();
  expect(Currency.format(1234, 'JPY')).toBeDefined();
  // lower case currency code
  expect(Currency.format(500, 'usd')).toBeDefined();
  expect(Currency.format(501, 'usd')).toBeDefined();
  expect(Currency.format(123456, 'eur')).toBeDefined();
  expect(Currency.format(1234, 'jpy')).toBeDefined();
});
