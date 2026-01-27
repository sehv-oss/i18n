import type { MessageDictionary } from '../types.ts';

export interface MessageLoader {
  extensions: string[];
  parse(content: string): MessageDictionary;
}
