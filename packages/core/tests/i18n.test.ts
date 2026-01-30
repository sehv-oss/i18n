import { describe, it, expect, beforeEach } from 'vitest';
import { createI18n, I18nInstance } from '../src/i18n.ts';

describe('createI18n', () => {
  it('should create an I18nInstance', () => {
    const i18n = createI18n({ locale: 'en' });

    expect(i18n).toBeInstanceOf(I18nInstance);
  });
});

describe('I18nInstance', () => {
  let i18n: I18nInstance;

  beforeEach(() => {
    i18n = createI18n({
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en: {
          greeting: 'Hello, {$name}!',
          simple: 'Simple message',
          onlyInEnglish: 'Only in English',
        },
      },
    });
  });

  describe('locale management', () => {
    it('should return the current locale', () => {
      const locale = i18n.getLocale();

      expect(locale).toBe('en');
    });

    it('should change the locale', () => {
      i18n.setLocale('fr');
      const locale = i18n.getLocale();

      expect(locale).toBe('fr');
    });

    it('should return the fallback locale', () => {
      const fallbackLocale = i18n.getFallbackLocale();

      expect(fallbackLocale).toBe('en');
    });

    it('should return available locales', () => {
      const locales = i18n.getLocales();

      expect(locales).toEqual(['en']);
    });
  });

  describe('translate', () => {
    it('should translate a simple key', () => {
      const result = i18n.translate('simple');

      expect(result).toBe('Simple message');
    });

    it('should translate with interpolation', () => {
      const result = i18n.translate('greeting', { name: 'World' });

      expect(result).toBe('Hello, World!');
    });

    it('should return key if not found', () => {
      const result = i18n.translate('nonexistent');

      expect(result).toBe('nonexistent');
    });

    it('should fallback to fallbackLocale', () => {
      i18n.setLocale('fr');
      const result = i18n.translate('onlyInEnglish');

      expect(result).toBe('Only in English');
    });
  });

  describe('loadMessages', () => {
    it('should load new messages', () => {
      i18n.loadMessages('en', { newKey: 'New value' });
      const result = i18n.translate('newKey');

      expect(result).toBe('New value');
    });
  });

  describe('formatters', () => {
    it('should format numbers', () => {
      const result = i18n.formatNumber(1234.56);

      expect(result).toBe('1,234.56');
    });

    it('should format currency', () => {
      const result = i18n.formatCurrency(99.9, 'USD');

      expect(result).toBe('$99.90');
    });

    it('should format dates', () => {
      const date = new Date(2000, 0, 1);
      const result = i18n.formatDate(date, { dateStyle: 'short' });

      expect(result).toBe('1/1/00');
    });

    it('should format lists', () => {
      const result = i18n.formatList(['a', 'b', 'c']);

      expect(result).toBe('a, b, and c');
    });

    it('should format relative time', () => {
      const result = i18n.formatRelativeTime(-2, 'days');

      expect(result).toBe('2 days ago');
    });
  });
});
