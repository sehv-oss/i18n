import { FormatterCache } from '../caches/formatter.ts';

/**
 * Options for {@link FormatDisplayName.format}: every `Intl.DisplayNames` option, plus a locale override.
 *
 * `type` is required, the same way `Intl.DisplayNames` requires it.
 */
export type FormatDisplayNameOptions = Intl.DisplayNamesOptions & {
  /**
   * Locale to format in, overriding the one the caller would otherwise use.
   * Read by `I18nInstance.formatDisplayName` before it delegates here.
   */
  locale?: string;
};

const cache = new FormatterCache(
  (locale: string, options?: Intl.DisplayNamesOptions) =>
    new Intl.DisplayNames(locale, options ?? { type: 'language' })
);

/**
 * Standalone display-name formatting, for code that has a locale but no i18n instance.
 *
 * This is what a language switcher renders: the name of a locale, written in the language the reader
 * is currently using. `Intl.DisplayNames` objects are cached per locale and options.
 *
 * Importable on its own from `@sehv-oss/i18n/formatters`.
 */
export class FormatDisplayName {
  /**
   * @param value - The code to name: a BCP 47 tag, region code, script code or currency code, matching `options.type`.
   * @param locale - BCP 47 tag to write the name in.
   * @param options - Passed to `Intl.DisplayNames`. Its `locale` field is ignored here — the explicit `locale` argument wins.
   * @returns The display name, or `value` itself when the runtime has none.
   *
   * @example
   * ```ts
   * FormatDisplayName.format('en-US', 'pt-BR', { type: 'language' });
   * // "inglês (Estados Unidos)"
   * ```
   */
  public static format(
    value: string,
    locale: string,
    options: FormatDisplayNameOptions
  ): string {
    const { locale: _, ...formatOptions } = options;
    const formatter = cache.get(locale, formatOptions);

    return formatter.of(value) ?? value;
  }

  /**
   * Empties the cached `Intl.DisplayNames` instances.
   */
  public static clearCache(): void {
    cache.clear();
  }
}
