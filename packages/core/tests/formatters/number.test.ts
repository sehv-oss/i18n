import { expect, test } from 'vitest';
import { FormatNumber } from '../../src/formatters/number.ts';

test('should format numbers with default options', () => {
  const result = FormatNumber.format(1234.56, 'en');

  expect(result).toBe('1,234.56');
});

test('should format numbers for different locales', () => {
  const resultEn = FormatNumber.format(1234.56, 'en');
  const resultDe = FormatNumber.format(1234.56, 'de');

  expect(resultEn).toBe('1,234.56');
  expect(resultDe).toBe('1.234,56');
});

test('should format numbers with custom options', () => {
  const result = FormatNumber.format(1234.5, 'en', {
    minimumFractionDigits: 3,
  });

  expect(result).toBe('1,234.500');
});
