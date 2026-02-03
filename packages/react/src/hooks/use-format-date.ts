import * as React from 'react';
import type { FormatDateOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

export function useFormatDate() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (value: Date | number, options?: FormatDateOptions) => {
      return i18n.formatDate(value, options);
    },
    [i18n]
  );
}
