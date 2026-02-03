import * as React from 'react';
import type { FormatCurrencyOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

export function useFormatCurrency() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (value: number, currency: string, options?: FormatCurrencyOptions) => {
      return i18n.formatCurrency(value, currency, options);
    },
    [i18n]
  );
}
