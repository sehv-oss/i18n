import type { FormatListOptions } from '@sehv-oss/i18n';

import { useFormatList } from '../hooks/use-format-list.ts';

export type FormatListProps = {
  values: string[];
} & FormatListOptions;

export function FormatList(props: FormatListProps) {
  const { values, ...options } = props;

  const formatList = useFormatList();

  return formatList(values, options);
}
