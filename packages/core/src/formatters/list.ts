import { FormatterCache } from '../cache.ts';
import type { FormatListOptions } from '../types.ts';

const cache = new FormatterCache(Intl.ListFormat);

export function formatList(
  values: string[],
  locale: string,
  options?: FormatListOptions
): string {
  const { locale: _, ...formatOptions } = options ?? {};
  const formatter = cache.get(locale, formatOptions);
  return formatter.format(values);
}
