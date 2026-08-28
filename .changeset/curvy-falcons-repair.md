---
"@sehv-oss/i18n": major
---

feat(core)!: loadMessages deep-merges, add setMessages and removeMessages

`loadMessages` now deep-merges into the messages already stored for a locale, so one locale can be loaded in namespaced chunks. `setMessages(locale, messages)` keeps the old replace-everything behavior, and `removeMessages(locale)` drops a locale.
