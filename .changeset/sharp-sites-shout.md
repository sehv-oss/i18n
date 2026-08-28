---
"@sehv-oss/i18n": major
---

feat(core)!: add onMissingKey and hasMessage

Add `onMissingKey: (key, locale) => string | void`, called when a key resolves in no locale of the chain — previously a miss was silent, since `onError` only covers compile and format failures. Returning a string from the handler renders it in place of the key. Adds `hasMessage(key)` to test resolution without rendering.
