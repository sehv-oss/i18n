import * as React from 'react';
import type { FormatNumberOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

/**
 * Returns a number formatter bound to the current locale, stable across re-renders.
 *
 * Options are the `Intl.NumberFormat` ones, plus a `locale` to override the current one for a single call.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const formatNumber = useFormatNumber();
 *
 * return <p>{formatNumber(1234.56)}</p>; // "1,234.56"
 * ```
 */
export function useFormatNumber() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (value: number, options?: FormatNumberOptions) => {
      return i18n.formatNumber(value, options);
    },
    [i18n]
  );
}
