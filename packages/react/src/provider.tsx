import * as React from 'react';
import type { I18nInstance } from '@sehv-oss/i18n';
import { I18nContext, type I18nContextValue } from './context';

export type I18nProviderProps = {
  i18n: I18nInstance;
  children: React.ReactNode;
};

export function I18nProvider(props: I18nProviderProps) {
  const { i18n, children } = props;

  const [locale, setLocale] = React.useState(i18n.getLocale());

  React.useEffect(() => {
    return i18n.onLocaleChange(setLocale);
  }, [i18n]);

  const contextValue = React.useMemo<I18nContextValue>(
    () => ({
      i18n,
      locale,
    }),
    [i18n, locale]
  );

  return <I18nContext value={contextValue}>{children}</I18nContext>;
}
