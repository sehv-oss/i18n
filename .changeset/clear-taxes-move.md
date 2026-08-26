---
"@sehv-oss/i18n": major
"@sehv-oss/i18n-react": major
---

# @sehv-oss/i18n

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
- `engines.node` is now `^22.12 || >=24 <27`, matching `messageformat`.
- Formatted output no longer goes through a result cache; compiled messages are cached instead. Values that are not JSON-serializable, such as `Date`, are no longer mis-keyed.

**New options**

- `onError: (error, key) => void` reports parse and resolution failures. Silent when omitted, as before.
- `bidiIsolation` defaults to `'none'`, keeping output free of the U+2068/U+2069 control characters the spec inserts around placeholders. Pass `'default'` for the spec behavior.

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
