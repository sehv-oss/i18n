import * as React from 'react';
import { useI18nContext } from '../context.ts';

export const useTranslate = () => {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (key: string, values?: Record<string, unknown>) => {
      return i18n.translate(key, values);
    },
    [i18n]
  );
};
