import * as React from 'react';
import type {
  FormatRelativeTimeOptions,
  FormatRelativeTimeUnit,
} from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

/**
 * Returns a relative time formatter bound to the current locale, stable across re-renders.
 *
 * The value is an offset from now, negative for the past, and the unit takes either spelling — `'day'` and `'days'` mean the same thing.
 * Options are the `Intl.RelativeTimeFormat` ones, plus a `locale` override.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const formatRelativeTime = useFormatRelativeTime();
 *
 * return <p>{formatRelativeTime(-2, 'days')}</p>; // "2 days ago"
 * ```
 */
export function useFormatRelativeTime() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (
      value: number,
      unit: FormatRelativeTimeUnit,
      options?: FormatRelativeTimeOptions
    ) => {
      return i18n.formatRelativeTime(value, unit, options);
    },
    [i18n]
  );
}
