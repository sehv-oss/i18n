export type Messages = { [key: string]: string | Messages };

export class MessagesManager {
  private messages = new Map<string, Messages>();

  public get(locale: string): Messages | undefined {
    return this.messages.get(locale);
  }

  public set(locale: string, messages: Messages): void {
    this.messages.set(locale, messages);
  }

  public has(locale: string): boolean {
    return this.messages.has(locale);
  }

  public getLocales(): string[] {
    return Array.from(this.messages.keys());
  }

  public getMessage(locale: string, key: string): string | undefined {
    const dictionary = this.get(locale);
    if (!dictionary) return;

    const flat = dictionary[key];
    if (typeof flat === 'string') return flat;

    return this.walk(dictionary, key);
  }

  private walk(dictionary: Messages, key: string): string | undefined {
    let current: string | Messages | undefined = dictionary;

    for (const segment of key.split('.')) {
      if (typeof current !== 'object') return;

      current = current[segment];
    }

    return typeof current === 'string' ? current : undefined;
  }
}
