import { FormatterCache } from '../caches/formatter.ts';

/**
 * A duration as a bag of units, matching what `Intl.DurationFormat` accepts.
 *
 * @example
 * ```ts
 * const duration: FormatDurationInput = { hours: 1, minutes: 30 };
 * ```
 */
export type FormatDurationInput = Partial<
  Record<Intl.DurationFormatUnit, number>
>;

/**
 * Options for {@link FormatDuration.format}: every `Intl.DurationFormat` option, plus a locale override.
 */
export type FormatDurationOptions = Intl.DurationFormatOptions & {
  /**
   * Locale to format in, overriding the one the caller would otherwise use.
   * Read by `I18nInstance.formatDuration` before it delegates here.
   */
  locale?: string;
};

const cache = new FormatterCache(
  (locale: string, options?: Intl.DurationFormatOptions) =>
    new Intl.DurationFormat(locale, options)
);

/**
 * Standalone duration formatting, for code that has a locale but no i18n instance.
 *
 * `Intl.DurationFormat` is newer than the rest of the `Intl` API — it is present in Node 24+ and in
 * current browsers, and absent in older Safari and Firefox. Feature-detect it before calling this on
 * a client you do not control:
 *
 * ```ts
 * if ('DurationFormat' in Intl) { … }
 * ```
 *
 * Importable on its own from `@sehv-oss/i18n/formatters`.
 */
export class FormatDuration {
  /**
   * @param value - The duration, as units to values.
   * @param locale - BCP 47 tag to format in.
   * @param options - Passed to `Intl.DurationFormat`. Its `locale` field is ignored here — the explicit `locale` argument wins.
   * @returns The formatted duration.
   *
   * @example
   * ```ts
   * FormatDuration.format({ hours: 1, minutes: 30 }, 'pt-BR', { style: 'long' });
   * // "1 hora e 30 minutos"
   * ```
   */
  public static format(
    value: FormatDurationInput,
    locale: string,
    options?: FormatDurationOptions
  ): string {
    const { locale: _, ...formatOptions } = options ?? {};
    const formatter = cache.get(locale, formatOptions);

    return formatter.format(value);
  }

  /**
   * Empties the cached `Intl.DurationFormat` instances.
   */
  public static clearCache(): void {
    cache.clear();
  }
}
