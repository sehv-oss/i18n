export type Messages = Record<string, string>;

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

    return dictionary[key];
  }
}
