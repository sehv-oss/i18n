import type { RegisteredMessages } from './register.types.ts';

/**
 * Every dot-separated path that resolves to a message in `TMessages`.
 *
 * ```ts
 * type Keys = MessageKey<{ greeting: string; home: { title: string } }>;
 * // 'greeting' | 'home.title'
 * ```
 */
export type MessageKey<TMessages> = {
  [TKey in keyof TMessages & string]: TMessages[TKey] extends string
    ? TKey
    : `${TKey}.${MessageKey<TMessages[TKey]>}`;
}[keyof TMessages & string];

/**
 * The keys accepted by `translate`. Resolves to the registered message paths,
 * or to `string` when {@link Register} has not been augmented.
 */
export type TranslationKey = [RegisteredMessages] extends [never]
  ? string
  : MessageKey<RegisteredMessages>;

/**
 * The message sitting at `TKey`, walking dot-separated segments.
 */
export type MessageAt<
  TMessages,
  TKey extends string,
> = TKey extends `${infer THead}.${infer TRest}`
  ? THead extends keyof TMessages
    ? MessageAt<TMessages[THead], TRest>
    : never
  : TKey extends keyof TMessages
    ? TMessages[TKey]
    : never;
