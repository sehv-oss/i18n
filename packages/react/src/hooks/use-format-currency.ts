import * as React from 'react';
import type { FormatCurrencyOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

/**
 * Returns a currency formatter bound to the current locale, stable across re-renders.
 *
 * The currency is an ISO 4217 code passed per call, since one locale routinely displays several.
 * Options are the `Intl.NumberFormat` ones without `style`, plus a `locale` override.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const formatCurrency = useFormatCurrency();
 *
 * return <p>{formatCurrency(99.9, 'USD')}</p>; // "$99.90"
 * ```
 */
export function useFormatCurrency() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (value: number, currency: string, options?: FormatCurrencyOptions) => {
      return i18n.formatCurrency(value, currency, options);
    },
    [i18n]
  );
}
