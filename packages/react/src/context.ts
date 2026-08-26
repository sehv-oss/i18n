import * as React from 'react';
import type { I18nInstance } from '@sehv-oss/i18n';

/**
 * What {@link I18nProvider} puts on the context.
 */
export type I18nContextValue = {
  /**
   * The shared instance every hook and component reads from.
   */
  i18n: I18nInstance;

  /**
   * The current locale, tracked in provider state so a change re-renders the tree. Reading it from the instance directly would not.
   */
  locale: string;
};

/**
 * The context {@link I18nProvider} fills in.
 *
 * Exported for interoperability — reading it directly is rarely needed, since {@link useI18n} and the formatting hooks already cover it.
 */
export const I18nContext = React.createContext<I18nContextValue | null>(null);

/**
 * Reads the i18n context, asserting that a provider is above.
 *
 * Every hook in this package goes through it, which is what turns a missing provider into one clear error instead of a scatter of `undefined`s.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 */
export const useI18nContext = () => {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('Context not initialized.');
  }

  return context;
};
