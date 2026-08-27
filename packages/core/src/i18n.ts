/**
 * Modern i18n for JavaScript, built on the `Intl` API and MessageFormat 2.
 *
 * {@link createI18n} is the entry point. It returns an {@link I18nInstance} that stores messages, translates them and formats numbers, dates, lists and relative times.
 * {@link Register} is the one-time augmentation that makes keys and message placeholders statically checked.
 *
 * @packageDocumentation
 */

import {
  FormatCurrency,
  type FormatCurrencyOptions,
} from './formatters/currency.ts';
import { FormatDate, type FormatDateOptions } from './formatters/date.ts';
import {
  FormatDisplayName,
  type FormatDisplayNameOptions,
} from './formatters/display-name.ts';
import {
  FormatDuration,
  type FormatDurationInput,
  type FormatDurationOptions,
} from './formatters/duration.ts';
import { FormatList, type FormatListOptions } from './formatters/list.ts';
import { FormatNumber, type FormatNumberOptions } from './formatters/number.ts';
import {
  FormatRelativeTime,
  type FormatRelativeTimeOptions,
  type FormatRelativeTimeUnit,
} from './formatters/relative-time.ts';
import { JsonLoader } from './loaders/json-loader.ts';
import { expandLocale } from './locales/resolve.ts';
import type { ILoader } from './loaders/loader.interface.ts';
import type { IParser, IParserFactory } from './parsers/parser.interface.ts';
import type { I18nPart } from './parsers/parts.types.ts';
import type { TranslationKey } from './messages/keys.types.ts';
import { type Messages, MessagesManager } from './messages/messages.ts';
import type { TranslateArgs } from './messages/values.types.ts';
import {
  type BidiIsolation,
  type I18nFunctions,
  MF2Parser,
} from './parsers/mf2-parser.ts';

/**
 * Called when a message fails to compile or format.
 *
 * Failures are reported, never thrown:
 * {@link I18nInstance.translate} always returns a string, so a broken message degrades to readable output instead of taking the surrounding render down with it.
 *
 * @param error - The failure raised while compiling or formatting.
 * @param key - The translation key being resolved when it happened.
 */
export type I18nErrorHandler = (error: unknown, key: string) => void;

/**
 * Called when a key resolves in no locale of the chain.
 *
 * Return a string to use it as the output, which is how an empty-string or `[missing]` strategy is built.
 * Return nothing and the key itself is rendered, as before.
 *
 * @param key - The key that did not resolve.
 * @param locale - The locale that was current when the lookup ran.
 */
export type I18nMissingKeyHandler = (
  key: string,
  locale: string
) => string | void;

/**
 * Configuration accepted by {@link createI18n}.
 */
export type I18nConfig = {
  /**
   * Locale used for message lookup and for every formatter, as a BCP 47 tag such as `'en'` or `'pt-BR'`.
   */
  locale: string;

  /**
   * Locale, or locales in descending preference, to read from when a key is missing in {@link I18nConfig.locale}.
   *
   * Every tag is expanded to its parents, so `'pt-BR'` also reads from `'pt'` — and the current locale is
   * expanded the same way, before any fallback is consulted.
   * Only the message text comes from the fallback; it is still formatted with the current locale, so numbers and plurals follow what the reader sees.
   */
  fallbackLocale?: string | string[];

  /**
   * Messages per locale, flat or nested. Equivalent to calling {@link I18nInstance.loadMessages} once per entry.
   */
  messages?: Record<string, Messages>;

  /**
   * Extra loaders for {@link I18nInstance.loadMessagesAsync}, matched by file extension.
   *
   * The built-in JSON loader is always installed ahead of these, so `.json` stays handled and cannot be taken over by a custom loader.
   */
  loaders?: ILoader[];

  /**
   * Called on compile or format failures. Silent when omitted.
   */
  onError?: I18nErrorHandler;

  /**
   * Called when a key resolves in no locale of the chain. Silent when omitted, and the key is rendered.
   *
   * @example
   * ```ts
   * createI18n({
   *   locale: 'en',
   *   onMissingKey: (key, locale) => {
   *     reportToSentry(`missing ${key} in ${locale}`);
   *   },
   * });
   * ```
   */
  onMissingKey?: I18nMissingKeyHandler;

  /**
   * How placeholders with unknown directionality are isolated from the rest of the message.
   *
   * Defaults to `'auto'`: no isolation for left-to-right locales, and the spec's U+2068/U+2069 isolates
   * for right-to-left ones. Pass `'none'` or `'default'` to force one everywhere.
   */
  bidiIsolation?: BidiIsolation;

  /**
   * Custom MF2 function handlers, keyed by the name a message calls them with.
   *
   * @example
   * ```ts
   * createI18n({ locale: 'en', functions: { shout: shoutHandler } });
   * // messages can now use {$word :shout}
   * ```
   */
  functions?: I18nFunctions;

  /**
   * Whether the `messageformat` draft functions are available to messages. Defaults to `true`.
   */
  draftFunctions?: boolean;

  /**
   * Replaces the built-in MessageFormat 2 parser. Called once per locale.
   *
   * Ignored by nothing else — {@link I18nConfig.functions} and {@link I18nConfig.bidiIsolation} only
   * reach the built-in parser, so a custom parser owns its own configuration.
   */
  parser?: IParserFactory;
};

