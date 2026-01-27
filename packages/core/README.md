# @sehv-oss/i18n

Core i18n library for JavaScript.

## Installation

```bash
pnpm add @sehv-oss/i18n
```

## Usage

### Basic

```typescript
import { createI18n } from '@sehv-oss/i18n';

const i18n = createI18n({
  locale: 'pt-BR',
  fallbackLocale: 'en',
  messages: {
    'pt-BR': {
      greeting: 'Olá, {$name}!',
      items: `.match {$count :number}
one {{Você tem {$count} item}}
*   {{Você tem {$count} itens}}`,
    },
    en: {
      greeting: 'Hello, {$name}!',
    },
  },
});

i18n.translate('greeting', { name: 'Maria' });
// → "Olá, Maria!"

i18n.translate('items', { count: 5 });
// → "Você tem 5 itens"
```

### Formatters

```typescript
i18n.formatNumber(1234.56);
// → "1.234,56"

i18n.formatCurrency(99.9, 'BRL');
// → "R$ 99,90"

i18n.formatDate(new Date(), { dateStyle: 'long' });
// → "27 de janeiro de 2026"

i18n.formatList(['maçã', 'banana', 'laranja']);
// → "maçã, banana e laranja"

i18n.formatRelativeTime(-2, 'days');
// → "há 2 dias"
```

### Lazy Loading

```typescript
await i18n.loadMessagesAsync('/locales/pt-BR.json');
```

### Custom Loader

```typescript
import { createI18n } from '@sehv-oss/i18n';
import type { MessageLoader } from '@sehv-oss/i18n/loaders';
import YAML from 'yaml';

const yamlLoader: MessageLoader = {
  extensions: ['.yaml', '.yml'],
  parse(content) {
    return YAML.parse(content);
  },
};

const i18n = createI18n({
  locale: 'pt-BR',
  loaders: [yamlLoader],
});

await i18n.loadMessagesAsync('/locales/pt-BR.yaml');
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
| `registerLoader(loader)`                    | Register a custom loader    |
| `setLocale(locale)`                         | Change current locale       |
| `getLocales()`                              | Get available locales       |

## License

MIT
