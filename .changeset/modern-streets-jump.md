---
"@sehv-oss/i18n": minor
---

feat(core): add validateMessages

Add `validateMessages(reference, target)`, which compares a locale against a reference locale and reports missing keys, leftover keys, and messages whose placeholders disagree — a translation that dropped `{$name}` renders without the value and throws nothing, so this is the check that covers the locales `Register` cannot. `extractPlaceholders(source)` is exported alongside it, as the runtime counterpart of the `MessageParams` type.
