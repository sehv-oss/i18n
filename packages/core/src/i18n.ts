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
import type { TranslationKey } from './messages/keys.types.ts';
import { type Messages, MessagesManager } from './messages/messages.ts';
import type { TranslateArgs } from './messages/values.types.ts';
import { type BidiIsolation, MF2Parser } from './parsers/mf2-parser.ts';

export type I18nErrorHandler = (error: unknown, key: string) => void;

export type I18nConfig = {
  locale: string;
  fallbackLocale?: string;
  messages?: Record<string, Messages>;
  loaders?: ILoader[];
  onError?: I18nErrorHandler;
  bidiIsolation?: BidiIsolation;
};

export class I18nInstance {
  private locale: string;
  private fallbackLocale: string | undefined;
  private messagesManager: MessagesManager;
  private loaders: ILoader[];
  private onError: I18nErrorHandler | undefined;
  private bidiIsolation: BidiIsolation;
  private mf2ParserByLocale: Map<string, MF2Parser>;
  private localeChangeListeners = new Set<(locale: string) => void>();

  constructor(config: I18nConfig) {
    const {
      locale,
      fallbackLocale,
      loaders,
      messages,
      onError,
      bidiIsolation,
    } = config;

    this.locale = locale;
    this.fallbackLocale = fallbackLocale;
    this.messagesManager = new MessagesManager();
    this.mf2ParserByLocale = new Map();
    this.loaders = [new JsonLoader(), ...(loaders ?? [])];
    this.onError = onError;
    this.bidiIsolation = bidiIsolation ?? 'none';

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
    this.localeChangeListeners.forEach((listener) => listener(locale));
  }

  public onLocaleChange(listener: (locale: string) => void): () => void {
    this.localeChangeListeners.add(listener);

    return () => {
      this.localeChangeListeners.delete(listener);
    };
  }

  public getFallbackLocale(): string | undefined {
    return this.fallbackLocale;
  }

  public getLocales(): string[] {
    return this.messagesManager.getLocales();
  }

  public translate<TKey extends TranslationKey>(
    key: TKey,
    ...values: TranslateArgs<TKey>
  ): string {
    let message = this.messagesManager.getMessage(this.locale, key);
    if (!message && this.fallbackLocale) {
      message = this.messagesManager.getMessage(this.fallbackLocale, key);
    }

    if (!message) {
      return key;
    }

    const [params] = values as [Record<string, unknown>?];
    const parser = this.getParser(this.locale);

    return parser.parse(message, params, (error) => this.onError?.(error, key));
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
      parser = new MF2Parser(locale, { bidiIsolation: this.bidiIsolation });
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
    const name = filename.replace(/\.[^.]+$/, '');

    try {
      const [canonical] = Intl.getCanonicalLocales(name);
      return canonical ?? this.locale;
    } catch {
      return this.locale;
    }
  }
}

export function createI18n(config: I18nConfig): I18nInstance {
  return new I18nInstance(config);
}

export * from './formatters/formatters.ts';
export type * from './loaders/loader.interface.ts';
export type * from './parsers/parser.interface.ts';
export type { Messages } from './messages/messages.ts';
export type { Register } from './messages/register.types.ts';
export type { MessageKey, TranslationKey } from './messages/keys.types.ts';
export type {
  MessageParams,
  TranslateArgs,
  TranslationValues,
} from './messages/values.types.ts';
export type { BidiIsolation } from './parsers/mf2-parser.ts';