/**
 * A configured i18n instance: message storage, translation and the `Intl` formatters, all bound to one current locale.
 *
 * Prefer {@link createI18n} over calling the constructor directly.
 *
 * @example
 * ```ts
 * const i18n = createI18n({
 *   locale: 'en',
 *   messages: { en: { greeting: 'Hello, {$name}!' } },
 * });
 *
 * i18n.translate('greeting', { name: 'World' }); // "Hello, World!"
 * ```
 */
export class I18nInstance {
  private locale: string;
  private fallbackLocales: string[];
  private messagesManager: MessagesManager;
  private loaders: ILoader[];
  private onError: I18nErrorHandler | undefined;
  private onMissingKey: I18nMissingKeyHandler | undefined;
  private bidiIsolation: BidiIsolation;
  private parserFactory: IParserFactory;
  private parserByLocale: Map<string, IParser>;
  private localeChangeListeners = new Set<(locale: string) => void>();

  constructor(config: I18nConfig) {
    const {
      locale,
      fallbackLocale,
      loaders,
      messages,
      onError,
      onMissingKey,
      bidiIsolation,
      functions,
      draftFunctions,
      parser,
    } = config;

    this.locale = locale;
    this.fallbackLocales =
      fallbackLocale === undefined
        ? []
        : Array.isArray(fallbackLocale)
          ? fallbackLocale
          : [fallbackLocale];
    this.messagesManager = new MessagesManager();
    this.parserByLocale = new Map();
    this.loaders = [new JsonLoader(), ...(loaders ?? [])];
    this.onError = onError;
    this.onMissingKey = onMissingKey;
    this.bidiIsolation = bidiIsolation ?? 'auto';
    this.parserFactory =
      parser ??
      ((parserLocale) =>
        new MF2Parser(parserLocale, {
          bidiIsolation: this.bidiIsolation,
          ...(functions ? { functions } : {}),
          ...(draftFunctions === undefined ? {} : { draftFunctions }),
        }));

    if (messages) {
      Object.entries(messages).forEach(([locale, messagesLocale]) => {
        this.messagesManager.set(locale, messagesLocale);
      });
    }
  }

  /**
   * The locale currently used for lookup and formatting.
   */
  public getLocale(): string {
    return this.locale;
  }

  /**
   * Switches the current locale and notifies every {@link I18nInstance.onLocaleChange} listener.
   *
   * Messages already loaded for the new locale are used as they are; nothing is fetched, so load them first when they are not bundled.
   */
  public setLocale(locale: string): void {
    this.locale = locale;
    this.localeChangeListeners.forEach((listener) => listener(locale));
  }

  /**
   * Subscribes to locale changes. This is what React bindings use to re-render on {@link I18nInstance.setLocale}.
   *
   * @returns An unsubscribe function. Call it to drop the listener.
   */
  public onLocaleChange(listener: (locale: string) => void): () => void {
    this.localeChangeListeners.add(listener);

    return () => {
      this.localeChangeListeners.delete(listener);
    };
  }

  /**
   * The first configured fallback locale, or `undefined` when none was configured.
   */
  public getFallbackLocale(): string | undefined {
    return this.fallbackLocales[0];
  }

  /**
   * Every configured fallback locale, in the order they are consulted.
   */
  public getFallbackLocales(): string[] {
    return [...this.fallbackLocales];
  }

