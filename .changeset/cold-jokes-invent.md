---
"@sehv-oss/i18n": major
"@sehv-oss/i18n-react": major
---

feat!: render markup placeholders as React elements

Messages can now carry MF2 markup placeholders — `Accept the {#link}terms{/link}` — instead of being split across keys.

`@sehv-oss/i18n` adds `translateToParts(key, values?)`, returning text and markup parts, and `IParser` gains an optional `parseToParts`.

`@sehv-oss/i18n-react` adds `useRichTranslate()` and a `tags` prop on `<Translate>`, which fold those parts into React elements. `<Translate>` without `tags` behaves exactly as before.
