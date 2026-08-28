import type { Messages } from './messages.ts';

/**
 * Deep-merges `source` into `target`, returning a new object and mutating neither.
 *
 * Two groups at the same key are merged recursively; anything else in `source` wins outright,
 * so a message replaces a message, and a message replaces a whole group.
 *
 * @param target - The messages already stored.
 * @param source - The messages being loaded on top.
 * @returns A new object holding both sides.
 *
 * @example
 * ```ts
 * mergeMessages({ home: { title: 'Home' } }, { home: { nav: 'Back' } });
 * // { home: { title: 'Home', nav: 'Back' } }
 * ```
 */
export function mergeMessages(target: Messages, source: Messages): Messages {
  const result: Messages = { ...target };

  for (const [key, value] of Object.entries(source)) {
    const existing = result[key];

    if (isGroup(existing) && isGroup(value)) {
      result[key] = mergeMessages(existing, value);
      continue;
    }

    result[key] = value;
  }

  return result;
}

function isGroup(value: string | Messages | undefined): value is Messages {
  return typeof value === 'object' && value !== null;
}
