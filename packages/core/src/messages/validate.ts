import type { Messages } from './messages.ts';

const PLACEHOLDER = /(\\?)\{\$([^}]+)\}/g;

/**
 * The placeholder names a message reads, deduplicated and in order of first appearance.
 *
 * This is the runtime counterpart of the `MessageParams` type: it applies the same rules, so a message
 * that typechecks and a message that validates agree on what the caller has to pass. Only the head
 * segment of a dotted path counts — `{$user.name}` asks for `user` — annotations after the name are
 * ignored, and an escaped `\{` is literal text rather than a placeholder.
 *
 * @param source - The message source text.
 * @returns The placeholder names, deduplicated.
 *
 * @example
 * ```ts
 * extractPlaceholders('Hi {$user.name}, you have {$count :number}');
 * // ['user', 'count']
 * ```
 */
export function extractPlaceholders(source: string): string[] {
  const names = new Set<string>();

  for (const match of source.matchAll(PLACEHOLDER)) {
    const [, escape, raw] = match;

    if (escape || raw === undefined) continue;

    const name = raw.split(' ')[0]?.split('.')[0];

    if (name) names.add(name);
  }

  return Array.from(names);
}

/**
 * One message whose placeholders do not match the reference.
 */
export type MessagesValidationIssue = {
  /**
   * Dot path of the message.
   */
  key: string;

  /**
   * Placeholders the reference message reads.
   */
  expected: string[];

  /**
   * Placeholders the target message reads.
   */
  actual: string[];
};

/**
 * What {@link validateMessages} found.
 */
export type MessagesValidationResult = {
  /**
   * Keys present in the reference and absent from the target — untranslated messages.
   */
  missing: string[];

  /**
   * Keys present in the target and absent from the reference — usually a leftover after a rename.
   */
  extra: string[];

  /**
   * Messages present in both whose placeholders disagree. A translation that dropped `{$name}` renders
   * without the value and nothing throws, which is what makes this worth checking.
   */
  mismatched: MessagesValidationIssue[];
};

/**
 * Compares one locale's messages against a reference locale.
 *
 * `Register` only checks the locale you register, so every other locale is unchecked at compile time.
 * Run this over them — in a test, or in a CI script — and a dropped key or a dropped placeholder fails
 * the build instead of reaching a reader.
 *
 * @param reference - The locale that defines the expected shape, usually your source language.
 * @param target - The locale being checked.
 * @returns The missing keys, the leftover keys, and the messages whose placeholders disagree.
 *
 * @example
 * ```ts
 * import en from './locales/en.ts';
 * import ptBR from './locales/pt-BR.ts';
 *
 * test('pt-BR matches en', () => {
 *   expect(validateMessages(en, ptBR)).toEqual({
 *     missing: [],
 *     extra: [],
 *     mismatched: [],
 *   });
 * });
 * ```
 */
export function validateMessages(
  reference: Messages,
  target: Messages
): MessagesValidationResult {
  const referenceEntries = flatten(reference);
  const targetEntries = flatten(target);

  const missing: string[] = [];
  const extra: string[] = [];
  const mismatched: MessagesValidationIssue[] = [];

  for (const [key, source] of referenceEntries) {
    const translated = targetEntries.get(key);

    if (translated === undefined) {
      missing.push(key);
      continue;
    }

    const expected = extractPlaceholders(source);
    const actual = extractPlaceholders(translated);

    if (!sameSet(expected, actual)) {
      mismatched.push({ key, expected, actual });
    }
  }

  for (const key of targetEntries.keys()) {
    if (!referenceEntries.has(key)) extra.push(key);
  }

  return { missing, extra, mismatched };
}

function flatten(messages: Messages, prefix = ''): Map<string, string> {
  const entries = new Map<string, string>();

  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      entries.set(path, value);
      continue;
    }

    for (const [nested, source] of flatten(value, path)) {
      entries.set(nested, source);
    }
  }

  return entries;
}

function sameSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;

  const rightSet = new Set(right);

  return left.every((value) => rightSet.has(value));
}
