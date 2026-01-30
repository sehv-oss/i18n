import { FormatterCache } from '../caches/formatter.ts';

export type FormatRelativeTimeUnit =
  | 'year'
  | 'years'
  | 'quarter'
  | 'quarters'
  | 'month'
  | 'months'
  | 'week'
  | 'weeks'
  | 'day'
  | 'days'
  | 'hour'
  | 'hours'
  | 'minute'
  | 'minutes'
  | 'second'
  | 'seconds';

export type FormatRelativeTimeOptions = Intl.RelativeTimeFormatOptions & {
  locale?: string;
};

const cache = new FormatterCache(Intl.RelativeTimeFormat);

const unitMap: Record<FormatRelativeTimeUnit, Intl.RelativeTimeFormatUnit> = {
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

export class FormatRelativeTime {
  public static format(
    value: number,
    unit: FormatRelativeTimeUnit,
    locale: string,
    options?: FormatRelativeTimeOptions
  ): string {
    const { locale: _, ...formatOptions } = options ?? {};
    const formatter = cache.get(locale, formatOptions);
    const normalizedUnit = unitMap[unit];

    return formatter.format(value, normalizedUnit);
  }
}
