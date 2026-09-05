/**
 * Locale-aware formatters as standalone classes, wrapping the `Intl` API with a shared instance cache.
 *
 * They are re-exported from the package root, and available on their own from `@sehv-oss/i18n/formatters` for code that formats without holding an i18n instance.
 *
 * @packageDocumentation
 */

import { FormatCurrency } from './currency.ts';
import { FormatDate } from './date.ts';
import { FormatDisplayName } from './display-name.ts';
import { FormatDuration } from './duration.ts';
import { FormatList } from './list.ts';
import { FormatNumber } from './number.ts';
import { FormatRelativeTime } from './relative-time.ts';

export * from './currency.ts';
export * from './date.ts';
export * from './display-name.ts';
export * from './duration.ts';
export * from './list.ts';
export * from './number.ts';
export * from './relative-time.ts';

/**
 * Empties every formatter cache in the package.
 *
 * @example
 * ```ts
 * import { clearFormatterCaches } from '@sehv-oss/i18n/formatters';
 *
 * afterEach(() => clearFormatterCaches());
 * ```
 */
export function clearFormatterCaches(): void {
  FormatCurrency.clearCache();
  FormatDate.clearCache();
  FormatDisplayName.clearCache();
  FormatDuration.clearCache();
  FormatList.clearCache();
  FormatNumber.clearCache();
  FormatRelativeTime.clearCache();
}
