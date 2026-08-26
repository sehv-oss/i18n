import { MessageFormat } from 'messageformat';
import { DraftFunctions } from 'messageformat/functions';

import { BoundedCache } from '../caches/bounded.ts';
import type { IParser, ParseErrorHandler } from './parser.interface.ts';

export type BidiIsolation = 'default' | 'none';

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
};

/**
 * MessageFormat 2 parser, backed by the reference implementation of the LDML 48 specification.
 * Compiled messages are cached by their source text, so repeated formatting only pays for the parse once.
 */
export class MF2Parser implements IParser {
  private locale: string;
  private bidiIsolation: BidiIsolation;
  private compiled = new BoundedCache<CompiledMessage>();

  constructor(locale: string, options?: MF2ParserOptions) {
    this.locale = locale;
    this.bidiIsolation = options?.bidiIsolation ?? 'none';
  }

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
        functions: DraftFunctions,
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
