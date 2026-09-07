# @sehv-oss/i18n-react

## 2.0.0

### Major Changes

- f73eb3d: fix(react)!: subscribe to the locale with useSyncExternalStore

  `I18nProvider` subscribes to the instance through `useSyncExternalStore` instead of `useState` plus an effect. A `setLocale` landing between the provider's first render and its effect used to be dropped, leaving the tree on a stale locale until the next change; it is now observed. Hydration reads a server snapshot, and `useLocale` returns the locale from context rather than re-reading the instance. No signatures changed.

- cff5bde: # @sehv-oss/i18n

  Replace the hand-rolled MessageFormat parser with `messageformat@4`, and check message keys at compile time.

  **MessageFormat 2**

  Messages are now parsed by the reference implementation of the [LDML 48 MessageFormat](https://www.unicode.org/reports/tr35/tr35-76/tr35-messageFormat.html) specification, which is also the polyfill for the TC39 `Intl.MessageFormat` proposal. `:date`, `:time`, `:datetime`, `:currency`, `:unit`, `:percent` and `:offset` are available in messages.

  **Type-safe keys**

  Augment `Register` once and every key, dot path and message placeholder is checked by the compiler. Without the augmentation keys fall back to `string`, so no type setup is required.

  ```typescript
  declare module "@sehv-oss/i18n" {
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

  translate("home.title"); // ok
  translate("greetng", { name: "World" }); // error: unknown key
  translate("greeting"); // error: the message declares $name

  <Translate id="greeting" values={{ name: "World" }} />; // ok
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

- 6003fe3: feat: add display name and duration formatters

  Add `formatDisplayName` (`Intl.DisplayNames`) — the name of a language, region, script or currency written in the current locale, which is what a language switcher needs — and `formatDuration` (`Intl.DurationFormat`). Both ship with standalone `FormatDisplayName` / `FormatDuration` classes on `@sehv-oss/i18n/formatters`, and with `useFormatDisplayName` / `useFormatDuration` hooks and `<FormatDisplayName>` / `<FormatDuration>` components in the React package.

  `Intl.DurationFormat` is newer than the rest of the `Intl` API — feature-detect it on clients you do not control.

### Patch Changes

- a3abd0f: chore: bump dependencies to latest
- Updated dependencies [0f2ccfa]
- Updated dependencies [0984f91]
- Updated dependencies [cff5bde]
- Updated dependencies [89fac8e]
- Updated dependencies [e4ddc5e]
- Updated dependencies [36411b0]
- Updated dependencies [6003fe3]
- Updated dependencies [a3a5e8b]
- Updated dependencies [e52191b]
- Updated dependencies [b2fe64b]
- Updated dependencies [564ed26]
  - @sehv-oss/i18n@2.0.0

## 1.0.3

### Patch Changes

- 757a6b0: chore: bump deps and pnpm catalogs
- Updated dependencies [757a6b0]
  - @sehv-oss/i18n@1.0.3

## 1.0.2

### Patch Changes

- b24726b: fix: export dts files right
- Updated dependencies [b24726b]
  - @sehv-oss/i18n@1.0.2

## 1.0.1

### Patch Changes

- 3e529ea: feat: enabled sourcemaps
- 42c0ec3: fix: added package json complementations
- Updated dependencies [3e529ea]
- Updated dependencies [42c0ec3]
  - @sehv-oss/i18n@1.0.1

## 1.0.0

### Major Changes

- 24f48b7: Initial release of all packages

### Patch Changes

- Updated dependencies [24f48b7]
  - @sehv-oss/i18n@1.0.0
