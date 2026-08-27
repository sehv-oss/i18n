/**
 * Expands a BCP 47 tag into itself followed by every parent, most specific first.
 *
 * Truncations that would end on an extension singleton — the `x` of `pt-BR-x-legacy` — are skipped,
 * since they are not tags anyone would register messages under.
 *
 * @param locale - The tag to expand, such as `'pt-BR'`.
 * @returns The tag and every parent, most specific first.
 *
 * @example
 * ```ts
 * expandLocale('zh-Hant-TW'); // ['zh-Hant-TW', 'zh-Hant', 'zh']
 * ```
 */
export function expandLocale(locale: string): string[] {
  const segments = locale.split('-');
  const chain: string[] = [];

  for (let index = segments.length; index > 0; index--) {
    const candidate = segments.slice(0, index);
    const last = candidate[candidate.length - 1];

    if (last === undefined || last.length === 1) continue;

    chain.push(candidate.join('-'));
  }

  return chain;
}

/**
 * Picks the best available locale for a request, the way `Accept-Language` negotiation does.
 *
 * Each requested tag is tried in order, and each one is expanded to its parents before moving on,
 * so `['de', 'fr-CA']` against `['en', 'fr']` resolves to `'fr'`.
 * Matching ignores case, but the returned tag is spelled the way `available` spells it.
 *
 * @param requested - One tag, or tags in descending preference — `navigator.languages` fits directly.
 * @param available - The tags you actually have messages for, such as `i18n.getLocales()`.
 * @returns The matching tag from `available`, or `undefined` when none matches.
 *
 * @example
 * ```ts
 * resolveLocale(navigator.languages, i18n.getLocales()) ?? 'en';
 * ```
 */
export function resolveLocale(
  requested: string | readonly string[],
  available: readonly string[]
): string | undefined {
  const requestedList = typeof requested === 'string' ? [requested] : requested;
  const lookup = new Map(
    available.map((locale) => [locale.toLowerCase(), locale])
  );

  for (const candidate of requestedList) {
    for (const tag of expandLocale(candidate)) {
      const match = lookup.get(tag.toLowerCase());

      if (match !== undefined) return match;
    }
  }

  return undefined;
}
