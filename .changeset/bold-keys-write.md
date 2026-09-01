---
"@sehv-oss/i18n-react": major
---

fix(react)!: subscribe to the locale with useSyncExternalStore

`I18nProvider` subscribes to the instance through `useSyncExternalStore` instead of `useState` plus an effect. A `setLocale` landing between the provider's first render and its effect used to be dropped, leaving the tree on a stale locale until the next change; it is now observed. Hydration reads a server snapshot, and `useLocale` returns the locale from context rather than re-reading the instance. No signatures changed.
