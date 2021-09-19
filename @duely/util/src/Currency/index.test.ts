import { numberToMinorCurrencyAmount, minorCurrencyAmountToNumber, formatCurrency } from '.';

test('numberToMinorCurrencyAmount', () => {
  // upper case currency code
  expect(numberToMinorCurrencyAmount(5, 'USD')).toBe(500);
  expect(numberToMinorCurrencyAmount(5.01, 'USD')).toBe(501);
  expect(numberToMinorCurrencyAmount(1234.56, 'EUR')).toBe(123456);
  expect(numberToMinorCurrencyAmount(1234, 'JPY')).toBe(1234);
  // lower case currency code
  expect(numberToMinorCurrencyAmount(5, 'usd')).toBe(500);
  expect(numberToMinorCurrencyAmount(5.01, 'usd')).toBe(501);
  expect(numberToMinorCurrencyAmount(1234.56, 'eur')).toBe(123456);
  expect(numberToMinorCurrencyAmount(1234, 'jpy')).toBe(1234);
});

test('minorCurrencyAmountToNumber', () => {
  // upper case currency code
  expect(minorCurrencyAmountToNumber(500, 'USD')).toBe(5);
  expect(minorCurrencyAmountToNumber(501, 'USD')).toBe(5.01);
  expect(minorCurrencyAmountToNumber(123456, 'EUR')).toBe(1234.56);
  expect(minorCurrencyAmountToNumber(1234, 'JPY')).toBe(1234);
  // lower case currency code
  expect(minorCurrencyAmountToNumber(500, 'usd')).toBe(5);
  expect(minorCurrencyAmountToNumber(501, 'usd')).toBe(5.01);
  expect(minorCurrencyAmountToNumber(123456, 'eur')).toBe(1234.56);
  expect(minorCurrencyAmountToNumber(1234, 'jpy')).toBe(1234);
});

test('formatCurrency', () => {
  // upper case currency code
  expect(formatCurrency(500, 'USD')).toBeDefined();
  expect(formatCurrency(501, 'USD')).toBeDefined();
  expect(formatCurrency(123456, 'EUR')).toBeDefined();
  expect(formatCurrency(1234, 'JPY')).toBeDefined();
  // lower case currency code
  expect(formatCurrency(500, 'usd')).toBeDefined();
  expect(formatCurrency(501, 'usd')).toBeDefined();
  expect(formatCurrency(123456, 'eur')).toBeDefined();
  expect(formatCurrency(1234, 'jpy')).toBeDefined();
});
