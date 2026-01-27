import { useState, useCallback, useMemo, type ReactNode } from 'react';
import type { I18n } from '@sehv-oss/i18n';
import { I18nContext, type I18nContextValue } from './context.ts';

export interface I18nProviderProps {
  i18n: I18n;
  children: ReactNode;
}

export function I18nProvider({ i18n, children }: I18nProviderProps): ReactNode {
  const [locale, setLocaleState] = useState(i18n.locale);

  const wrappedI18n = useMemo(() => {
    const originalSetLocale = i18n.setLocale.bind(i18n);

    return new Proxy(i18n, {
      get(target, prop) {
        if (prop === 'setLocale') {
          return (newLocale: string) => {
            originalSetLocale(newLocale);
            setLocaleState(newLocale);
          };
        }
        const value = target[prop as keyof I18n];
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      },
    }) as I18n;
  }, [i18n]);

  const contextValue = useMemo<I18nContextValue>(
    () => ({
      i18n: wrappedI18n,
      locale,
    }),
    [wrappedI18n, locale]
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}
