import { BoundedCache } from './bounded.ts';

/**
 * Builds a formatter for one locale and one set of options.
 *
 * A factory rather than a constructor, because not every `Intl` formatter takes its options optionally —
 * `Intl.DisplayNames` requires them.
 *
 * @internal
 */
type FormatterFactory<TFormatter, TFormatterOptions> = (
  locale: string,
  options?: TFormatterOptions
) => TFormatter;

/**
 * Caches `Intl` formatter instances by locale and options.
 *
 * Bounded, so a long-lived process formatting many locale and option combinations does not grow without limit.
 *
 * @internal
 */
export class FormatterCache<TFormatter, TFormatterOptions> {
  private cache: BoundedCache<TFormatter>;

  constructor(
    private readonly factory: FormatterFactory<TFormatter, TFormatterOptions>,
    maxSize: number = 100
  ) {
    this.cache = new BoundedCache<TFormatter>(maxSize);
  }

  get(locale: string, options?: TFormatterOptions): TFormatter {
    const key = this.buildKey(locale, options);

    let formatter = this.cache.get(key);
    if (!formatter) {
      formatter = this.factory(locale, options);
      this.cache.set(key, formatter);
    }

    return formatter;
  }

  clear(): void {
    this.cache.clear();
  }

  private buildKey(locale: string, options?: TFormatterOptions): string {
    if (!options) return locale;

    return `${locale}:${JSON.stringify(options)}`;
  }
}
