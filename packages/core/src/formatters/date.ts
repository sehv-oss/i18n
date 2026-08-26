import { FormatterCache } from '../caches/formatter.ts';

/**
 * Options for {@link FormatDate.format}: every `Intl.DateTimeFormat` option, plus a locale override.
 */
export type FormatDateOptions = Intl.DateTimeFormatOptions & {
  /**
   * Locale to format in, overriding the one the caller would otherwise use.
   * Read by `I18nInstance.formatDate` before it delegates here.
   */
  locale?: string;
};

const cache = new FormatterCache(Intl.DateTimeFormat);

/**
 * Standalone date and time formatting, for code that has a locale but no i18n instance.
 * `Intl.DateTimeFormat` objects are cached per locale and options, so repeated calls with the same shape reuse one formatter.
 *
 * Importable on its own from `@sehv-oss/i18n/formatters`.
 */
export class FormatDate {
  /**
   * @param value - A `Date`, or a timestamp in milliseconds.
   * @param locale - BCP 47 tag to format in.
   * @param options - Passed to `Intl.DateTimeFormat`. Its `locale` field is ignored here — the explicit `locale` argument wins.
   *
   * @example
   * ```ts
   * FormatDate.format(new Date(), 'en-US', { dateStyle: 'long' });
   * // "January 27, 2026"
   * ```
   */
  public static format(
    value: Date | number,
    locale: string,
    options?: FormatDateOptions
  ): string {
    const { locale: _, ...formatOptions } = options ?? {};
    const formatter = cache.get(locale, formatOptions);

    return formatter.format(value);
  }
}
