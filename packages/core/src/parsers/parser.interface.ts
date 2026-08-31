import type { I18nPart } from './parts.types.ts';

/**
 * Called when a message fails to compile or format, with the underlying error.
 *
 * The parser reports and keeps going, so formatting always yields a string.
 */
export type ParseErrorHandler = (error: unknown) => void;

/**
 * Formats one message source against a set of values.
 *
 * The library ships a MessageFormat 2 implementation of this and uses it for every translation; the interface is exported so the contract is visible and mockable.
 */
export interface IParser {
  /**
   * @param message - The message source text.
   * @param values - Placeholder values the message reads.
   * @param onError - Notified on failure. When the message cannot be compiled, its source text is returned unchanged rather than thrown.
   */
  parse(
    message: string,
    values?: Record<string, unknown>,
    onError?: ParseErrorHandler
  ): string;

  /**
   * Formats one message into text and markup parts.
   *
   * Optional: a parser that does not implement it can still back `translate`, and `translateToParts`
   * then degrades to a single text part carrying the fully formatted string.
   *
   * @param message - The message source text.
   * @param values - Placeholder values the message reads.
   * @param onError - Notified on failure, the same way {@link IParser.parse} notifies.
   */
  parseToParts?(
    message: string,
    values?: Record<string, unknown>,
    onError?: ParseErrorHandler
  ): I18nPart[];
}

/**
 * Builds a parser for one locale.
 *
 * Passed as {@link I18nConfig.parser} to replace the built-in MessageFormat 2 parser — for a different
 * message syntax, or for a stub in tests. Called once per locale and the result is reused.
 *
 * @param locale - The locale the parser will format for.
 */
export type IParserFactory = (locale: string) => IParser;
