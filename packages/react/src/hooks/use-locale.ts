import * as React from 'react';

import { useI18nContext } from '../context.ts';

/**
 * The `[locale, setLocale]` pair returned by {@link useLocale}, shaped like `useState`.
 */
export type UseLocaleReturn = [string, (locale: string) => void];

/**
 * Reads and switches the current locale.
 *
 * Setting it updates the instance, which re-renders every subscriber under the provider — not just this component.
 * Messages for the new locale have to be loaded already; nothing is fetched here.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const [locale, setLocale] = useLocale();
 *
 * return (
 *   <button onClick={() => setLocale(locale === 'en' ? 'pt-BR' : 'en')}>
 *     {locale}
 *   </button>
 * );
 * ```
 */
export function useLocale(): UseLocaleReturn {
  const { i18n } = useI18nContext();

  const setLocale = React.useCallback(
    (newLocale: string) => {
      i18n.setLocale(newLocale);
    },
    [i18n]
  );

  const locale = i18n.getLocale();

  return [locale, setLocale];
}