  /**
   * The locales consulted for a key, in order: the current locale and its parents, then each
   * fallback locale and its parents. Deduplicated, so a tag appears once.
   *
   * @example
   * ```ts
   * createI18n({ locale: 'pt-BR', fallbackLocale: 'en-US' }).getLocaleChain();
   * // ['pt-BR', 'pt', 'en-US', 'en']
   * ```
   */
  public getLocaleChain(): string[] {
    const chain = [
      ...expandLocale(this.locale),
      ...this.fallbackLocales.flatMap((locale) => expandLocale(locale)),
    ];

    return Array.from(new Set(chain));
  }

  /**
   * Every locale that has messages loaded, in insertion order.
   *
   * The current locale is only listed once messages exist for it.
   */
  public getLocales(): string[] {
    return this.messagesManager.getLocales();
  }

  /**
   * Formats the message at `key` for the current locale.
   *
   * Lookup walks dot-separated segments, except that a flat key containing literal dots wins over the nested path.
   * Existing dictionaries keep working unchanged. The key is looked up across {@link I18nInstance.getLocaleChain}, and when it resolves
   * in none of those locales the key itself is returned, so a missing translation shows up without being fatal.
   *
   * `values` is required exactly when the message declares placeholders, and optional otherwise.
   * That check only exists once {@link Register} has been augmented; without it, keys stay `string` and `values` stays optional.
   *
   * @param key - Dot path of the message.
   * @param values - Placeholder values the message reads, such as `$name` for `{$name}`.
   * @returns The formatted message, or `key` when no message was found.
   *
   * @example
   * ```ts
   * i18n.translate('home.title'); // "Home"
   * i18n.translate('greeting', { name: 'World' }); // "Hello, World!"
   * i18n.translate('unknown.key'); // "unknown.key"
   * ```
   */
  public translate<TKey extends TranslationKey>(
    key: TKey,
    ...values: TranslateArgs<TKey>
  ): string {
    const resolved = this.resolveMessage(key);

    if (!resolved) {
      return this.onMissingKey?.(key, this.locale) ?? key;
    }

    const [params] = values as [Record<string, unknown>?];
    const parser = this.getParser(this.locale);

    return parser.parse(resolved.message, params, (error) =>
      this.onError?.(error, key)
    );
  }

  /**
   * Formats the message at `key` into text and markup parts, instead of one flat string.
   *
   * This is what makes a message like `Accept the {#link}terms{/link}` renderable without splitting it
   * into three separate keys. `@sehv-oss/i18n-react` builds on it in `useRichTranslate` and in the
   * `tags` prop of `<Translate>`; outside React, pair `'open'` and `'close'` parts by `name` yourself.
   *
   * Falls back to a single text part when the configured parser does not implement `parseToParts`.
   *
   * @param key - Dot path of the message.
   * @param values - Placeholder values the message reads.
   * @returns The message as a flat stream of text and markup parts.
   *
   * @example
   * ```ts
   * i18n.translateToParts('terms');
   * // [{ type: 'text', value: 'Accept the ' },
   * //  { type: 'markup', kind: 'open', name: 'link' },
   * //  { type: 'text', value: 'terms' },
   * //  { type: 'markup', kind: 'close', name: 'link' }]
   * ```
   */
  public translateToParts<TKey extends TranslationKey>(
    key: TKey,
    ...values: TranslateArgs<TKey>
  ): I18nPart[] {
    const resolved = this.resolveMessage(key);

    if (!resolved) {
      return [
        { type: 'text', value: this.onMissingKey?.(key, this.locale) ?? key },
      ];
    }

    const [params] = values as [Record<string, unknown>?];
    const parser = this.getParser(this.locale);
    const onError = (error: unknown) => this.onError?.(error, key);

    if (!parser.parseToParts) {
      return [
        {
          type: 'text',
          value: parser.parse(resolved.message, params, onError),
        },
      ];
    }

    return parser.parseToParts(resolved.message, params, onError);
  }

  /**
   * Whether `key` resolves in any locale of {@link I18nInstance.getLocaleChain}.
   *
   * Use it to branch on a translation existing without rendering it — and without tripping
   * {@link I18nConfig.onMissingKey}, which this never calls.
   *
   * @param key - Dot path of the message.
   * @returns `true` when a message is found in the chain.
   *
   * @example
   * ```ts
   * const label = i18n.hasMessage('cart.empty')
   *   ? i18n.translate('cart.empty')
   *   : '';
   * ```
   */
  public hasMessage(key: TranslationKey): boolean {
    return this.resolveMessage(key) !== undefined;
  }

