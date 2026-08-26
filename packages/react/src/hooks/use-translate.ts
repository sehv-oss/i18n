import * as React from 'react';
import type { TranslateArgs, TranslationKey } from '@sehv-oss/i18n';
import { useI18nContext } from '../context.ts';

/**
 * Named on purpose:
 * an inferred return type would let declaration emit resolve `TranslateArgs` against this package's own empty `Register`, and consumers would lose parameter checking.
 */
export type TranslateFn = <TKey extends TranslationKey>(
  key: TKey,
  ...values: TranslateArgs<TKey>
) => string;

export const useTranslate = (): TranslateFn => {
  const { i18n } = useI18nContext();

  return React.useCallback<TranslateFn>(
    (key, ...values) => {
      return i18n.translate(key, ...values);
    },
    [i18n]
  );
};
