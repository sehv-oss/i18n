import * as React from 'react';
import type { TranslateArgs, TranslationKey } from '@sehv-oss/i18n';
import { useI18nContext } from '../context.ts';

/**
 * The function {@link useTranslate} returns.
 *
 * Named on purpose:
 * an inferred return type would let declaration emit resolve `TranslateArgs` against this package's own empty `Register`, and consumers would lose parameter checking.
 */
export type TranslateFn = <TKey extends TranslationKey>(
  key: TKey,
  ...values: TranslateArgs<TKey>
) => string;

/**
 * Returns a `translate` bound to the provided instance and current locale.
 *
 * The function is stable across re-renders and mirrors `I18nInstance.translate` exactly:
 * keys are checked once `Register` has been augmented, `values` is required precisely when the message declares placeholders, and an unknown key comes back as itself.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const translate = useTranslate();
 *
 * return <p>{translate('greeting', { name: 'World' })}</p>;
 * ```
 */
export const useTranslate = (): TranslateFn => {
  const { i18n } = useI18nContext();

  return React.useCallback<TranslateFn>(
    (key, ...values) => {
      return i18n.translate(key, ...values);
    },
    [i18n]
  );
};
