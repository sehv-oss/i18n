import type { MessageDictionary } from './types.ts';

export class MessageStore {
  private messages = new Map<string, MessageDictionary>();

  get(locale: string): MessageDictionary | undefined {
    return this.messages.get(locale);
  }

  set(locale: string, messages: MessageDictionary): void {
    this.messages.set(locale, messages);
  }

  has(locale: string): boolean {
    return this.messages.has(locale);
  }

  merge(locale: string, messages: MessageDictionary): void {
    const existing = this.messages.get(locale) ?? {};
    this.messages.set(locale, this.deepMerge(existing, messages));
  }

  getLocales(): string[] {
    return Array.from(this.messages.keys());
  }

  getMessage(locale: string, key: string): string | undefined {
    const dictionary = this.messages.get(locale);
    if (!dictionary) return undefined;

    return this.getNestedValue(dictionary, key);
  }

  private getNestedValue(
    obj: MessageDictionary,
    key: string
  ): string | undefined {
    const keys = key.split('.');
    let current: unknown = obj;

    for (const k of keys) {
      if (current === null || typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[k];
    }

    return typeof current === 'string' ? current : undefined;
  }

  private deepMerge(
    target: MessageDictionary,
    source: MessageDictionary
  ): MessageDictionary {
    const result = { ...target };

    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        typeof targetValue === 'object' &&
        targetValue !== null
      ) {
        result[key] = this.deepMerge(
          targetValue as MessageDictionary,
          sourceValue as MessageDictionary
        );
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }

    return result;
  }
}
