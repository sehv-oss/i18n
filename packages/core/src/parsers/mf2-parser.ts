import {
  MessageFormat,
  type MessageMarkupPart,
  type MessagePart,
} from 'messageformat';
import { DraftFunctions, type MessageFunction } from 'messageformat/functions';

import { BoundedCache } from '../caches/bounded.ts';
import { getTextDirection } from '../locales/direction.ts';
import type { IParser, ParseErrorHandler } from './parser.interface.ts';
import type { I18nPart } from './parts.types.ts';

/**
 * How placeholders with unknown directionality are isolated from the rest of the message.
 *
 * - `'auto'` — the default: `'none'` for left-to-right locales, `'default'` for right-to-left ones.
 *   Left-to-right output stays free of control characters, and mixed-direction text still renders correctly.
 * - `'none'` — no isolation, the output carries only visible characters.
 * - `'default'` — the spec behavior, wrapping placeholders in the U+2068 and U+2069 control characters so mixed-direction text renders correctly.
 */
export type BidiIsolation = 'auto' | 'default' | 'none';

/**
 * Custom MF2 function handlers, keyed by the name a message calls them with — `{$x :shout}` looks up `shout`.
 *
 * They extend the draft functions unless {@link MF2ParserOptions.draftFunctions} turns those off.
 */
export type I18nFunctions = Record<string, MessageFunction<string, string>>;

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
   * Defaults to `'auto'`, which isolates only in right-to-left locales.
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
  private bidiIsolation: 'default' | 'none';
  private functions: I18nFunctions;
  private compiled = new BoundedCache<CompiledMessage>();

  constructor(locale: string, options?: MF2ParserOptions) {
    this.locale = locale;
    this.bidiIsolation = resolveBidiIsolation(
      options?.bidiIsolation ?? 'auto',
      locale
    );
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

  /**
   * Formats `message` into text and markup parts.
   *
   * Adjacent text is merged, so the result alternates between runs of text and markup boundaries.
   * A message that fails to compile comes back as a single text part holding its own source, matching
   * what {@link MF2Parser.parse} returns in the same situation.
   *
   * @param message - The message source text.
   * @param values - Placeholder values the message reads.
   * @param onError - Notified on compile or format failure.
   * @returns The message as a flat stream of text and markup parts.
   */
  public parseToParts(
    message: string,
    values: Record<string, unknown> = {},
    onError?: ParseErrorHandler
  ): I18nPart[] {
    const messageFormat = this.compile(message, onError);
    if (!messageFormat) return [{ type: 'text', value: message }];

    return collapseParts(
      messageFormat.formatToParts(values, onError ?? silent)
    );
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

function resolveBidiIsolation(
  isolation: BidiIsolation,
  locale: string
): 'default' | 'none' {
  if (isolation !== 'auto') return isolation;

  return getTextDirection(locale) === 'rtl' ? 'default' : 'none';
}

function collapseParts(parts: MessagePart<string>[]): I18nPart[] {
  const result: I18nPart[] = [];

  for (const part of parts) {
    if (isMarkupPart(part)) {
      result.push({
        type: 'markup',
        kind: part.kind,
        name: part.name,
        ...(part.options ? { options: part.options } : {}),
      });
      continue;
    }

    const value = stringifyPart(part);
    if (!value) continue;

    const last = result[result.length - 1];

    if (last?.type === 'text') {
      last.value += value;
      continue;
    }

    result.push({ type: 'text', value });
  }

  return result;
}

/**
 * `MessagePart<string>` cannot discriminate on `type` alone — its expression branch is typed with an
 * open `string`, which overlaps `'markup'` — so the markup fields are checked too.
 */
function isMarkupPart(part: MessagePart<string>): part is MessageMarkupPart {
  return part.type === 'markup' && 'kind' in part && 'name' in part;
}

function stringifyPart(part: MessagePart<string>): string {
  if ('parts' in part && Array.isArray(part.parts)) {
    return part.parts.map((inner) => String(inner.value ?? '')).join('');
  }

  return 'value' in part && part.value !== undefined ? String(part.value) : '';
}

function silent(): void {}
