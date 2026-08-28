---
"@sehv-oss/i18n": major
---

feat(core)!: bound the formatter cache and expose clearFormatterCaches

The `Intl` formatter cache is now bounded (100 entries, LRU-by-insertion) instead of growing for the life of the process. Every formatter class gains a static `clearCache()`, and `clearFormatterCaches()` — exported from both entry points — empties all of them at once.
