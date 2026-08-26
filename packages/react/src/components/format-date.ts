import type { FormatDateOptions } from '@sehv-oss/i18n';

import { useFormatDate } from '../hooks/use-format-date.ts';

/**
 * Props for {@link FormatDate}: the value, plus every `Intl.DateTimeFormat` option spread as its own prop.
 */
export type FormatDateProps = {
  /**
   * A `Date`, or a timestamp in milliseconds.
   */
  value: Date | number;
} & FormatDateOptions;

/**
 * Renders a date for the current locale, as a plain string.
 *
 * @example
 * ```tsx
 * <FormatDate value={new Date()} dateStyle="long" />
 * // "January 27, 2026"
 * ```
 */
export function FormatDate(props: FormatDateProps) {
  const { value, ...options } = props;

  const formatDate = useFormatDate();

  return formatDate(value, options);
}
