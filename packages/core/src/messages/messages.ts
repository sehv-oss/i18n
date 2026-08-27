import { mergeMessages } from './merge.ts';

/**
 * A locale's messages: MessageFormat 2 source strings, flat or nested to any depth.
 *
 * Nested groups are read back by dot path, so `{ home: { title: 'Home' } }` is reached as `'home.title'`.
 * A flat key that literally contains dots still wins over the nested path, which keeps existing dictionaries working unchanged.
 *
 * @example
 * ```ts
 * const messages: Messages = {
 *   greeting: 'Hello, {$name}!',
 *   home: {
 *     title: 'Home',
 *     nav: { back: 'Back' },
 *   },
 * };
 * ```
 */
export type Messages = { [key: string]: string | Messages };

/**
 * Stores messages per locale and resolves keys against them.
 *
 * @internal
 */
export class MessagesManager {
  private messages = new Map<string, Messages>();

  public get(locale: string): Messages | undefined {
    return this.messages.get(locale);
  }

  public set(locale: string, messages: Messages): void {
    this.messages.set(locale, messages);
  }

  public merge(locale: string, messages: Messages): void {
    const existing = this.messages.get(locale);

    this.messages.set(
      locale,
      existing ? mergeMessages(existing, messages) : messages
    );
  }

  public delete(locale: string): boolean {
    return this.messages.delete(locale);
  }

  public has(locale: string): boolean {
    return this.messages.has(locale);
  }

  public getLocales(): string[] {
    return Array.from(this.messages.keys());
  }

  /**
   * Resolves `key` for `locale`, preferring a flat key over the nested path.
   */
  public getMessage(locale: string, key: string): string | undefined {
    const dictionary = this.get(locale);
    if (!dictionary) return;

    const flat = dictionary[key];
    if (typeof flat === 'string') return flat;

    return this.walk(dictionary, key);
  }

  private walk(dictionary: Messages, key: string): string | undefined {
    let current: string | Messages | undefined = dictionary;

    for (const segment of key.split('.')) {
      if (typeof current !== 'object') return;

      current = current[segment];
    }

    return typeof current === 'string' ? current : undefined;
  }
}
