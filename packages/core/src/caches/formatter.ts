type FormatterConstructor<TFormatter, TFormatterOptions> = new (
  locale: string,
  options?: TFormatterOptions
) => TFormatter;

export class FormatterCache<TFormatter, TFormatterOptions> {
  private cache = new Map<string, TFormatter>();

  constructor(
    private readonly Formatter: FormatterConstructor<
      TFormatter,
      TFormatterOptions
    >
  ) {}

  get(locale: string, options?: TFormatterOptions): TFormatter {
    const key = this.buildKey(locale, options);

    let formatter = this.cache.get(key);
    if (!formatter) {
      formatter = new this.Formatter(locale, options);
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
