import { FormatterCache } from '../cache.ts';
import type { FormatNumberOptions } from '../types.ts';

const cache = new FormatterCache(Intl.NumberFormat);

export function formatNumber(
  value: number,
  locale: string,
  options?: FormatNumberOptions
): string {
  const { locale: _, ...formatOptions } = options ?? {};
  const formatter = cache.get(locale, formatOptions);
  return formatter.format(value);
}
