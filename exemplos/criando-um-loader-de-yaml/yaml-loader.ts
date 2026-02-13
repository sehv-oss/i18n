import type { ILoader } from '@sehv-oss/i18n';
import YAML from 'yaml';

export class YamlLoader implements ILoader {
  readonly extensions = ['.yaml', '.yml'];

  parse(content: string) {
    try {
      const parsed = YAML.parse(content) as unknown;

      if (!this.isValidMessages(parsed)) {
        throw new Error('Invalid YAML messages format!');
      }

      return parsed;
    } catch (error) {
      if (error instanceof Error && !(error.message.includes('Invalid YAML'))) {
        throw new Error(`Failed to parse YAML: ${error.message}.`);
      }

      throw error;
    }
  }

  private isValidMessages(value: unknown): value is Record<string, string> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }

    for (const val of Object.values(value)) {
      if (typeof val !== 'string' && !this.isValidMessages(val)) {
        return false;
      }
    }

    return true;
  }
}
