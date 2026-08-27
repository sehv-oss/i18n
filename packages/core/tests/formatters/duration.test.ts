import { expect, test } from 'vitest';
import { FormatDuration } from '../../src/formatters/duration.ts';

test('should format a duration in the long style', () => {
  expect(
    FormatDuration.format({ hours: 1, minutes: 30 }, 'pt-BR', { style: 'long' })
  ).toBe('1 hora e 30 minutos');
});

test('should format a duration in the digital style', () => {
  expect(
    FormatDuration.format({ hours: 1, minutes: 30, seconds: 5 }, 'en', {
      style: 'digital',
    })
  ).toBe('1:30:05');
});

test('should format with no options', () => {
  expect(FormatDuration.format({ minutes: 5 }, 'en')).toContain('5');
});
