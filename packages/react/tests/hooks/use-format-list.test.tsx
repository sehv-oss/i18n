import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useFormatList } from '../../src/hooks/use-format-list.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should format list with default options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatList(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(['Apple', 'Banana', 'Orange']);

  expect(formatted).toBe('Apple, Banana, and Orange');
});

test('should format list with conjunction type', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatList(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(['Apple', 'Banana'], {
    type: 'disjunction',
  });

  expect(formatted).toBe('Apple or Banana');
});

test('should format list in different locale', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const { result } = await renderHook(() => useFormatList(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(['Maçã', 'Banana', 'Laranja']);

  expect(formatted).toBe('Maçã, Banana e Laranja');
});
