import * as React from 'react';
import type { FormatListOptions } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

export function useFormatList() {
  const { i18n } = useI18nContext();

  return React.useCallback(
    (values: string[], options?: FormatListOptions) => {
      return i18n.formatList(values, options);
    },
    [i18n]
  );
}
