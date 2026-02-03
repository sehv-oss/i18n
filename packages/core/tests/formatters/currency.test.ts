import { expect, test } from 'vitest';
import { FormatCurrency } from '../../src/formatters/currency.ts';

test('should format currency with USD', () => {
  const result = FormatCurrency.format(99.9, 'USD', 'en');

  expect(result).toBe('$99.90');
});

test('should format currency with EUR', () => {
  const result = FormatCurrency.format(99.9, 'EUR', 'de');

  expect(result).toBe('99,90 €');
});

test('should format currency with maximumFractionDigits option', () => {
  const result = FormatCurrency.format(99.9, 'USD', 'en', {
    maximumFractionDigits: 0,
  });

  expect(result).toBe('$100');
});
