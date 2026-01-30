import type { Messages } from '../messages/messages.ts';

export interface ILoader {
  extensions: string[];
  parse(content: string): Messages;
}
