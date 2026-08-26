import { FormatterCache } from '../caches/formatter.ts';

/**
 * Options for {@link FormatCurrency.format}: the `Intl.NumberFormat` options, minus `style` — which is fixed to `'currency'` — plus a locale override.
 */
export type FormatCurrencyOptions = Omit<Intl.NumberFormatOptions, 'style'> & {
  /**
   * Locale to format in, overriding the one the caller would otherwise use.
   * Read by `I18nInstance.formatCurrency` before it delegates here.
   */
  locale?: string;
};

const cache = new FormatterCache(Intl.NumberFormat);

/**
 * Standalone currency formatting, for code that has a locale but no i18n instance.
 * `Intl.NumberFormat` objects are cached per locale and options, so repeated calls with the same shape reuse one formatter.
 *
 * Importable on its own from `@sehv-oss/i18n/formatters`.
 */
export class FormatCurrency {
  /**
   * @param currency - ISO 4217 code, such as `'USD'` or `'BRL'`.
   * @param locale - BCP 47 tag to format in.
   * @param options - Passed to `Intl.NumberFormat`. Its `locale` field is ignored here — the explicit `locale` argument wins.
   *
   * @example
   * ```ts
   * FormatCurrency.format(99.9, 'USD', 'en-US'); // "$99.90"
   * ```
   */
  public static format(
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
}
