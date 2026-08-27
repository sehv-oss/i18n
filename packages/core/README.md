# @sehv-oss/i18n

Core i18n library for JavaScript.

## Installation

```bash
# npm
npm install @sehv-oss/i18n

# yarn
yarn add @sehv-oss/i18n

# pnpm
pnpm add @sehv-oss/i18n
```

## Usage

### Basic

```typescript
import { createI18n } from '@sehv-oss/i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      greeting: 'Hello, {$name}!',
      items: `.input {$count :number}
.match $count
one {{You have {$count} item}}
*   {{You have {$count} items}}`,
    },
  },
});

i18n.translate('greeting', { name: 'World' });
// → "Hello, World!"

i18n.translate('items', { count: 5 });
// → "You have 5 items"
```

Messages follow the [LDML 48 MessageFormat](https://www.unicode.org/reports/tr35/tr35-76/tr35-messageFormat.html) syntax. A `.match` selector must be annotated by a preceding `.input` or `.local` declaration — `.match $count` on its own is rejected.

### Nested messages

Messages can be nested, and are read back by dot path:

```typescript
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      home: {
        title: 'Home',
        nav: { back: 'Back' },
      },
    },
  },
});

i18n.translate('home.nav.back');
// → "Back"
```

A flat key that literally contains dots still wins over the nested path, so existing dictionaries keep working unchanged.

### Locale fallback

Lookup walks the current locale, its parents, then each fallback locale and its parents:

```typescript
const i18n = createI18n({
  locale: 'pt-BR',
  fallbackLocale: ['pt', 'en'],
  messages: { pt: { greeting: 'Olá!' }, en: { bye: 'Bye' } },
});

i18n.getLocaleChain(); // ['pt-BR', 'pt', 'en']
i18n.translate('greeting'); // → "Olá!"  (from 'pt')
i18n.translate('bye'); // → "Bye"   (from 'en')
```

Only the message text comes from the fallback — formatting still uses the current locale.

### Picking a locale

`resolveLocale` matches a request against what you actually have loaded:

```typescript
import { resolveLocale } from '@sehv-oss/i18n';

const locale = resolveLocale(navigator.languages, i18n.getLocales()) ?? 'en';
i18n.setLocale(locale);
```

On the server, pass the parsed `Accept-Language` tags instead.

### Type-safe keys

Augment `Register` once and every key, dot path and placeholder is checked by the compiler — in this package and in `@sehv-oss/i18n-react` alike:

```typescript
// locales/en.ts
export default {
  greeting: 'Hello, {$name}!',
  home: { title: 'Home' },
} as const;
```

```typescript
// i18n.d.ts
import type en from './locales/en.ts';

declare module '@sehv-oss/i18n' {
  interface Register {
    messages: typeof en;
  }
}
```

```typescript
i18n.translate('home.title'); // ok
i18n.translate('greeting', { name: 'World' }); // ok

i18n.translate('greetng', { name: 'World' }); // error: unknown key
i18n.translate('home.subtitle'); // error: unknown path
i18n.translate('home'); // error: a group, not a message
i18n.translate('greeting'); // error: the message declares $name
i18n.translate('greeting', {}); // error: 'name' is missing
```

Without the augmentation nothing breaks — keys fall back to `string` and `values` to `Record<string, unknown>`.

Two things worth knowing:

- `typeof import('./en.json')` gives you checked **keys**, but TypeScript widens JSON string values to `string`, so **placeholder** checking needs a `.ts` module with `as const`.
- Placeholders are read from the message text: `{$count :number}` asks for `count` and `{$user.name}` asks for `user`. Names bound by `.local` are left out, since they never reach the caller.

### Formatters

```typescript
i18n.formatNumber(1234.56);
// → "1,234.56"

i18n.formatCurrency(99.9, 'USD');
// → "$99.90"

i18n.formatDate(new Date(), { dateStyle: 'long' });
// → "January 27, 2026"

i18n.formatList(['apple', 'banana', 'orange']);
// → "apple, banana, and orange"

i18n.formatRelativeTime(-2, 'days');
// → "2 days ago"

i18n.formatDisplayName('en-US', { type: 'language' });
// → "English (United States)"

i18n.formatDuration({ hours: 1, minutes: 30 });
// → "1 hr, 30 min"
```

### Lazy Loading

```typescript
await i18n.loadMessagesAsync('en', '/locales/en.json');
```

### Namespaces

`loadMessages` deep-merges, so one locale can be assembled from several files:

```typescript
i18n.loadMessages('en', { common: { ok: 'OK' } });
i18n.loadMessages('en', { checkout: { pay: 'Pay' } });

i18n.translate('common.ok'); // → "OK"
i18n.translate('checkout.pay'); // → "Pay"
```

Use `setMessages(locale, messages)` to replace a locale outright, and `removeMessages(locale)` to drop it.

### Custom Loader

```typescript
import { createI18n, type ILoader } from '@sehv-oss/i18n';
import YAML from 'yaml';

const yamlLoader: ILoader = {
  extensions: ['.yaml', '.yml'],
  parse(content) {
    return YAML.parse(content);
  },
};

const i18n = createI18n({
  locale: 'en',
  loaders: [yamlLoader],
});

await i18n.loadMessagesAsync('en', '/locales/en.yaml');
```

### Markup placeholders

A message can carry markup placeholders, and `translateToParts` returns them as parts instead of one flat string:

```typescript
const i18n = createI18n({
  locale: 'en',
  messages: { en: { terms: 'Accept the {#link}terms{/link}' } },
});

i18n.translateToParts('terms');
// [{ type: 'text', value: 'Accept the ' },
//  { type: 'markup', kind: 'open', name: 'link' },
//  { type: 'text', value: 'terms' },
//  { type: 'markup', kind: 'close', name: 'link' }]
```

Pair `'open'` and `'close'` parts by `name` to render them. In React, `@sehv-oss/i18n-react` does it for you through `useRichTranslate` and the `tags` prop of `<Translate>`.

### Custom Functions

Register MF2 function handlers and call them from messages:

```typescript
const i18n = createI18n({
  locale: 'en',
  functions: { shout: shoutHandler },
  messages: { en: { loud: 'He said {$word :shout}' } },
});

i18n.translate('loud', { word: 'hey' });
// → "He said HEY"
```

Handlers extend the `messageformat` draft functions. Pass `draftFunctions: false` to leave those out.

### Custom Parser

`parser` replaces the MessageFormat 2 parser entirely — one call per locale, result reused:

```typescript
const i18n = createI18n({
  locale: 'en',
  parser: (locale) => new MyParser(locale),
});
```

## API

### `createI18n(config)`

Creates an i18n instance.

| Option           | Description                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `locale`         | Current locale                                                                                                         |
| `fallbackLocale` | Locale, or locales in descending preference, to read from when a key is missing                                        |
| `messages`       | Messages per locale, flat or nested                                                                                    |
| `loaders`        | Extra loaders for `loadMessagesAsync`                                                                                  |
| `onError`        | `(error, key) => void`, called on parse or resolution failures. Silent when omitted                                    |
| `onMissingKey`   | `(key, locale) => string \| void`, called when a key resolves nowhere. Return a string to render it instead of the key |
| `bidiIsolation`  | `'auto'` (default), `'none'` or `'default'`. `'auto'` isolates placeholders only in right-to-left locales              |
| `functions`      | Custom MF2 function handlers, keyed by the name a message calls them with                                              |
| `draftFunctions` | Whether the `messageformat` draft functions are available. Defaults to `true`                                          |
| `parser`         | `(locale) => IParser`, replacing the built-in MessageFormat 2 parser                                                   |

### Methods

| Method                                      | Description                                 |
| ------------------------------------------- | ------------------------------------------- |
| `translate(key, values?)`                   | Translate a message key                     |
| `hasMessage(key)`                           | Whether a key resolves                      |
| `formatNumber(value, options?)`             | Format a number                             |
| `formatCurrency(value, currency, options?)` | Format currency                             |
| `formatDate(value, options?)`               | Format a date                               |
| `formatList(values, options?)`              | Format a list                               |
| `formatRelativeTime(value, unit, options?)` | Format relative time                        |
| `formatDisplayName(value, options)`         | Name a language, region, script or currency |
| `formatDuration(value, options?)`           | Format a duration                           |
| `loadMessages(locale, messages)`            | Load messages synchronously, deep-merging   |
| `setMessages(locale, messages)`             | Replace every message for a locale          |
| `removeMessages(locale)`                    | Drop a locale entirely                      |
| `loadMessagesAsync(locale, url)`            | Load messages via fetch                     |
| `setLocale(locale)`                         | Change current locale                       |
| `getLocales()`                              | Get available locales                       |
| `getLocaleChain()`                          | Get the resolution order                    |
| `getFallbackLocales()`                      | Get every fallback locale                   |
| `onLocaleChange(listener)`                  | Subscribe to locale changes                 |

## License

ISC
