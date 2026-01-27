type FormatterConstructor<T> = new (locale: string, options?: object) => T;

export class FormatterCache<T> {
  private cache = new Map<string, T>();

  constructor(private readonly Formatter: FormatterConstructor<T>) {}

  get(locale: string, options?: object): T {
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

  private buildKey(locale: string, options?: object): string {
    if (!options) return locale;
    return `${locale}:${JSON.stringify(options)}`;
  }
}

export class MessageCache {
  private cache = new Map<string, string>();
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
