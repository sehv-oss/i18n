import * as React from 'react';
import type {
  FormatRelativeTimeOptions,
  FormatRelativeTimeUnit,
} from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

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
