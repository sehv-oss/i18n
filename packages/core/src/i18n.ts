import { MessageCache } from './caches/message.ts';
import {
  FormatCurrency,
  type FormatCurrencyOptions,
} from './formatters/currency.ts';
import { FormatDate, type FormatDateOptions } from './formatters/date.ts';
import { FormatList, type FormatListOptions } from './formatters/list.ts';
import { FormatNumber, type FormatNumberOptions } from './formatters/number.ts';
import {
  FormatRelativeTime,
  type FormatRelativeTimeOptions,
  type FormatRelativeTimeUnit,
} from './formatters/relative-time.ts';
import { JsonLoader } from './loaders/json-loader.ts';
import type { ILoader } from './loaders/loader.interface.ts';
import { type Messages, MessagesManager } from './messages/messages.ts';
import { MF2Parser } from './parsers/mf2-parser.ts';

export type I18nConfig = {
  locale: string;
  fallbackLocale?: string;
  messages?: Record<string, Messages>;
  loaders?: ILoader[];
};

export class I18nInstance {
  private locale: string;
  private fallbackLocale: string | undefined;
  private messagesManager: MessagesManager;
  private messageCache: MessageCache;
  private loaders: ILoader[];
  private mf2ParserByLocale: Map<string, MF2Parser>;

  constructor(config: I18nConfig) {
    const { locale, fallbackLocale, loaders, messages } = config;

    this.locale = locale;
    this.fallbackLocale = fallbackLocale;
    this.messagesManager = new MessagesManager();
    this.messageCache = new MessageCache();
    this.mf2ParserByLocale = new Map();
    this.loaders = [new JsonLoader(), ...(loaders ?? [])];

    if (messages) {
      Object.entries(messages).forEach(([locale, messagesLocale]) => {
        this.messagesManager.set(locale, messagesLocale);
      });
    }
  }

  public getLocale(): string {
    return this.locale;
  }

  public setLocale(locale: string): void {
    this.locale = locale;
    this.messageCache.clear();
  }

  public getFallbackLocale(): string | undefined {
    return this.fallbackLocale;
  }

  public getLocales(): string[] {
    return this.messagesManager.getLocales();
  }

  public translate(key: string, values?: Record<string, unknown>): string {
    const cacheKey = `${this.locale}:${key}:${JSON.stringify(values ?? {})}`;

    if (this.messageCache.has(cacheKey)) {
      return this.messageCache.get(cacheKey)!;
    }

    let message = this.messagesManager.getMessage(this.locale, key);
    if (!message && this.fallbackLocale) {
      message = this.messagesManager.getMessage(this.fallbackLocale, key);
    }

    if (!message) {
      return key;
    }

    const parser = this.getParser(this.locale);
    const result = parser.parse(message, values);

    this.messageCache.set(cacheKey, result);
    return result;
  }

  public formatNumber(value: number, options?: FormatNumberOptions): string {
    const locale = options?.locale ?? this.locale;

    return FormatNumber.format(value, locale, options);
  }

  public formatCurrency(
    value: number,
    currency: string,
    options?: FormatCurrencyOptions
  ): string {
    const locale = options?.locale ?? this.locale;

    return FormatCurrency.format(value, currency, locale, options);
  }

  public formatDate(value: Date | number, options?: FormatDateOptions): string {
    const locale = options?.locale ?? this.locale;

    return FormatDate.format(value, locale, options);
  }

  public formatList(values: string[], options?: FormatListOptions): string {
    const locale = options?.locale ?? this.locale;

    return FormatList.format(values, locale, options);
  }

  public formatRelativeTime(
    value: number,
    unit: FormatRelativeTimeUnit,
    options?: FormatRelativeTimeOptions
  ): string {
    const locale = options?.locale ?? this.locale;

    return FormatRelativeTime.format(value, unit, locale, options);
  }

  public loadMessages(locale: string, messages: Messages): void {
    this.messagesManager.set(locale, messages);
    this.messageCache.clear();
  }

  public async loadMessagesAsync(url: string): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to load messages from ${url}: ${response.statusText}.`
      );
    }

    const content = await response.text();
    const loader = this.findLoader(url);

    if (!loader) {
      throw new Error(`No loader found for ${url}.`);
    }

    const messages = loader.parse(content);
    const locale = this.extractLocaleFromUrl(url);

    this.loadMessages(locale, messages);
  }

  private getParser(locale: string): MF2Parser {
    let parser = this.mf2ParserByLocale.get(locale);
    if (!parser) {
      parser = new MF2Parser(locale);
      this.mf2ParserByLocale.set(locale, parser);
    }

    return parser;
  }

  private findLoader(url: string): ILoader | undefined {
    const extension = this.getExtension(url);

    return this.loaders.find((loader) => loader.extensions.includes(extension));
  }

  private getExtension(url: string): string {
    const match = url.match(/\.[^.]+$/);

    return match?.[0] ?? '';
  }

  private extractLocaleFromUrl(url: string): string {
    const filename = url.split('/').pop() ?? '';
    const match = filename.match(/^([a-z]{2}(?:-[A-Z]{2})?)/);

    return match?.[1] ?? this.locale;
  }
}

export function createI18n(config: I18nConfig): I18nInstance {
  return new I18nInstance(config);
}

export * from './formatters/formatters.ts';
export type * from './loaders/loader.interface.ts';
