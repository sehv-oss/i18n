/**
 * A run of literal text, with every formatted placeholder in it already resolved to a string.
 */
export type I18nTextPart = {
  type: 'text';
  value: string;
};

/**
 * A markup placeholder — `{#link}`, `{/link}` or `{#br /}` — left for the caller to render.
 *
 * The parts stream is flat: an `'open'` part is closed by a later `'close'` part with the same `name`,
 * and the caller pairs them. `@sehv-oss/i18n-react` does exactly that in `useRichTranslate`.
 */
export type I18nMarkupPart = {
  type: 'markup';
  kind: 'open' | 'close' | 'standalone';
  name: string;
  options?: Record<string, unknown>;
};

/**
 * One piece of a message formatted with `translateToParts`.
 */
export type I18nPart = I18nTextPart | I18nMarkupPart;
