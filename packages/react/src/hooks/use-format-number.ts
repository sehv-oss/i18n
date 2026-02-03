import * as React from 'react';
import type { FormatNumberOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

export function useFormatNumber() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (value: number, options?: FormatNumberOptions) => {
      return i18n.formatNumber(value, options);
    },
    [i18n]
  );
}
