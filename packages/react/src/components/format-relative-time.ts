import type {
  FormatRelativeTimeOptions,
  FormatRelativeTimeUnit,
} from '@sehv-oss/i18n';

import { useFormatRelativeTime } from '../hooks/use-format-relative-time.ts';

/**
 * Props for {@link FormatRelativeTime}: the value and unit, plus every `Intl.RelativeTimeFormat` option spread as its own prop.
 */
export type FormatRelativeTimeProps = {
  /**
   * Offset from now. Negative points to the past.
   */
  value: number;

  /**
   * Singular or plural, both accepted.
   */
  unit: FormatRelativeTimeUnit;
} & FormatRelativeTimeOptions;

/**
 * Renders a relative time for the current locale, as a plain string.
 *
 * The output is computed on render, not on a timer — re-render it yourself if it has to keep counting.
 *
 * @example
 * ```tsx
 * <FormatRelativeTime value={-2} unit="days" /> // "2 days ago"
 * ```
 */
export function FormatRelativeTime(props: FormatRelativeTimeProps) {
  const { value, unit, ...options } = props;

  const formatRelativeTime = useFormatRelativeTime();

  return formatRelativeTime(value, unit, options);
}
