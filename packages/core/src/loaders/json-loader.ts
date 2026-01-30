import type { MessageDictionary } from '../types.ts';
import type { ILoader } from './loader.interface.ts';

export class JsonLoader implements ILoader {
  readonly extensions = ['.json'];

  parse(content: string): MessageDictionary {
    try {
      const parsed = JSON.parse(content) as unknown;

      if (!this.isValidDictionary(parsed)) {
        throw new Error('Invalid message dictionary format!');
      }

      return parsed;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse JSON: ${error.message}`);
      }
      throw error;
    }
  }

  private isValidDictionary(value: unknown): value is MessageDictionary {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }

    for (const val of Object.values(value)) {
      if (typeof val !== 'string' && !this.isValidDictionary(val)) {
        return false;
      }
    }

    return true;
  }
}
