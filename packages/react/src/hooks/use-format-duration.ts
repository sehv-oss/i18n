import * as React from 'react';
import type {
  FormatDurationInput,
  FormatDurationOptions,
} from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

/**
 * Returns a duration formatter bound to the current locale, stable across re-renders.
 *
 * Options are the `Intl.DurationFormat` ones, plus a `locale` to override the current one for a single call.
 *
 * @returns A function formatting a duration in the current locale.
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const formatDuration = useFormatDuration();
 *
 * return <p>{formatDuration({ hours: 1, minutes: 30 })}</p>; // "1 hr, 30 min"
 * ```
 */
export function useFormatDuration() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (value: FormatDurationInput, options?: FormatDurationOptions) => {
      return i18n.formatDuration(value, options);
    },
    [i18n]
  );
}
