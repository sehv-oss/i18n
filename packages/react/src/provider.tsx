import * as React from 'react';
import type { I18nInstance } from '@sehv-oss/i18n';
import { I18nContext, type I18nContextValue } from './context';

export type I18nProviderProps = {
  i18n: I18nInstance;
  children: React.ReactNode;
};

export function I18nProvider(props: I18nProviderProps) {
  const { i18n, children } = props;

  const [locale, setLocaleState] = React.useState(i18n.getLocale());

  // maybe we can use an event dispatcher in i18n instance when locale change
  const wrappedI18n = React.useMemo(() => {
    const originalSetLocale = i18n.setLocale.bind(i18n);

    return new Proxy(i18n, {
      get(target, prop) {
        if (prop === 'setLocale') {
          return (newLocale: string) => {
            originalSetLocale(newLocale);
            setLocaleState(newLocale);
          };
        }

        const value = target[prop as keyof I18nInstance];
        if (typeof value === 'function') {
          return value.bind(target);
        }

        return value;
      },
    });
  }, [i18n]);

  const contextValue = React.useMemo<I18nContextValue>(
    () => ({
      i18n: wrappedI18n,
      locale,
    }),
    [wrappedI18n, locale]
  );

  return <I18nContext value={contextValue}>{children}</I18nContext>;
}
