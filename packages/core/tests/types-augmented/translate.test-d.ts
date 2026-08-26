import { expectTypeOf, test } from 'vitest';
import { createI18n, type TranslationKey } from '@sehv-oss/i18n';

const messages = {
  greeting: 'Hello, {$name}!',
  home: {
    title: 'Home',
    items: `.input {$count :number}
.match $count
one {{You have {$count} item}}
*   {{You have {$count} items}}`,
  },
} as const;

declare module '@sehv-oss/i18n' {
  interface Register {
    messages: typeof messages;
  }
}

const i18n = createI18n({ locale: 'en', messages: { en: messages } });

test('should narrow the key type to the registered paths', () => {
  expectTypeOf<TranslationKey>().toEqualTypeOf<
    'greeting' | 'home.title' | 'home.items'
  >();
});

test('should accept every registered key', () => {
  expectTypeOf(i18n.translate('home.title')).toBeString();
  expectTypeOf(i18n.translate('greeting', { name: 'World' })).toBeString();
  expectTypeOf(i18n.translate('home.items', { count: 5 })).toBeString();
});

test('should reject keys that are not registered', () => {
  // @ts-expect-error misspelled key
  i18n.translate('greetng', { name: 'World' });

  // @ts-expect-error nested path that does not exist
  i18n.translate('home.subtitle');

  // @ts-expect-error 'home' is a group of messages, not a message
  i18n.translate('home');
});

test('should require the parameters declared by the message', () => {
  // @ts-expect-error the message declares $name
  i18n.translate('greeting');

  // @ts-expect-error 'name' is missing
  i18n.translate('greeting', {});

  // @ts-expect-error 'extra' is not declared by the message
  i18n.translate('greeting', { name: 'World', extra: 1 });
});

test('should leave values optional for a message without placeholders', () => {
  expectTypeOf(i18n.translate('home.title')).toBeString();
});
