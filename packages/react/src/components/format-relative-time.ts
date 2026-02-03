import type {
  FormatRelativeTimeOptions,
  FormatRelativeTimeUnit,
} from '@sehv-oss/i18n';

import { useFormatRelativeTime } from '../hooks/use-format-relative-time.ts';

export type FormatRelativeTimeProps = {
  value: number;
  unit: FormatRelativeTimeUnit;
} & FormatRelativeTimeOptions;

export function FormatRelativeTime(props: FormatRelativeTimeProps) {
  const { value, unit, ...options } = props;

  const formatRelativeTime = useFormatRelativeTime();

  return formatRelativeTime(value, unit, options);
}
