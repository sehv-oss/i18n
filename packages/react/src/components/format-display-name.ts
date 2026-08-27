import type { FormatDisplayNameOptions } from '@sehv-oss/i18n';
import { useFormatDisplayName } from '../hooks/use-format-display-name.ts';

/**
 * Props for {@link FormatDisplayName}: the code, plus every `Intl.DisplayNames` option spread as its own prop.
 */
export type FormatDisplayNameProps = {
  /**
   * The code to name: a BCP 47 tag, region code, script code or currency code, matching `type`.
   */
  value: string;
} & FormatDisplayNameOptions;

/**
 * Renders the name of a language, region, script or currency for the current locale, as a plain string.
 *
 * @example
 * ```tsx
 * <FormatDisplayName value="en-US" type="language" /> // "English (United States)"
 * ```
 */
export function FormatDisplayName(props: FormatDisplayNameProps) {
  const { value, ...options } = props;

  const formatDisplayName = useFormatDisplayName();

  return formatDisplayName(value, options);
}
