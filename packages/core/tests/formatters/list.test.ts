import { expect, test } from 'vitest';
import { FormatList } from '../../src/formatters/list.ts';

test('should format lists with default options', () => {
  const result = FormatList.format(['a', 'b', 'c'], 'en');

  expect(result).toBe('a, b, and c');
});

test('should format lists with disjunction type', () => {
  const result = FormatList.format(['a', 'b', 'c'], 'en', {
    type: 'disjunction',
  });

  expect(result).toBe('a, b, or c');
});

test('should format single item lists', () => {
  const result = FormatList.format(['a'], 'en');

  expect(result).toBe('a');
});

test('should format empty lists', () => {
  const result = FormatList.format([], 'en');

  expect(result).toBe('');
});
