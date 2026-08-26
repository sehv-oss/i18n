import type { TranslateArgs, TranslationKey } from '@sehv-oss/i18n';
import { useTranslate } from '../hooks/use-translate.ts';

/**
 * `values` mirrors `translate`:
 * required when the message declares placeholders, optional when it does not.
 */
type ValuesProp<TKey extends TranslationKey> =
  TranslateArgs<TKey> extends [values: infer TValues]
    ? { values: TValues }
    : { values?: Record<string, unknown> };

/**
 * Props for {@link Translate}, narrowed by the key: `values` becomes required as soon as the message at `id` declares a placeholder.
 */
export type TranslateProps<TKey extends TranslationKey = TranslationKey> = {
  /**
   * Dot path of the message to render.
   */
  id: TKey;
} & ValuesProp<TKey>;

/**
 * Renders the message at `id` for the current locale, as a plain string.
 *
 * The declarative counterpart of `useTranslate`, with the same typing:
 * an unknown key and a missing `values` are both compile errors once `Register` has been augmented.
 *
 * @example
 * ```tsx
 * <Translate id="home.title" />
 * <Translate id="greeting" values={{ name: 'World' }} />
 * ```
 */
export function Translate<TKey extends TranslationKey>(
  props: TranslateProps<TKey>
) {
  const { id, values } = props as {
    id: TKey;
    values?: Record<string, unknown>;
  };

  const translate = useTranslate();

  return translate(id, ...([values] as TranslateArgs<TKey>));
}
