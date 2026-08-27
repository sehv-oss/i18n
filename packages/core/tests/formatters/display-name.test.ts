import { expect, test } from 'vitest';
import { FormatDisplayName } from '../../src/formatters/display-name.ts';

test('should name a language in the given locale', () => {
  expect(FormatDisplayName.format('en-US', 'pt-BR', { type: 'language' })).toBe(
    'inglês (Estados Unidos)'
  );
});

test('should name a region', () => {
  expect(FormatDisplayName.format('BR', 'pt-BR', { type: 'region' })).toBe(
    'Brasil'
  );
});

test('should fall back to the code when there is no display name', () => {
  expect(
    FormatDisplayName.format('zzz', 'en', {
      type: 'language',
      fallback: 'none',
    })
  ).toBe('zzz');
});
