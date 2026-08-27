import type {
  FormatDurationInput,
  FormatDurationOptions,
} from '@sehv-oss/i18n';
import { useFormatDuration } from '../hooks/use-format-duration.ts';

/**
 * Props for {@link FormatDuration}: the duration, plus every `Intl.DurationFormat` option spread as its own prop.
 */
export type FormatDurationProps = {
  /**
   * The duration to format, as units to values.
   */
  value: FormatDurationInput;
} & FormatDurationOptions;

/**
 * Renders a duration for the current locale, as a plain string.
 *
 * @example
 * ```tsx
 * <FormatDuration value={{ hours: 1, minutes: 30 }} /> // "1 hr, 30 min"
 * ```
 */
export function FormatDuration(props: FormatDurationProps) {
  const { value, ...options } = props;

  const formatDuration = useFormatDuration();

  return formatDuration(value, options);
}
