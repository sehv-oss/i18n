import { FormatterCache } from '../cache.ts';
import type { FormatDateOptions } from '../types.ts';

const cache = new FormatterCache(Intl.DateTimeFormat);

export function formatDate(
  value: Date | number,
  locale: string,
  options?: FormatDateOptions
): string {
  const { locale: _, ...formatOptions } = options ?? {};
  const formatter = cache.get(locale, formatOptions);
  return formatter.format(value);
}
