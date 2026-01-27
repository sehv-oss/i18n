import { createContext } from 'react';
import type { I18n } from '@sehv-oss/i18n';

export interface I18nContextValue {
  i18n: I18n;
  locale: string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
