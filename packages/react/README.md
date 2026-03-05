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

## API

### Provider

- `I18nProvider` — Provides i18n context to children

### Hooks

| Hook                      | Returns                                     |
| ------------------------- | ------------------------------------------- |
| `useI18n()`               | i18n instance                               |
| `useLocale()`             | `[locale, setLocale]`                       |
| `useTranslate()`          | `translate(key, values?)`                   |
| `useFormatNumber()`       | `formatNumber(value, options?)`             |
| `useFormatCurrency()`     | `formatCurrency(value, currency, options?)` |
| `useFormatDate()`         | `formatDate(value, options?)`               |
| `useFormatList()`         | `formatList(values, options?)`              |
| `useFormatRelativeTime()` | `formatRelativeTime(value, unit, options?)` |

### Components

| Component            | Props                             |
| -------------------- | --------------------------------- |
| `Translate`          | `id`, `values?`                   |
| `FormatNumber`       | `value`, `...options`             |
| `FormatCurrency`     | `value`, `currency`, `...options` |
| `FormatDate`         | `value`, `...options`             |
| `FormatList`         | `values`, `...options`            |
| `FormatRelativeTime` | `value`, `unit`, `...options`     |

## License

ISC
