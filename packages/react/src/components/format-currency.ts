import type { FormatCurrencyOptions } from '@sehv-oss/i18n';
import { useFormatCurrency } from '../hooks/use-format-currency';

/**
 * Props for {@link FormatCurrency}: the value and currency, plus the `Intl.NumberFormat` options — minus `style` — spread as their own props.
 */
export type FormatCurrencyProps = {
  /**
   * The amount to format.
   */
  value: number;

  /**
   * ISO 4217 code, such as `'USD'` or `'BRL'`.
   */
  currency: string;
} & FormatCurrencyOptions;

/**
 * Renders a currency amount for the current locale, as a plain string.
 *
 * @example
 * ```tsx
 * <FormatCurrency value={99.9} currency="USD" /> // "$99.90"
 * ```
 */
export function FormatCurrency(props: FormatCurrencyProps) {
  const { value, currency, ...options } = props;

  const formatCurrency = useFormatCurrency();

  return formatCurrency(value, currency, options);
}
