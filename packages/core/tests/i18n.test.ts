import { expect, vi, test } from 'vitest';
import { createI18n, I18nInstance } from '../src/i18n.ts';

test('should create an default I18nInstance', () => {
  const i18n = createI18n({ locale: 'en' });

  expect(i18n).toBeInstanceOf(I18nInstance);
  expect(i18n.getFallbackLocale()).toBeUndefined();
  expect(i18n.getLocales()).toEqual([]);
});

test('should return the current locale', () => {
  const i18n = createI18n({ locale: 'en' });

  const locale = i18n.getLocale();

  expect(locale).toBe('en');
});

test('should change the locale', () => {
  const i18n = createI18n({ locale: 'en' });

  i18n.setLocale('fr');
  const locale = i18n.getLocale();

  expect(locale).toBe('fr');
});

test('should return the fallback locale', () => {
  const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
  });

  const fallbackLocale = i18n.getFallbackLocale();

  expect(fallbackLocale).toBe('en');
});

test('should return available locales', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        greeting: 'Hello, {$name}!',
      },
    },
  });

  const locales = i18n.getLocales();

  expect(locales).toEqual(['en']);
});

test('should translate a simple key', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        simple: 'Simple message',
      },
    },
  });

  const result = i18n.translate('simple');

  expect(result).toBe('Simple message');
});

test('should return the same translation on repeated calls', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        cached: 'Cached message',
      },
    },
  });

  const result1 = i18n.translate('cached');
  const result2 = i18n.translate('cached');

  expect(result1).toBe('Cached message');
  expect(result2).toBe('Cached message');
});

test('should translate with interpolation', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        greeting: 'Hello, {$name}!',
      },
    },
  });

  const result = i18n.translate('greeting', { name: 'World' });

  expect(result).toBe('Hello, World!');
});

test('should return key if not found', () => {
  const i18n = createI18n({ locale: 'en' });

  const result = i18n.translate('nonexistent');

  expect(result).toBe('nonexistent');
});

test('should return key if not found and no fallbackLocale', () => {
  const i18n = createI18n({
    locale: 'fr',
    messages: { en: { test: 'Test' } },
  });

  const result = i18n.translate('test');

  expect(result).toBe('test');
});

test('should fallback to fallbackLocale', () => {
  const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'en',
    messages: { en: { test: 'Test' } },
  });

  const result = i18n.translate('test');

  expect(result).toBe('Test');
});

test('should load new messages', () => {
  const i18n = createI18n({ locale: 'en' });

  const before = i18n.translate('newKey');
  i18n.loadMessages('en', { newKey: 'New value' });
  const after = i18n.translate('newKey');

  expect(before).toBe('newKey');
  expect(after).toBe('New value');
});

test('should load new messages in fallback locale', () => {
  const i18n = createI18n({ locale: 'en', fallbackLocale: 'pt' });

  const before = i18n.translate('newKey');
  i18n.loadMessages('pt', { newKey: 'New value' });
  const after = i18n.translate('newKey');

  expect(before).toBe('newKey');
  expect(after).toBe('New value');
});

test('should load messages from a URL', async () => {
  const fetchSpy = vi.spyOn(global, 'fetch');
  const i18n = createI18n({ locale: 'en' });

  fetchSpy.mockResolvedValue({
    ok: true,
    text: async () => '{"asyncKey": "Async value"}',
  } as Response);

  await i18n.loadMessagesAsync('/locales/fr.json');
  i18n.setLocale('fr');
  const result = i18n.translate('asyncKey');

  expect(result).toBe('Async value');
});

test('should throw error when response is not ok', async () => {
  const fetchSpy = vi.spyOn(global, 'fetch');
  const i18n = createI18n({ locale: 'en' });

  fetchSpy.mockResolvedValue({
    ok: false,
    statusText: 'Not Found',
  } as Response);

  await expect(i18n.loadMessagesAsync('/locales/missing.json')).rejects.toThrow(
    'Failed to load messages from /locales/missing.json: Not Found.'
  );
});

test('should throw error when no loader is found', async () => {
  const fetchSpy = vi.spyOn(global, 'fetch');
  const i18n = createI18n({ locale: 'en' });

  fetchSpy.mockResolvedValue({
    ok: true,
    text: async () => 'content',
  } as Response);

  await expect(i18n.loadMessagesAsync('/locales/en.unknown')).rejects.toThrow(
    'No loader found for /locales/en.unknown.'
  );
});

test('should extract locale from URL with country code', async () => {
  const fetchSpy = vi.spyOn(global, 'fetch');
  const i18n = createI18n({ locale: 'en' });

  fetchSpy.mockResolvedValue({
    ok: true,
    text: async () => '{"test": "Test"}',
  } as Response);

  await i18n.loadMessagesAsync('/locales/pt-BR.json');
  const locales = i18n.getLocales();

  expect(locales).toEqual(['pt-BR']);
});

test('should use current locale when cannot extract from URL', async () => {
  const fetchSpy = vi.spyOn(global, 'fetch');
  const i18n = createI18n({ locale: 'en' });

  fetchSpy.mockResolvedValue({
    ok: true,
    text: async () => '{"test": "Test"}',
  } as Response);

  await i18n.loadMessagesAsync('/locales/123-invalid.json');
  const locales = i18n.getLocales();

  expect(locales).toEqual(['en']);
});

test('should format numbers', () => {
  const i18n = createI18n({ locale: 'en' });

  const result = i18n.formatNumber(1234.56);

  expect(result).toBe('1,234.56');
});

test('should format currency', () => {
  const i18n = createI18n({ locale: 'en' });

  const result = i18n.formatCurrency(99.9, 'USD');

  expect(result).toBe('$99.90');
});

