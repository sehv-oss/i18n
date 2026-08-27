import { MessageFormat } from 'messageformat';
import { DraftFunctions, type MessageFunction } from 'messageformat/functions';

import { BoundedCache } from '../caches/bounded.ts';
import type { IParser, ParseErrorHandler } from './parser.interface.ts';

/**
 * How placeholders with unknown directionality are isolated from the rest of the message.
 *
 * - `'none'` — no isolation, the output carries only visible characters.
 * - `'default'` — the spec behavior, wrapping placeholders in the U+2068 and U+2069 control characters so mixed-direction text renders correctly.
 */
export type BidiIsolation = 'default' | 'none';

/**
 * Custom MF2 function handlers, keyed by the name a message calls them with — `{$x :shout}` looks up `shout`.
 *
 * They extend the draft functions unless {@link MF2ParserOptions.draftFunctions} turns those off.
 */
export type I18nFunctions = Record<string, MessageFunction<string, string>>;

/**
 * A `MessageFormat` widened over the custom function types contributed by {@link DraftFunctions}, so compiled messages fit a single cache.
 */
type CompiledMessage = MessageFormat<string, string>;

export type MF2ParserOptions = {
  /**
   * How placeholders with unknown directionality are isolated from the rest of the message.
   * Defaults to `'none'`, which keeps the formatted output free of the U+2068/U+2069 control characters the spec default inserts.
   */
  bidiIsolation?: BidiIsolation;

  /**
   * Custom function handlers to make available to messages, keyed by name.
   */
  functions?: I18nFunctions;

  /**
   * Whether the `messageformat` draft functions — `:date`, `:time`, `:datetime`, `:currency`, `:unit`,
   * `:percent`, `:offset` — are available. Defaults to `true`.
   *
   * Turn it off to keep them out of the bundle when your messages only use plain placeholders.
   */
  draftFunctions?: boolean;
};

/**
 * MessageFormat 2 parser, backed by the reference implementation of the LDML 48 specification.
 * Compiled messages are cached by their source text, so repeated formatting only pays for the parse once.
 */
export class MF2Parser implements IParser {
  private locale: string;
  private bidiIsolation: BidiIsolation;
  private functions: I18nFunctions;
  private compiled = new BoundedCache<CompiledMessage>();

  constructor(locale: string, options?: MF2ParserOptions) {
    this.locale = locale;
    this.bidiIsolation = options?.bidiIsolation ?? 'none';
    this.functions = {
      ...(options?.draftFunctions === false
        ? {}
        : (DraftFunctions as I18nFunctions)),
      ...options?.functions,
    };
  }

  /**
   * Formats `message` against `values`.
   *
   * A message that fails to compile is returned as its own source text, and a value that fails to format falls back to its own representation, so the call always produces something to render.
   * Both paths report through `onError` first.
   */
  public parse(
    message: string,
    values: Record<string, unknown> = {},
    onError?: ParseErrorHandler
  ): string {
    const messageFormat = this.compile(message, onError);
    if (!messageFormat) return message;

    return messageFormat.format(values, onError ?? silent);
  }

  private compile(
    message: string,
    onError?: ParseErrorHandler
  ): CompiledMessage | undefined {
    const cached = this.compiled.get(message);
    if (cached) return cached;

    try {
      const messageFormat = new MessageFormat(this.locale, message, {
        bidiIsolation: this.bidiIsolation,
        functions: this.functions,
      });

      this.compiled.set(message, messageFormat);

      return messageFormat;
    } catch (error) {
      onError?.(error);

      return undefined;
    }
  }
}

function silent(): void {}
