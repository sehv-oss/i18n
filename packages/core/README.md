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
      items: `.match {$count :number}
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
```

### Lazy Loading

```typescript
await i18n.loadMessagesAsync('/locales/en.json');
```

### Custom Loader

```typescript
import { createI18n } from '@sehv-oss/i18n';
import type { ILoader } from '@sehv-oss/i18n';
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

await i18n.loadMessagesAsync('/locales/en.yaml');
```

## API

### `createI18n(config)`

Creates an i18n instance.

### Methods

| Method                                      | Description                 |
| ------------------------------------------- | --------------------------- |
| `translate(key, values?)`                   | Translate a message key     |
| `formatNumber(value, options?)`             | Format a number             |
| `formatCurrency(value, currency, options?)` | Format currency             |
| `formatDate(value, options?)`               | Format a date               |
| `formatList(values, options?)`              | Format a list               |
| `formatRelativeTime(value, unit, options?)` | Format relative time        |
| `loadMessages(locale, messages)`            | Load messages synchronously |
| `loadMessagesAsync(url)`                    | Load messages via fetch     |
| `setLocale(locale)`                         | Change current locale       |
| `getLocales()`                              | Get available locales       |
| `onLocaleChange(listener)`                  | Subscribe to locale changes |

## License

MIT
