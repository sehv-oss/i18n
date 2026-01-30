export interface IParser {
  parse(message: string, values?: Record<string, unknown>): string;
}
