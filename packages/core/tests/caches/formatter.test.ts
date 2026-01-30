import { describe, it, expect } from 'vitest';
import { FormatterCache } from '../../src/caches/formatter.ts';

describe('FormatterCache', () => {
  it('should create and cache formatter instances', () => {
    const cache = new FormatterCache(Intl.NumberFormat);

    const formatter1 = cache.get('en');
    const formatter2 = cache.get('en');

    expect(formatter1).toBe(formatter2);
  });

  it('should create different instances for different locales', () => {
    const cache = new FormatterCache(Intl.NumberFormat);

    const formatterEn = cache.get('en');
    const formatterPt = cache.get('pt-BR');

    expect(formatterEn).not.toBe(formatterPt);
  });

  it('should create different instances for different options', () => {
    const cache = new FormatterCache(Intl.NumberFormat);

    const formatter1 = cache.get('en', { minimumFractionDigits: 2 });
    const formatter2 = cache.get('en', { minimumFractionDigits: 4 });

    expect(formatter1).not.toBe(formatter2);
  });

  it('should cache instances with same locale and options', () => {
    const cache = new FormatterCache(Intl.NumberFormat);
    const options = { minimumFractionDigits: 2 };

    const formatter1 = cache.get('en', options);
    const formatter2 = cache.get('en', options);

    expect(formatter1).toBe(formatter2);
  });

  it('should clear the cache', () => {
    const cache = new FormatterCache(Intl.NumberFormat);

    const formatter1 = cache.get('en');
    cache.clear();
    const formatter2 = cache.get('en');

    expect(formatter1).not.toBe(formatter2);
  });
});
