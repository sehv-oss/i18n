import { expect, test } from 'vitest';
import { getTextDirection } from '../../src/locales/direction.ts';

test('should report ltr for left-to-right locales', () => {
  expect(getTextDirection('en')).toBe('ltr');
  expect(getTextDirection('pt-BR')).toBe('ltr');
  expect(getTextDirection('ja')).toBe('ltr');
});

test('should report rtl for right-to-left locales', () => {
  expect(getTextDirection('ar')).toBe('rtl');
  expect(getTextDirection('he-IL')).toBe('rtl');
  expect(getTextDirection('fa')).toBe('rtl');
});

test('should fall back to ltr for an unparseable tag', () => {
  expect(getTextDirection('not a locale')).toBe('ltr');
});
