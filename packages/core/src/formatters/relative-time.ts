import { FormatterCache } from '../caches/formatter.ts';

/**
 * Time units accepted by {@link FormatRelativeTime.format}.
 *
 * Singular and plural spellings are interchangeable — `'day'` and `'days'` both normalize to the `Intl.RelativeTimeFormat` singular,
 * so the call site can read naturally next to its value.
 */
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

/**
 * Options for {@link FormatRelativeTime.format}: every `Intl.RelativeTimeFormatOptions` option, plus a locale override.
 */
export type FormatRelativeTimeOptions = Intl.RelativeTimeFormatOptions & {
  /**
   * Locale to format in, overriding the one the caller would otherwise use.
   * Read by `I18nInstance.formatRelativeTime` before it delegates here.
   */
  locale?: string;
};

const cache = new FormatterCache(
  (locale: string, options?: Intl.RelativeTimeFormatOptions) =>
    new Intl.RelativeTimeFormat(locale, options)
);

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

/**
 * Standalone relative time formatting, for code that has a locale but no i18n instance.
 * `Intl.RelativeTimeFormat` objects are cached per locale and options, so repeated calls with the same shape reuse one formatter.
 *
 * Importable on its own from `@sehv-oss/i18n/formatters`.
 */
export class FormatRelativeTime {
  /**
   * @param value - Offset from now. Negative points to the past.
   * @param unit - Singular or plural, both accepted.
   * @param locale - BCP 47 tag to format in.
   * @param options - Passed to `Intl.RelativeTimeFormat`. Its `locale` field is ignored here — the explicit `locale` argument wins.
   *
   * @example
   * ```ts
   * FormatRelativeTime.format(-2, 'days', 'en-US'); // "2 days ago"
   * FormatRelativeTime.format(1, 'hour', 'en-US'); // "in 1 hour"
   * ```
   */
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

  /**
   * Empties the cached `Intl` formatter instances.
   *
   * Rarely needed in an application; useful in a long-lived process that has finished with a set of
   * locales, and in tests that assert on instance identity.
   */
  public static clearCache(): void {
    cache.clear();
  }
}