  /**
   * Formats a number with `Intl.NumberFormat`.
   *
   * @param options - `Intl.NumberFormatOptions`, plus a `locale` that overrides the current one for this call.
   *
   * @example
   * ```ts
   * i18n.formatNumber(1234.56); // "1,234.56"
   * i18n.formatNumber(0.42, { style: 'percent' }); // "42%"
   * ```
   */
  public formatNumber(value: number, options?: FormatNumberOptions): string {
    const locale = options?.locale ?? this.locale;

    return FormatNumber.format(value, locale, options);
  }

  /**
   * Formats a currency amount with `Intl.NumberFormat`.
   *
   * @param currency - ISO 4217 code, such as `'USD'` or `'BRL'`.
   * @param options - `Intl.NumberFormatOptions` without `style`, which is fixed to `'currency'`, plus a `locale` that overrides the current one.
   *
   * @example
   * ```ts
   * i18n.formatCurrency(99.9, 'USD'); // "$99.90"
   * ```
   */
  public formatCurrency(
    value: number,
    currency: string,
    options?: FormatCurrencyOptions
  ): string {
    const locale = options?.locale ?? this.locale;

    return FormatCurrency.format(value, currency, locale, options);
  }

  /**
   * Formats a date with `Intl.DateTimeFormat`.
   *
   * @param value - A `Date`, or a timestamp in milliseconds.
   * @param options - `Intl.DateTimeFormatOptions`, plus a `locale` that overrides the current one for this call.
   *
   * @example
   * ```ts
   * i18n.formatDate(new Date(), { dateStyle: 'long' }); // "January 27, 2026"
   * ```
   */
  public formatDate(value: Date | number, options?: FormatDateOptions): string {
    const locale = options?.locale ?? this.locale;

    return FormatDate.format(value, locale, options);
  }

  /**
   * Joins values into a locale-aware list with `Intl.ListFormat`.
   *
   * @param options - `Intl.ListFormatOptions`, plus a `locale` that overrides the current one for this call.
   *
   * @example
   * ```ts
   * i18n.formatList(['apple', 'banana', 'orange']);
   * // "apple, banana, and orange"
   * ```
   */
  public formatList(values: string[], options?: FormatListOptions): string {
    const locale = options?.locale ?? this.locale;

    return FormatList.format(values, locale, options);
  }

  /**
   * Formats a relative time with `Intl.RelativeTimeFormat`.
   *
   * @param value - Offset from now. Negative points to the past.
   * @param unit - Singular or plural, both accepted: `'day'` and `'days'` mean the same thing.
   * @param options - `Intl.RelativeTimeFormatOptions`, plus a `locale` that overrides the current one for this call.
   *
   * @example
   * ```ts
   * i18n.formatRelativeTime(-2, 'days'); // "2 days ago"
   * i18n.formatRelativeTime(1, 'hour'); // "in 1 hour"
   * ```
   */
  public formatRelativeTime(
    value: number,
    unit: FormatRelativeTimeUnit,
    options?: FormatRelativeTimeOptions
  ): string {
    const locale = options?.locale ?? this.locale;

    return FormatRelativeTime.format(value, unit, locale, options);
  }

  /**
   * Names a language, region, script or currency in the current locale, with `Intl.DisplayNames`.
   *
   * This is what a language switcher renders — the name of each locale, written the way the current
   * reader would write it.
   *
   * @param value - The code to name, matching `options.type`.
   * @param options - `Intl.DisplayNamesOptions` — `type` is required — plus a `locale` that overrides the current one.
   *
   * @example
   * ```ts
   * i18n.formatDisplayName('en-US', { type: 'language' }); // "English (United States)"
   * ```
   */
  public formatDisplayName(
    value: string,
    options: FormatDisplayNameOptions
  ): string {
    const locale = options.locale ?? this.locale;

    return FormatDisplayName.format(value, locale, options);
  }

  /**
   * Formats a duration with `Intl.DurationFormat`.
   *
   * @param value - The duration, as units to values.
   * @param options - `Intl.DurationFormatOptions`, plus a `locale` that overrides the current one for this call.
   *
   * @example
   * ```ts
   * i18n.formatDuration({ hours: 1, minutes: 30 }); // "1 hr, 30 min"
   * ```
   */
  public formatDuration(
    value: FormatDurationInput,
    options?: FormatDurationOptions
  ): string {
    const locale = options?.locale ?? this.locale;

    return FormatDuration.format(value, locale, options);
  }

