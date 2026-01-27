import { MessageStore } from './message-store.ts';
import { MessageCache } from './cache.ts';
import { MF2Parser } from './parsers/mf2-parser.ts';
import { JsonLoader } from './loaders/json-loader.ts';
import { formatNumber as formatNumberFn } from './formatters/number.ts';
import { formatCurrency as formatCurrencyFn } from './formatters/currency.ts';
import { formatDate as formatDateFn } from './formatters/date.ts';
import { formatList as formatListFn } from './formatters/list.ts';
import { formatRelativeTime as formatRelativeTimeFn } from './formatters/relative-time.ts';
import type {
  I18n,
  I18nConfig,
  MessageDictionary,
  MessageLoader,
  FormatNumberOptions,
  FormatCurrencyOptions,
  FormatDateOptions,
  FormatListOptions,
  FormatRelativeTimeOptions,
  RelativeTimeUnit,
} from './types.ts';

export class I18nInstance implements I18n {
  private _locale: string;
  private _fallbackLocale: string | undefined;
  private store: MessageStore;
  private messageCache: MessageCache;
  private loaders: MessageLoader[];
  private parsers: Map<string, MF2Parser>;

  constructor(config: I18nConfig) {
    this._locale = config.locale;
    this._fallbackLocale = config.fallbackLocale;
    this.store = new MessageStore();
    this.messageCache = new MessageCache();
    this.loaders = [new JsonLoader(), ...(config.loaders ?? [])];
    this.parsers = new Map();

    if (config.messages) {
      for (const [locale, messages] of Object.entries(config.messages)) {
        this.store.set(locale, messages);
      }
    }
  }

  get locale(): string {
    return this._locale;
  }

  get fallbackLocale(): string | undefined {
    return this._fallbackLocale;
  }

  setLocale(locale: string): void {
    this._locale = locale;
    this.messageCache.clear();
  }

  getLocales(): string[] {
    return this.store.getLocales();
  }

  translate(key: string, values?: Record<string, unknown>): string {
    const cacheKey = `${this._locale}:${key}:${JSON.stringify(values ?? {})}`;

    if (this.messageCache.has(cacheKey)) {
      return this.messageCache.get(cacheKey)!;
    }

    let message = this.store.getMessage(this._locale, key);

    if (!message && this._fallbackLocale) {
      message = this.store.getMessage(this._fallbackLocale, key);
    }

    if (!message) {
      return key;
    }

    const parser = this.getParser(this._locale);
    const result = parser.parse(message, values);

    this.messageCache.set(cacheKey, result);
    return result;
  }

  formatNumber(value: number, options?: FormatNumberOptions): string {
    const locale = options?.locale ?? this._locale;
    return formatNumberFn(value, locale, options);
  }

  formatCurrency(
    value: number,
    currency: string,
    options?: FormatCurrencyOptions
  ): string {
    const locale = options?.locale ?? this._locale;
    return formatCurrencyFn(value, currency, locale, options);
  }

  formatDate(value: Date | number, options?: FormatDateOptions): string {
    const locale = options?.locale ?? this._locale;
    return formatDateFn(value, locale, options);
  }

  formatList(values: string[], options?: FormatListOptions): string {
    const locale = options?.locale ?? this._locale;
    return formatListFn(values, locale, options);
  }

  formatRelativeTime(
    value: number,
    unit: RelativeTimeUnit,
    options?: FormatRelativeTimeOptions
  ): string {
    const locale = options?.locale ?? this._locale;
    return formatRelativeTimeFn(value, unit, locale, options);
  }

  loadMessages(locale: string, messages: MessageDictionary): void {
    this.store.merge(locale, messages);
    this.messageCache.clear();
  }

  async loadMessagesAsync(url: string): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to load messages from ${url}: ${response.statusText}`
      );
    }

    const content = await response.text();
    const loader = this.findLoader(url);

    if (!loader) {
      throw new Error(`No loader found for ${url}`);
    }

    const messages = loader.parse(content);
    const locale = this.extractLocaleFromUrl(url);

    this.store.merge(locale, messages);
    this.messageCache.clear();
  }

  registerLoader(loader: MessageLoader): void {
    this.loaders.push(loader);
  }

  private getParser(locale: string): MF2Parser {
    let parser = this.parsers.get(locale);
    if (!parser) {
      parser = new MF2Parser(locale);
      this.parsers.set(locale, parser);
    }
    return parser;
  }

  private findLoader(url: string): MessageLoader | undefined {
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
    return match?.[1] ?? this._locale;
  }
}

export function createI18n(config: I18nConfig): I18n {
  return new I18nInstance(config);
}

export type {
  I18n,
  I18nConfig,
  MessageDictionary,
  MessageLoader,
  MessageParser,
  FormatNumberOptions,
  FormatCurrencyOptions,
  FormatDateOptions,
  FormatListOptions,
  FormatRelativeTimeOptions,
  RelativeTimeUnit,
} from './types.js';

export { MF2Parser } from './parsers/mf2-parser.js';
export { JsonLoader } from './loaders/json-loader.js';
export {
  formatNumber,
  formatCurrency,
  formatDate,
  formatList,
  formatRelativeTime,
} from './formatters/formatters.js';
