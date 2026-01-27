import { FormatterCache } from '../cache.ts';
import type { FormatRelativeTimeOptions, RelativeTimeUnit } from '../types.ts';

const cache = new FormatterCache(Intl.RelativeTimeFormat);

const unitMap: Record<RelativeTimeUnit, Intl.RelativeTimeFormatUnit> = {
  year: 'year',
  years: 'year',
  quarter: 'quarter',
  quarters: 'quarter',
  month: 'month',
  months: 'month',
  week: 'week',
  weeks: 'week',
  day: 'day',
  days: 'day',
  hour: 'hour',
  hours: 'hour',
  minute: 'minute',
  minutes: 'minute',
  second: 'second',
  seconds: 'second',
};

export function formatRelativeTime(
  value: number,
  unit: RelativeTimeUnit,
  locale: string,
  options?: FormatRelativeTimeOptions
): string {
  const { locale: _, ...formatOptions } = options ?? {};
  const formatter = cache.get(locale, formatOptions);
  const normalizedUnit = unitMap[unit];
  return formatter.format(value, normalizedUnit);
}
