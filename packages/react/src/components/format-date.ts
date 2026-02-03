import type { FormatDateOptions } from '@sehv-oss/i18n';

import { useFormatDate } from '../hooks/use-format-date.ts';

export type FormatDateProps = {
  value: Date | number;
} & FormatDateOptions;

export function FormatDate(props: FormatDateProps) {
  const { value, ...options } = props;

  const formatDate = useFormatDate();

  return formatDate(value, options);
}
