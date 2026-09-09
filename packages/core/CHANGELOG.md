# @sehv-oss/i18n

## 2.1.0

### Major Changes

- 0f2ccfa: feat(core)!: loadMessagesAsync takes the locale explicitly
  
  `loadMessagesAsync` now takes the locale explicitly: `loadMessagesAsync(locale, url)`. It used to infer the locale from the file name, which silently mis-filed any namespaced path — `/locales/en/common.json` loaded into a locale called `common`, because `Intl.getCanonicalLocales('common')` accepts it. Loaded messages are merged, so one locale can be assembled from several files.
- 0984f91: feat(core)!: accept custom MF2 functions and an injectable parser
  
  Add `functions` for custom MF2 function handlers (`{$word :shout}`), `draftFunctions: false` to leave the `messageformat` draft functions out of the bundle, and `parser` to replace the MessageFormat 2 parser entirely — the extension point `IParser` always described but nothing accepted. `IParserFactory` is exported alongside it.
- cff5bde: # @sehv-oss/i18n
  
  Replace the hand-rolled MessageFormat parser with `messageformat@4`, and check message keys at compile time.
  
  **MessageFormat 2**
  
  Messages are now parsed by the reference implementation of the [LDML 48 MessageFormat](https://www.unicode.org/reports/tr35/tr35-76/tr35-messageFormat.html) specification, which is also the polyfill for the TC39 `Intl.MessageFormat` proposal. `:date`, `:time`, `:datetime`, `:currency`, `:unit`, `:percent` and `:offset` are available in messages.
  
  **Type-safe keys**
  
  Augment `Register` once and every key, dot path and message placeholder is checked by the compiler. Without the augmentation keys fall back to `string`, so no type setup is required.
  
  ```typescript
  declare module '@sehv-oss/i18n' {
    interface Register {
      messages: typeof en;
    }
  }
  ```
  
  **Nested messages**
  
  `Messages` now accepts nested objects, read back by dot path (`translate('home.nav.back')`). A flat key that literally contains dots still wins over the nested path, so existing dictionaries keep working.
  
  **Breaking changes**
  
  - A `.match` selector must be annotated by a preceding `.input` or `.local` declaration. Rewrite `.match {$count :number}` as `.input {$count :number}` followed by `.match $count`; `.match $count` on its own is rejected.
  - `values` becomes a required argument when the message declares placeholders. This only applies once `Register` is augmented.
  - `messageformat` is now a dependency. It has no dependencies of its own, so nothing transitive is added.
  - `engines.node` is now `>=24 <27`.
  - Formatted output no longer goes through a result cache; compiled messages are cached instead. Values that are not JSON-serializable, such as `Date`, are no longer mis-keyed.
  
  **New options**
  
  - `onError: (error, key) => void` reports parse and resolution failures. Silent when omitted, as before.
  - `bidiIsolation` controls the U+2068/U+2069 control characters the spec inserts around placeholders. It defaults to `'auto'`, which isolates only in right-to-left locales; pass `'none'` or `'default'` to force one everywhere.
  
  # @sehv-oss/i18n-react
  
  Type `useTranslate` and `Translate` against the registered messages.
  
  Augmenting `Register` in `@sehv-oss/i18n` is enough — the hook and the component pick the keys up on their own. There is no generic to thread, no factory to call and nothing extra to pass to `I18nProvider`.
  
  ```tsx
  const translate = useTranslate();
  
  translate('home.title'); // ok
  translate('greetng', { name: 'World' }); // error: unknown key
  translate('greeting'); // error: the message declares $name
  
  <Translate id="greeting" values={{ name: 'World' }} />; // ok
  <Translate id="greeting" />; // error: values is required
  ```
  
  **Breaking changes**
  
  - `useTranslate()` returns a generic function whose key parameter is narrowed to the registered keys. Calls with keys outside that set stop compiling.
  - `TranslateProps` is now generic over the key, and `values` is required when the message declares placeholders.
  - `I18nContextValue` declares the `locale` field the provider has always supplied.
- 89fac8e: feat!: render markup placeholders as React elements
  
  Messages can now carry MF2 markup placeholders — `Accept the {#link}terms{/link}` — instead of being split across keys.
  
  `@sehv-oss/i18n` adds `translateToParts(key, values?)`, returning text and markup parts, and `IParser` gains an optional `parseToParts`.
  
  `@sehv-oss/i18n-react` adds `useRichTranslate()` and a `tags` prop on `<Translate>`, which fold those parts into React elements. `<Translate>` without `tags` behaves exactly as before.
- e4ddc5e: feat(core)!: loadMessages deep-merges, add setMessages and removeMessages
  
  `loadMessages` now deep-merges into the messages already stored for a locale, so one locale can be loaded in namespaced chunks. `setMessages(locale, messages)` keeps the old replace-everything behavior, and `removeMessages(locale)` drops a locale.
- 36411b0: feat(core)!: default bidiIsolation to auto
  
  `bidiIsolation` gains an `'auto'` value and now defaults to it: placeholders are left bare in left-to-right locales, and wrapped in the spec's U+2068/U+2069 isolates in right-to-left ones. The previous default, `'none'`, rendered mixed-direction text incorrectly in RTL locales. Pass `'none'` or `'default'` to force one everywhere. Exports `getTextDirection(locale)`.
- 6003fe3: feat: add display name and duration formatters
  
  Add `formatDisplayName` (`Intl.DisplayNames`) — the name of a language, region, script or currency written in the current locale, which is what a language switcher needs — and `formatDuration` (`Intl.DurationFormat`). Both ship with standalone `FormatDisplayName` / `FormatDuration` classes on `@sehv-oss/i18n/formatters`, and with `useFormatDisplayName` / `useFormatDuration` hooks and `<FormatDisplayName>` / `<FormatDuration>` components in the React package.
  
  `Intl.DurationFormat` is newer than the rest of the `Intl` API — feature-detect it on clients you do not control.
- e52191b: feat(core)!: resolve translations through a locale chain
  
  Message lookup now walks a locale chain instead of one exact tag: the current locale and its parents, then each fallback locale and its parents. `pt-BR` reads from `pt`, `en-US` reads from `en`. `fallbackLocale` accepts an array, `getLocaleChain()` exposes the resolution order, `getFallbackLocales()` returns them all, and the new `resolveLocale(requested, available)` picks the best available locale for an `Accept-Language` header or `navigator.languages`.
- b2fe64b: feat(core)!: bound the formatter cache and expose clearFormatterCaches
  
  The `Intl` formatter cache is now bounded (100 entries, LRU-by-insertion) instead of growing for the life of the process. Every formatter class gains a static `clearCache()`, and `clearFormatterCaches()` — exported from both entry points — empties all of them at once.
- 564ed26: feat(core)!: add onMissingKey and hasMessage
  
  Add `onMissingKey: (key, locale) => string | void`, called when a key resolves in no locale of the chain — previously a miss was silent, since `onError` only covers compile and format failures. Returning a string from the handler renders it in place of the key. Adds `hasMessage(key)` to test resolution without rendering.

### Minor Changes

- a3a5e8b: feat(core): add validateMessages
  
  Add `validateMessages(reference, target)`, which compares a locale against a reference locale and reports missing keys, leftover keys, and messages whose placeholders disagree — a translation that dropped `{$name}` renders without the value and throws nothing, so this is the check that covers the locales `Register` cannot. `extractPlaceholders(source)` is exported alongside it, as the runtime counterpart of the `MessageParams` type.

## 1.0.3

### Patch Changes

- 757a6b0: chore: bump deps and pnpm catalogs

## 1.0.2

### Patch Changes

- b24726b: fix: export dts files right

## 1.0.1

### Patch Changes

- 3e529ea: feat: enabled sourcemaps
- 42c0ec3: fix: added package json complementations

## 1.0.0

### Major Changes

- 24f48b7: Initial release of all packages
