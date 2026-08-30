---
"@sehv-oss/i18n": patch
---

feat(core)!: default bidiIsolation to auto

`bidiIsolation` gains an `'auto'` value and now defaults to it: placeholders are left bare in left-to-right locales, and wrapped in the spec's U+2068/U+2069 isolates in right-to-left ones. The previous default, `'none'`, rendered mixed-direction text incorrectly in RTL locales. Pass `'none'` or `'default'` to force one everywhere. Exports `getTextDirection(locale)`.