  /**
   * Registers messages for a locale, deep-merging them into whatever is already stored.
   *
   * Merging is what makes namespaced dictionaries work: load `common` and `checkout` separately
   * and both stay reachable. Use {@link I18nInstance.setMessages} when you want the old replace behavior.
   *
   * @param locale - The locale the messages belong to.
   * @param messages - Flat or nested, read back by dot path.
   *
   * @example
   * ```ts
   * i18n.loadMessages('pt-BR', { common: { ok: 'OK' } });
   * i18n.loadMessages('pt-BR', { checkout: { pay: 'Pagar' } });
   * i18n.translate('common.ok'); // still "OK"
   * ```
   */
  public loadMessages(locale: string, messages: Messages): void {
    this.messagesManager.merge(locale, messages);
  }

  /**
   * Replaces every message stored for a locale.
   *
   * @param locale - The locale to overwrite.
   * @param messages - Flat or nested, read back by dot path.
   */
  public setMessages(locale: string, messages: Messages): void {
    this.messagesManager.set(locale, messages);
  }

  /**
   * Drops every message stored for a locale, and the locale itself from {@link I18nInstance.getLocales}.
   *
   * Long-lived servers use this to release dictionaries they no longer serve.
   *
   * @param locale - The locale to drop.
   */
  public removeMessages(locale: string): void {
    this.messagesManager.delete(locale);
  }

  /**
   * Fetches a message file and merges it into `locale`, picking the loader by file extension.
   *
   * The locale is explicit rather than inferred from the file name, which is what lets one locale be
   * split across namespaced files — `/locales/en/common.json` and `/locales/en/checkout.json` both
   * load into `'en'` and both stay reachable.
   *
   * @param locale - The locale to merge the file into.
   * @param url - Anything `fetch` accepts, with an extension a loader claims.
   * @throws If the response is not ok, or if no loader handles the extension. The loader itself may also throw on malformed content.
   *
   * @example
   * ```ts
   * await i18n.loadMessagesAsync('en', '/locales/en/common.json');
   * await i18n.loadMessagesAsync('en', '/locales/en/checkout.json');
   * ```
   */
  public async loadMessagesAsync(locale: string, url: string): Promise<void> {
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

    this.loadMessages(locale, loader.parse(content));
  }

  private resolveMessage(
    key: string
  ): { message: string; locale: string } | undefined {
    for (const locale of this.getLocaleChain()) {
      const message = this.messagesManager.getMessage(locale, key);

      if (message !== undefined) return { message, locale };
    }

    return undefined;
  }

  private getParser(locale: string): IParser {
    let parser = this.parserByLocale.get(locale);

    if (!parser) {
      parser = this.parserFactory(locale);
      this.parserByLocale.set(locale, parser);
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
}

/**
 * Creates an {@link I18nInstance}.
 *
 * The instance is plain state — create one per application and share it, or one per request on the server, whichever suits the runtime.
 *
 * @example
 * ```ts
 * import { createI18n } from '@sehv-oss/i18n';
 *
 * const i18n = createI18n({
 *   locale: 'en',
 *   fallbackLocale: 'en',
 *   messages: {
 *     en: {
 *       greeting: 'Hello, {$name}!',
 *       home: { title: 'Home' },
 *     },
 *   },
 * });
 *
 * i18n.translate('greeting', { name: 'World' }); // "Hello, World!"
 * i18n.translate('home.title'); // "Home"
 * ```
 */
export function createI18n(config: I18nConfig): I18nInstance {
  return new I18nInstance(config);
}

export * from './formatters/formatters.ts';
export { getTextDirection } from './locales/direction.ts';
export { expandLocale, resolveLocale } from './locales/resolve.ts';
export { extractPlaceholders, validateMessages } from './messages/validate.ts';
export type {
  MessagesValidationIssue,
  MessagesValidationResult,
} from './messages/validate.ts';
export type * from './loaders/loader.interface.ts';
export type * from './parsers/parser.interface.ts';
export type * from './parsers/parts.types.ts';
export type { Messages } from './messages/messages.ts';
export type { Register } from './messages/register.types.ts';
export type { MessageKey, TranslationKey } from './messages/keys.types.ts';
export type {
  MessageParams,
  TranslateArgs,
  TranslationValues,
} from './messages/values.types.ts';
export type { BidiIsolation, I18nFunctions } from './parsers/mf2-parser.ts';