test('should format dates', () => {
  const i18n = createI18n({ locale: 'en' });

  const date = new Date(2000, 0, 1);
  const result = i18n.formatDate(date, { dateStyle: 'short' });

  expect(result).toBe('1/1/00');
});

test('should format lists', () => {
  const i18n = createI18n({ locale: 'en' });

  const result = i18n.formatList(['a', 'b', 'c']);

  expect(result).toBe('a, b, and c');
});

test('should format relative time', () => {
  const i18n = createI18n({ locale: 'en' });

  const result = i18n.formatRelativeTime(-2, 'days');

  expect(result).toBe('2 days ago');
});

test('should translate a nested key by dot path', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        home: { title: 'Home', nav: { back: 'Back' } },
      },
    },
  });

  expect(i18n.translate('home.title')).toBe('Home');
  expect(i18n.translate('home.nav.back')).toBe('Back');
});

test('should pluralize through MessageFormat 2', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        items: `.input {$count :number}
.match $count
one {{You have {$count} item}}
*   {{You have {$count} items}}`,
      },
    },
  });

  expect(i18n.translate('items', { count: 1 })).toBe('You have 1 item');
  expect(i18n.translate('items', { count: 5 })).toBe('You have 5 items');
});

test('should re-translate after a locale change', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: { greeting: 'Hello, {$name}!' },
      pt: { greeting: 'Olá, {$name}!' },
    },
  });

  const before = i18n.translate('greeting', { name: 'World' });
  i18n.setLocale('pt');
  const after = i18n.translate('greeting', { name: 'World' });

  expect(before).toBe('Hello, World!');
  expect(after).toBe('Olá, World!');
});

test('should report formatting errors through the configured handler', () => {
  const onError = vi.fn();
  const i18n = createI18n({
    locale: 'en',
    messages: { en: { greeting: 'Hello, {$name}!' } },
    onError,
  });

  const result = i18n.translate('greeting');

  expect(result).toBe('Hello, {$name}!');
  expect(onError).toHaveBeenCalledOnce();
  expect(onError.mock.calls[0]?.[1]).toBe('greeting');
});

test('should isolate placeholders when bidiIsolation is default', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: { en: { greeting: 'Hello, {$name}!' } },
    bidiIsolation: 'default',
  });

  const result = i18n.translate('greeting', { name: 'World' });

  expect(result).toBe('Hello, ⁨World⁩!');
});

test('should fall back from a regional locale to its parent', () => {
  const i18n = createI18n({ locale: 'pt-BR', messages: { pt: { a: 'PT A' } } });

  expect(i18n.translate('a')).toBe('PT A');
});

test('should prefer the more specific locale in the chain', () => {
  const i18n = createI18n({
    locale: 'pt-BR',
    messages: { pt: { a: 'PT A' }, 'pt-BR': { a: 'PT-BR A' } },
  });

  expect(i18n.translate('a')).toBe('PT-BR A');
});

test('should walk every configured fallback locale in order', () => {
  const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: ['es', 'en'],
    messages: { es: { a: 'ES A' }, en: { a: 'EN A', b: 'EN B' } },
  });

  expect(i18n.translate('a')).toBe('ES A');
  expect(i18n.translate('b')).toBe('EN B');
});

test('should expose the resolution chain', () => {
  const i18n = createI18n({ locale: 'pt-BR', fallbackLocale: 'en-US' });

  expect(i18n.getLocaleChain()).toEqual(['pt-BR', 'pt', 'en-US', 'en']);
});

test('should keep getFallbackLocale returning the first fallback', () => {
  const i18n = createI18n({ locale: 'fr', fallbackLocale: ['es', 'en'] });

  expect(i18n.getFallbackLocale()).toBe('es');
  expect(i18n.getFallbackLocales()).toEqual(['es', 'en']);
});

test('should report a missing key to onMissingKey', () => {
  const onMissingKey = vi.fn();
  const i18n = createI18n({ locale: 'en', messages: { en: {} }, onMissingKey });

  const result = i18n.translate('nope');

  expect(onMissingKey).toHaveBeenCalledWith('nope', 'en');
  expect(result).toBe('nope');
});

test('should use the string returned by onMissingKey', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: { en: {} },
    onMissingKey: () => '',
  });

  expect(i18n.translate('nope')).toBe('');
});

test('should not call onMissingKey when a fallback locale resolves the key', () => {
  const onMissingKey = vi.fn();
  const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'en',
    messages: { en: { a: 'EN A' } },
    onMissingKey,
  });

  expect(i18n.translate('a')).toBe('EN A');
  expect(onMissingKey).not.toHaveBeenCalled();
});

test('should report whether a key resolves', () => {
  const i18n = createI18n({
    locale: 'pt-BR',
    messages: { pt: { home: { title: 'Início' } } },
  });

  expect(i18n.hasMessage('home.title')).toBe(true);
  expect(i18n.hasMessage('home.subtitle')).toBe(false);
});

test('should merge messages into an existing locale', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: { en: { common: { ok: 'OK' } } },
  });

  i18n.loadMessages('en', { checkout: { pay: 'Pay' } });

  expect(i18n.translate('common.ok')).toBe('OK');
  expect(i18n.translate('checkout.pay')).toBe('Pay');
});

test('should replace a locale with setMessages', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: { en: { common: { ok: 'OK' } } },
  });

  i18n.setMessages('en', { checkout: { pay: 'Pay' } });

  expect(i18n.translate('common.ok')).toBe('common.ok');
  expect(i18n.translate('checkout.pay')).toBe('Pay');
});

test('should drop a locale with removeMessages', () => {
  const i18n = createI18n({ locale: 'en', messages: { en: { a: 'A' } } });

  i18n.removeMessages('en');

  expect(i18n.getLocales()).toEqual([]);
  expect(i18n.translate('a')).toBe('a');
});
