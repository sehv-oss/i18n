import { FormatterCache } from '../caches/formatter.ts';

/**
 * Options for {@link FormatNumber.format}: every `Intl.NumberFormat` option, plus a locale override.
 */
export type FormatNumberOptions = Intl.NumberFormatOptions & {
  /**
   * Locale to format in, overriding the one the caller would otherwise use.
   * Read by `I18nInstance.formatNumber` before it delegates here.
   */
  locale?: string;
};

const cache = new FormatterCache(Intl.NumberFormat);

/**
 * Standalone number formatting, for code that has a locale but no i18n instance.
 * `Intl.NumberFormat` objects are cached per locale and options, so repeated calls with the same shape reuse one formatter.
 *
 * Importable on its own from `@sehv-oss/i18n/formatters`.
 */
export class FormatNumber {
  /**
   * @param locale - BCP 47 tag to format in.
   * @param options - Passed to `Intl.NumberFormat`. Its `locale` field is ignored here — the explicit `locale` argument wins.
   *
   * @example
   * ```ts
   * FormatNumber.format(1234.56, 'de-DE'); // "1.234,56"
   * ```
   */
  public static format(
    value: number,
    locale: string,
    options?: FormatNumberOptions
  ): string {
    const { locale: _, ...formatOptions } = options ?? {};
    const formatter = cache.get(locale, formatOptions);

    return formatter.format(value);
  }
}
