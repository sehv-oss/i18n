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

export type TranslateProps<TKey extends TranslationKey = TranslationKey> = {
  id: TKey;
} & ValuesProp<TKey>;

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
