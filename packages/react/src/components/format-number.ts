import type { FormatNumberOptions } from '@sehv-oss/i18n';
import { useFormatNumber } from '../hooks/use-format-number.ts';

/**
 * Props for {@link FormatNumber}: the value, plus every `Intl.NumberFormat` option spread as its own prop.
 */
export type FormatNumberProps = {
  /**
   * The number to format.
   */
  value: number;
} & FormatNumberOptions;

/**
 * Renders a number for the current locale, as a plain string.
 *
 * @example
 * ```tsx
 * <FormatNumber value={1234.56} /> // "1,234.56"
 * <FormatNumber value={0.42} style="percent" /> // "42%"
 * ```
 */
export function FormatNumber(props: FormatNumberProps) {
  const { value, ...options } = props;

  const formatNumber = useFormatNumber();

  return formatNumber(value, options);
}
