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

test('should return cached translation on second call', () => {
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
