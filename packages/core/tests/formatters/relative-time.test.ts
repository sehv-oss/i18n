import { expect, test } from 'vitest';
import { FormatRelativeTime } from '../../src/formatters/relative-time.ts';

test('should format relative time in the past', () => {
  const result = FormatRelativeTime.format(-2, 'days', 'en');

  expect(result).toBe('2 days ago');
});

test('should format relative time in the future', () => {
  const result = FormatRelativeTime.format(3, 'days', 'en');

  expect(result).toBe('in 3 days');
});

test('should normalize plural units', () => {
  const resultSingular = FormatRelativeTime.format(-1, 'day', 'en');
  const resultPlural = FormatRelativeTime.format(-1, 'days', 'en');

  expect(resultSingular).toBe(resultPlural);
});

test('should format different time units', () => {
  const hours = FormatRelativeTime.format(-5, 'hours', 'en');
  const minutes = FormatRelativeTime.format(-10, 'minutes', 'en');

  expect(hours).toBe('5 hours ago');
  expect(minutes).toBe('10 minutes ago');
});
