import { expect, test } from 'vitest';
import { FormatterCache } from '../../src/caches/formatter.ts';

test('should reuse a formatter for the same locale and options', () => {
  const cache = new FormatterCache(
    (locale: string, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options)
  );

  expect(cache.get('en')).toBe(cache.get('en'));
  expect(cache.get('en', { style: 'percent' })).toBe(
    cache.get('en', { style: 'percent' })
  );
});

test('should build a different formatter per locale and per options', () => {
  const cache = new FormatterCache(
    (locale: string, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options)
  );

  expect(cache.get('en')).not.toBe(cache.get('pt-BR'));
  expect(cache.get('en')).not.toBe(cache.get('en', { style: 'percent' }));
});

test('should evict the oldest entry past maxSize', () => {
  let built = 0;
  const cache = new FormatterCache((locale: string) => {
    built++;

    return new Intl.NumberFormat(locale);
  }, 2);

  cache.get('en');
  cache.get('pt');
  cache.get('fr');
  cache.get('en');

  expect(built).toBe(4);
});

test('should rebuild after clear', () => {
  const cache = new FormatterCache(
    (locale: string) => new Intl.NumberFormat(locale)
  );

  const first = cache.get('en');
  cache.clear();

  expect(cache.get('en')).not.toBe(first);
});
