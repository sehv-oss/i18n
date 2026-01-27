import { FormatterCache } from '../cache.ts';
import type { FormatCurrencyOptions } from '../types.ts';

const cache = new FormatterCache(Intl.NumberFormat);

export function formatCurrency(
  value: number,
  currency: string,
  locale: string,
  options?: FormatCurrencyOptions
): string {
  const { locale: _, ...formatOptions } = options ?? {};
  const formatter = cache.get(locale, {
    ...formatOptions,
    style: 'currency',
    currency,
  });
  return formatter.format(value);
}
