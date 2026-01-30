import { FormatterCache } from '../caches/formatter.ts';

export type FormatNumberOptions = Intl.NumberFormatOptions & {
  locale?: string;
};

const cache = new FormatterCache(Intl.NumberFormat);

export class FormatNumber {
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
