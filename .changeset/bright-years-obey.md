---
"@sehv-oss/i18n": major
---

feat(core)!: loadMessagesAsync takes the locale explicitly

`loadMessagesAsync` now takes the locale explicitly: `loadMessagesAsync(locale, url)`. It used to infer the locale from the file name, which silently mis-filed any namespaced path — `/locales/en/common.json` loaded into a locale called `common`, because `Intl.getCanonicalLocales('common')` accepts it. Loaded messages are merged, so one locale can be assembled from several files.
