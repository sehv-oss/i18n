import * as React from 'react';
import type { FormatDateOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

/**
 * Returns a date formatter bound to the current locale, stable across re-renders. Accepts a `Date` or a timestamp in milliseconds.
 *
 * Options are the `Intl.DateTimeFormat` ones, plus a `locale` to override the current one for a single call.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const formatDate = useFormatDate();
 *
 * return <p>{formatDate(new Date(), { dateStyle: 'long' })}</p>;
 * ```
 */
export function useFormatDate() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (value: Date | number, options?: FormatDateOptions) => {
      return i18n.formatDate(value, options);
    },
    [i18n]
  );
}
