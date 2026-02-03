import type { FormatNumberOptions } from '@sehv-oss/i18n';
import { useFormatNumber } from '../hooks/use-format-number.ts';

export type FormatNumberProps = {
  value: number;
} & FormatNumberOptions;

export function FormatNumber(props: FormatNumberProps) {
  const { value, ...options } = props;

  const formatNumber = useFormatNumber();

  return formatNumber(value, options);
}
