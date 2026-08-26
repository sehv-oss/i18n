/**
 * Compile-time extension point for message typing.
 *
 * Augment it once in your application to make every key — and every message parameter — statically checked:
 *
 * ```ts
 * declare module '@sehv-oss/i18n' {
 *   interface Register {
 *     messages: typeof import('./locales/en.json');
 *   }
 * }
 * ```
 *
 * Without the augmentation every key falls back to `string`, so the library stays usable with no type setup at all.
 */
export interface Register {}

/**
 * The message shape declared through {@link Register}, or `never` when the consumer has not augmented it.
 */
export type RegisteredMessages = Register extends { messages: infer TMessages }
  ? TMessages
  : never;
