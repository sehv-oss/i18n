import { FormatterCache } from '../caches/formatter.ts';

export type FormatListOptions = Intl.ListFormatOptions & {
  locale?: string;
};

const cache = new FormatterCache(Intl.ListFormat);

export class FormatList {
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
