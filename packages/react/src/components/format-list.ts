import type { FormatListOptions } from '@sehv-oss/i18n';

import { useFormatList } from '../hooks/use-format-list.ts';

/**
 * Props for {@link FormatList}: the values, plus every `Intl.ListFormat` option spread as its own prop.
 */
export type FormatListProps = {
  /**
   * Already formatted strings. They are joined, not translated.
   */
  values: string[];
} & FormatListOptions;

/**
 * Renders a locale-aware list for the current locale, as a plain string.
 *
 * @example
 * ```tsx
 * <FormatList values={['apple', 'banana', 'orange']} />
 * // "apple, banana, and orange"
 * ```
 */
export function FormatList(props: FormatListProps) {
  const { values, ...options } = props;

  const formatList = useFormatList();

  return formatList(values, options);
}
