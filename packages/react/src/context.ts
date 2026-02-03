import * as React from 'react';
import type { I18nInstance } from '@sehv-oss/i18n';

export type I18nContextValue = {
  i18n: I18nInstance;
};

export const I18nContext = React.createContext<I18nContextValue | null>(null);

export const useI18nContext = () => {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('Context not initialized.');
  }

  return context;
};
