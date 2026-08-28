---
"@sehv-oss/i18n": major
---

feat(core)!: resolve translations through a locale chain

Message lookup now walks a locale chain instead of one exact tag: the current locale and its parents, then each fallback locale and its parents. `pt-BR` reads from `pt`, `en-US` reads from `en`. `fallbackLocale` accepts an array, `getLocaleChain()` exposes the resolution order, `getFallbackLocales()` returns them all, and the new `resolveLocale(requested, available)` picks the best available locale for an `Accept-Language` header or `navigator.languages`.
