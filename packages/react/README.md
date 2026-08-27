# @sehv-oss/i18n-react

React bindings for @sehv-oss/i18n.

## Installation

```bash
# npm
npm install @sehv-oss/i18n @sehv-oss/i18n-react

# yarn
yarn add @sehv-oss/i18n @sehv-oss/i18n-react

# pnpm
pnpm add @sehv-oss/i18n @sehv-oss/i18n-react
```

## Usage

### Setup

```tsx
import { createI18n } from '@sehv-oss/i18n';
import { I18nProvider } from '@sehv-oss/i18n-react';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      greeting: 'Hello, {$name}!',
    },
  },
});

function App() {
  return (
    <I18nProvider i18n={i18n}>
      <MyComponent />
    </I18nProvider>
  );
}
```

### Hooks

```tsx
import {
  useTranslate,
  useLocale,
  useFormatNumber,
  useFormatCurrency,
  useFormatDate,
} from '@sehv-oss/i18n-react';

function MyComponent() {
  const translate = useTranslate();
  const [locale, setLocale] = useLocale();
  const formatNumber = useFormatNumber();
  const formatCurrency = useFormatCurrency();
  const formatDate = useFormatDate();

  return (
    <div>
      <p>{translate('greeting', { name: 'World' })}</p>
      <p>{formatNumber(1234.56)}</p>
      <p>{formatCurrency(99.9, 'BRL')}</p>
      <p>{formatDate(new Date(), { dateStyle: 'long' })}</p>
      <button onClick={() => setLocale('en')}>English</button>
    </div>
  );
}
```

### Components

```tsx
import {
  Translate,
  FormatNumber,
  FormatCurrency,
  FormatDate,
  FormatList,
  FormatRelativeTime,
} from '@sehv-oss/i18n-react';

function MyComponent() {
  return (
    <div>
      <Translate id="greeting" values={{ name: 'World' }} />
      <FormatNumber value={1234.56} />
      <FormatCurrency value={99.9} currency="BRL" />
      <FormatDate value={new Date()} dateStyle="long" />
      <FormatList values={['a', 'b', 'c']} />
      <FormatRelativeTime value={-2} unit="days" />
    </div>
  );
}
```

### Rich text

A message can carry markup placeholders, and `tags` turns them into elements:

```tsx
// en.ts → { terms: 'Accept the {#link}terms{/link}' }

<Translate
  id="terms"
  tags={{ link: (chunks) => <a href="/terms">{chunks}</a> }}
/>
// → Accept the <a href="/terms">terms</a>
```

`useRichTranslate` is the hook form:

```tsx
const richTranslate = useRichTranslate();

richTranslate('terms', undefined, {
  link: (chunks) => <a href="/terms">{chunks}</a>,
});
```

A placeholder with no matching entry in `tags` still renders its text, so a missing renderer degrades instead of dropping content.

### Server rendering

`I18nInstance` is mutable — `setLocale` changes it for everyone holding it. On a server that means
**one instance per request**, never a module-level singleton:

```tsx
// ✗ leaks the last request's locale into the next one
const i18n = createI18n({ locale: 'en', messages });

// ✓ one per request
export function handler(request: Request) {
  const i18n = createI18n({ locale: localeFrom(request), messages });

  return renderToString(
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  );
}
```

A module-level instance is fine in the browser, where there is only ever one user.

`I18nProvider` reads its locale through `useSyncExternalStore` with a server snapshot, so the markup
the server produces and the markup the client hydrates agree as long as both build the instance with
the same locale.

### Type-safe keys

Augment `Register` once — in the core package — and the hooks and components pick it up on their own. There is no generic to thread, no factory to call and nothing extra to pass to the provider:

```typescript
// i18n.d.ts
import type en from './locales/en.ts';

declare module '@sehv-oss/i18n' {
  interface Register {
    messages: typeof en;
  }
}
```

```tsx
const translate = useTranslate();

translate('home.title'); // ok
translate('greeting', { name: 'World' }); // ok
translate('greetng', { name: 'World' }); // error: unknown key
translate('greeting'); // error: the message declares $name

<Translate id="home.title" />; // ok
<Translate id="greeting" values={{ name: 'World' }} />; // ok
<Translate id="greeting" />; // error: values is required
```

See the [core README](../core/README.md#type-safe-keys) for how the message shape is declared.

## API

### Provider

- `I18nProvider` — Provides i18n context to children

### Hooks

| Hook                      | Returns                                     |
| ------------------------- | ------------------------------------------- |
| `useI18n()`               | i18n instance                               |
| `useLocale()`             | `[locale, setLocale]`                       |
| `useTranslate()`          | `translate(key, values?)`                   |
| `useRichTranslate()`      | `richTranslate(key, values?, tags?)`        |
| `useFormatNumber()`       | `formatNumber(value, options?)`             |
| `useFormatCurrency()`     | `formatCurrency(value, currency, options?)` |
| `useFormatDate()`         | `formatDate(value, options?)`               |
| `useFormatList()`         | `formatList(values, options?)`              |
| `useFormatRelativeTime()` | `formatRelativeTime(value, unit, options?)` |

### Components

| Component            | Props                             |
| -------------------- | --------------------------------- |
| `Translate`          | `id`, `values?`, `tags?`          |
| `FormatNumber`       | `value`, `...options`             |
| `FormatCurrency`     | `value`, `currency`, `...options` |
| `FormatDate`         | `value`, `...options`             |
| `FormatList`         | `values`, `...options`            |
| `FormatRelativeTime` | `value`, `unit`, `...options`     |

## License

ISC
