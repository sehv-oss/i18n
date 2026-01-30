import { describe, it, expect, beforeEach } from 'vitest';
import { createI18n } from '../src/i18n.ts';
import type { I18n } from '../src/types.ts';

describe('createI18n', () => {
  let i18n: I18n;

  beforeEach(() => {
    i18n = createI18n({
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en: {
          greeting: 'Hello, {$name}!',
          nested: {
            key: 'Nested value',
          },
          onlyInEnglish: 'Only in English',
        },
      },
    });
  });

  describe('translate', () => {
    it('should translate a simple key', () => {
      expect(i18n.translate('greeting', { name: 'World' })).toBe(
        'Hello, World!'
      );
    });

    it('should translate nested keys', () => {
      expect(i18n.translate('nested.key')).toBe('Nested value');
    });

    it('should fallback to fallbackLocale', () => {
      expect(i18n.translate('onlyInEnglish')).toBe('Only in English');
    });

    it('should return key if not found', () => {
      expect(i18n.translate('nonexistent')).toBe('nonexistent');
    });
  });

  describe('setLocale', () => {
    it('should change the locale', () => {
      i18n.setLocale('en');
      expect(i18n.locale).toBe('en');
      expect(i18n.translate('greeting', { name: 'John' })).toBe('Hello, John!');
    });
  });

  describe('getLocales', () => {
    it('should return available locales', () => {
      expect(i18n.getLocales()).toEqual(['en']);
    });
  });

  describe('loadMessages', () => {
    it('should load new messages', () => {
      i18n.loadMessages('en', { newKey: 'New value' });
      expect(i18n.translate('newKey')).toBe('New value');
    });

    it('should merge with existing messages', () => {
      i18n.loadMessages('en', { newKey: 'New value' });
      expect(i18n.translate('greeting', { name: 'Test' })).toBe('Hello, Test!');
    });
  });
});

describe('formatters', () => {
  let i18n: I18n;

  beforeEach(() => {
    i18n = createI18n({ locale: 'en' });
  });

  describe('formatNumber', () => {
    it('should format numbers', () => {
      expect(i18n.formatNumber(1234.56)).toBe('1,234.56');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency', () => {
      const result = i18n.formatCurrency(99.9, 'USD');
      expect(result).toContain('99.90');
      expect(result).toContain('$');
    });
  });

  describe('formatDate', () => {
    it('should format dates', () => {
      const date = new Date(2026, 0, 27);
      const result = i18n.formatDate(date, { dateStyle: 'short' });
      expect(result).toMatch(/27/);
    });
  });

  describe('formatList', () => {
    it('should format lists', () => {
      const result = i18n.formatList(['a', 'b', 'c']);
      expect(result).toBe('a, b, and c');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time', () => {
      const result = i18n.formatRelativeTime(-2, 'days');
      expect(result).toContain('2');
      expect(result.toLowerCase()).toContain('day');
    });
  });
});
