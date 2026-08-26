import { FormatterCache } from '../caches/formatter.ts';

/**
 * Options for {@link FormatList.format}: every `Intl.ListFormat` option, plus a locale override.
 */
export type FormatListOptions = Intl.ListFormatOptions & {
  /**
   * Locale to format in, overriding the one the caller would otherwise use.
   * Read by `I18nInstance.formatList` before it delegates here.
   */
  locale?: string;
};

const cache = new FormatterCache(Intl.ListFormat);

/**
 * Standalone list formatting, for code that has a locale but no i18n instance.
 * `Intl.ListFormat` objects are cached per locale and options, so repeated calls with the same shape reuse one formatter.
 *
 * Importable on its own from `@sehv-oss/i18n/formatters`.
 */
export class FormatList {
  /**
   * @param values - Already formatted strings. They are joined, not translated.
   * @param locale - BCP 47 tag to format in.
   * @param options - Passed to `Intl.ListFormat`. Its `locale` field is ignored here — the explicit `locale` argument wins.
   *
   * @example
   * ```ts
   * FormatList.format(['apple', 'banana', 'orange'], 'en-US');
   * // "apple, banana, and orange"
   * ```
   */
  public static format(
    values: string[],
    locale: string,
    options?: FormatListOptions
  ): string {
    const { locale: _, ...formatOptions } = options ?? {};
    const formatter = cache.get(locale, formatOptions);

    return formatter.format(values);
  }
}
