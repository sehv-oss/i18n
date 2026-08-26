import type { MessageAt, TranslationKey } from './keys.types.ts';
import type { RegisteredMessages } from './register.types.ts';

type TrimEnd<TValue extends string> = TValue extends `${infer TRest} `
  ? TrimEnd<TRest>
  : TValue;

/**
 * The scope name a placeholder reads from:
 * `count :number` -> `count`
 * `user.name` -> `user`
 *
 * MessageFormat resolves `.` paths by longest matching prefix, so only the head segment has to be supplied.
 */
type VarName<TRaw extends string> = TRaw extends `${infer TName} ${string}`
  ? VarHead<TName>
  : VarHead<TRaw>;

type VarHead<TName extends string> = TName extends `${infer THead}.${string}`
  ? THead
  : TName;

/**
 * Every `{$name}` placeholder in a message source. Escaped `\{` is skipped, since it renders as literal text rather than a placeholder.
 */
export type MessageVars<TSource extends string> =
  TSource extends `${infer TPrefix}{$${infer TRest}`
    ? TRest extends `${infer TRaw}}${infer TTail}`
      ? TPrefix extends `${string}\\`
        ? MessageVars<TTail>
        : VarName<TRaw> | MessageVars<TTail>
      : never
    : never;

/**
 * Names bound by `.local $name = ...` declarations. They are internal to the message, so they are not parameters the caller has to pass.
 */
export type LocalNames<TSource extends string> =
  TSource extends `${string}.local $${infer TRest}`
    ? TRest extends `${infer TName}=${infer TTail}`
      ? TrimEnd<TName> | LocalNames<TTail>
      : never
    : never;

/**
 * The parameters a message expects, read straight from its source text.
 */
export type MessageParams<TSource extends string> = Exclude<
  MessageVars<TSource>,
  LocalNames<TSource>
>;

type MessageSource<TKey> = Extract<
  MessageAt<RegisteredMessages, Extract<TKey, string>>,
  string
>;

/**
 * The values object required by the message at `TKey`.
 */
export type TranslationValues<TKey extends TranslationKey> = [
  MessageParams<MessageSource<TKey>>,
] extends [never]
  ? Record<string, unknown>
  : { [TParam in MessageParams<MessageSource<TKey>>]: unknown };

/**
 * The trailing arguments of `translate`. Required when the message declares placeholders, optional when it does not, and always optional while {@link Register} has not been augmented.
 */
export type TranslateArgs<TKey extends TranslationKey> = [
  RegisteredMessages,
] extends [never]
  ? [values?: Record<string, unknown>]
  : [MessageParams<MessageSource<TKey>>] extends [never]
    ? [values?: Record<string, unknown>]
    : [values: TranslationValues<TKey>];
