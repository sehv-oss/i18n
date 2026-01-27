export interface MessageParser {
  parse(message: string, values?: Record<string, unknown>): string;
}
