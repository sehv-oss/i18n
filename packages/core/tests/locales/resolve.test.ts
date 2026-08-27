import { expect, test } from 'vitest';
import { expandLocale, resolveLocale } from '../../src/locales/resolve.ts';

test('should expand a tag into itself and every parent', () => {
  expect(expandLocale('pt-BR')).toEqual(['pt-BR', 'pt']);
  expect(expandLocale('zh-Hant-TW')).toEqual(['zh-Hant-TW', 'zh-Hant', 'zh']);
  expect(expandLocale('en')).toEqual(['en']);
});

test('should skip truncations ending on an extension singleton', () => {
  expect(expandLocale('pt-BR-x-legacy')).toEqual([
    'pt-BR-x-legacy',
    'pt-BR',
    'pt',
  ]);
});

test('should resolve an exact match', () => {
  expect(resolveLocale('pt-BR', ['en', 'pt-BR'])).toBe('pt-BR');
});

test('should resolve a regional tag to its available parent', () => {
  expect(resolveLocale('pt-BR', ['en', 'pt'])).toBe('pt');
});

test('should try each requested locale in order', () => {
  expect(resolveLocale(['de', 'fr-CA', 'en'], ['en', 'fr'])).toBe('fr');
});

test('should match case-insensitively but return the available spelling', () => {
  expect(resolveLocale('PT-br', ['pt-BR'])).toBe('pt-BR');
});

test('should return undefined when nothing matches', () => {
  expect(resolveLocale('ja', ['en', 'pt'])).toBeUndefined();
});
