import * as React from 'react';
import type { FormatListOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

/**
 * Returns a list formatter bound to the current locale, stable across re-renders.
 *
 * The values are joined, not translated — translate them first if they are message keys.
 * Options are the `Intl.ListFormat` ones, plus a `locale` override.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const formatList = useFormatList();
 *
 * return <p>{formatList(['apple', 'banana', 'orange'])}</p>;
 * // "apple, banana, and orange"
 * ```
 */
export function useFormatList() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (values: string[], options?: FormatListOptions) => {
      return i18n.formatList(values, options);
    },
    [i18n]
  );
}
