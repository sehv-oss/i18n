import * as React from 'react';
import type { I18nInstance } from '@sehv-oss/i18n';
import { I18nContext, type I18nContextValue } from './context';

/**
 * Props for {@link I18nProvider}.
 */
export type I18nProviderProps = {
  /**
   * The instance to share, from `createI18n`. Create it outside the component tree so it survives re-renders.
   */
  i18n: I18nInstance;

  children: React.ReactNode;
};

/**
 * Makes an i18n instance available to the hooks and components below it, and re-renders that subtree whenever the locale changes.
 *
 * It subscribes to the instance rather than owning the locale, so `i18n.setLocale` from anywhere — including outside React — still updates the tree.
 *
 * @example
 * ```tsx
 * const i18n = createI18n({
 *   locale: 'en',
 *   messages: { en: { greeting: 'Hello, {$name}!' } },
 * });
 *
 * function App() {
 *   return (
 *     <I18nProvider i18n={i18n}>
 *       <MyComponent />
 *     </I18nProvider>
 *   );
 * }
 * ```
 */
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
