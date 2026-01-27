export interface I18nConfig {
  locale: string;
  fallbackLocale?: string;
  messages?: Record<string, MessageDictionary>;
  loaders?: MessageLoader[];
}

export interface MessageDictionary {
  [key: string]: string | MessageDictionary;
}

export interface MessageLoader {
  extensions: string[];
  parse(content: string): MessageDictionary;
}

export interface MessageParser {
  parse(message: string, values?: Record<string, unknown>): string;
}

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string;
}

export interface FormatCurrencyOptions extends Omit<
  Intl.NumberFormatOptions,
  'style'
> {
  locale?: string;
}

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
}

export interface FormatListOptions extends Intl.ListFormatOptions {
  locale?: string;
}

export interface FormatRelativeTimeOptions
  extends Intl.RelativeTimeFormatOptions {
  locale?: string;
}

export type RelativeTimeUnit =
  | 'year'
  | 'years'
  | 'quarter'
  | 'quarters'
  | 'month'
  | 'months'
  | 'week'
  | 'weeks'
  | 'day'
  | 'days'
  | 'hour'
  | 'hours'
  | 'minute'
  | 'minutes'
  | 'second'
  | 'seconds';

export interface I18n {
  readonly locale: string;
  readonly fallbackLocale: string | undefined;

  setLocale(locale: string): void;
  getLocales(): string[];

  translate(key: string, values?: Record<string, unknown>): string;

  formatNumber(value: number, options?: FormatNumberOptions): string;
  formatCurrency(
    value: number,
    currency: string,
    options?: FormatCurrencyOptions
  ): string;
  formatDate(value: Date | number, options?: FormatDateOptions): string;
  formatList(values: string[], options?: FormatListOptions): string;
  formatRelativeTime(
    value: number,
    unit: RelativeTimeUnit,
    options?: FormatRelativeTimeOptions
  ): string;

  loadMessages(locale: string, messages: MessageDictionary): void;
  loadMessagesAsync(url: string): Promise<void>;

  registerLoader(loader: MessageLoader): void;
}
