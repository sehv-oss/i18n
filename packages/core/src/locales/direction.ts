/**
 * Language subtags written right-to-left, used when `Intl.Locale.prototype.getTextInfo` is unavailable.
 *
 * `getTextInfo` is present in Node 24+ and current Chromium, and absent in older Safari and Firefox,
 * so the list is the floor rather than the source of truth.
 */
const RTL_LANGUAGES = new Set([
  'ar',
  'arc',
  'ckb',
  'dv',
  'fa',
  'he',
  'ks',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
]);

/**
 * An `Intl.Locale` on an engine that implements `getTextInfo`.
 *
 * TypeScript 7 does not type the method yet, and not every engine ships it, so it is declared
 * as optional here and called through an optional chain rather than assumed.
 */
type LocaleWithTextInfo = Intl.Locale & {
  getTextInfo?: () => { direction?: string };
};

/**
 * The writing direction of a locale.
 *
 * Reads `Intl.Locale.prototype.getTextInfo` where the engine has it, and falls back to a list of
 * right-to-left language subtags where it does not. An unparseable tag is treated as left-to-right.
 *
 * @param locale - BCP 47 tag.
 * @returns `'rtl'` for a right-to-left locale, `'ltr'` otherwise.
 *
 * @example
 * ```ts
 * getTextDirection('he-IL'); // 'rtl'
 * getTextDirection('pt-BR'); // 'ltr'
 * ```
 */
export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  try {
    const parsed = new Intl.Locale(locale) as LocaleWithTextInfo;
    const direction = parsed.getTextInfo?.().direction;

    if (direction === 'rtl') return 'rtl';
    if (direction === 'ltr') return 'ltr';
  } catch {
    // Either the tag is invalid or the engine has no `getTextInfo`; the subtag list covers both.
  }

  const language = locale.split('-')[0]?.toLowerCase() ?? '';

  return RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr';
}
