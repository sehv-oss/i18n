import type { Messages } from '../messages/messages.ts';
import type { ILoader } from './loader.interface.ts';

export class JsonLoader implements ILoader {
  readonly extensions = ['.json'];

  parse(content: string): Messages {
    try {
      const parsed = JSON.parse(content) as unknown;

      if (!this.isValidMessages(parsed)) {
        throw new Error('Invalid messages format!');
      }

      return parsed;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse JSON: ${error.message}.`);
      }

      throw error;
    }
  }

  private isValidMessages(value: unknown): value is Messages {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }

    return Object.values(value).every((val) => typeof val === 'string');
  }
}
