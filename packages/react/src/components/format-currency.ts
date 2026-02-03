import type { FormatCurrencyOptions } from '@sehv-oss/i18n';
import { useFormatCurrency } from '../hooks/use-format-currency';

export type FormatCurrencyProps = {
  value: number;
  currency: string;
} & FormatCurrencyOptions;

export function FormatCurrency(props: FormatCurrencyProps) {
  const { value, currency, ...options } = props;

  const formatCurrency = useFormatCurrency();

  return formatCurrency(value, currency, options);
}
