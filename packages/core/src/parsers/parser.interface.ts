export type ParseErrorHandler = (error: unknown) => void;

export interface IParser {
  parse(
    message: string,
    values?: Record<string, unknown>,
    onError?: ParseErrorHandler
  ): string;
}
