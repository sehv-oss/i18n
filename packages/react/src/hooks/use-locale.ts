import * as React from 'react';

import { useI18nContext } from '../context.ts';

export type UseLocaleReturn = [string, (locale: string) => void];

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
