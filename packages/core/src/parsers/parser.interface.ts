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
