import { FormatterCache } from '../caches/formatter.ts';

export type FormatCurrencyOptions = Omit<Intl.NumberFormatOptions, 'style'> & {
  locale?: string;
};

const cache = new FormatterCache(Intl.NumberFormat);

export class FormatCurrency {
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
