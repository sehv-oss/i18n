import { expect, test } from 'vitest';
import { FormatDate } from '../../src/formatters/date.ts';

test('should format dates with default options', () => {
  const date = new Date(2000, 0, 1);

  const result = FormatDate.format(date, 'en');

  expect(result).toBe('1/1/2000');
});

test('should format dates with dateStyle option', () => {
  const date = new Date(2000, 0, 1);

  const result = FormatDate.format(date, 'en', { dateStyle: 'long' });

  expect(result).toBe('January 1, 2000');
});

test('should format timestamps', () => {
  const timestamp = new Date(2000, 0, 1).getTime();
  const result = FormatDate.format(timestamp, 'en');

  expect(result).toBe('1/1/2000');
});
