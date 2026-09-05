import * as React from 'react';
import type { FormatDisplayNameOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

/**
 * Returns a display-name formatter bound to the current locale, stable across re-renders.
 *
 * `options.type` is required, the same way `Intl.DisplayNames` requires it.
 *
 * @returns A function naming a language, region, script or currency in the current locale.
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const formatDisplayName = useFormatDisplayName();
 *
 * return <p>{formatDisplayName('en-US', { type: 'language' })}</p>;
 * ```
 */
export function useFormatDisplayName() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (value: string, options: FormatDisplayNameOptions) => {
      return i18n.formatDisplayName(value, options);
    },
    [i18n]
  );
}
