/**
 * Hooks reading the i18n instance provided by `I18nProvider`.
 *
 * Every returned function is memoized on the instance, so passing one to a memoized child does not defeat the memoization.
 *
 * @packageDocumentation
 */

export * from './use-format-currency.ts';
export * from './use-format-date.ts';
export * from './use-format-display-name.ts';
export * from './use-format-duration.ts';
export * from './use-format-list.ts';
export * from './use-format-number.ts';
export * from './use-format-relative-time.ts';
export * from './use-i18n.ts';
export * from './use-rich-translate.tsx';
export * from './use-locale.ts';
export * from './use-translate.ts';
