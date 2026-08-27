import { expect, test } from 'vitest';
import {
  clearFormatterCaches,
  FormatNumber,
} from '../../src/formatters/formatters.ts';

test('should keep formatting correctly after the caches are cleared', () => {
  expect(FormatNumber.format(1234.56, 'en-US')).toBe('1,234.56');

  clearFormatterCaches();

  expect(FormatNumber.format(1234.56, 'en-US')).toBe('1,234.56');
});
