import { FormatterCache } from '../caches/formatter.ts';

export type FormatDateOptions = Intl.DateTimeFormatOptions & {
  locale?: string;
};

const cache = new FormatterCache(Intl.DateTimeFormat);

export class FormatDate {
  public static format(
    value: Date | number,
    locale: string,
    options?: FormatDateOptions
  ): string {
    const { locale: _, ...formatOptions } = options ?? {};
    const formatter = cache.get(locale, formatOptions);

    return formatter.format(value);
  }
}
