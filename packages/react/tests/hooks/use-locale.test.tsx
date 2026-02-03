import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useLocale } from '../../src/hooks/use-locale.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should return current locale', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useLocale(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const [locale] = result.current;

  expect(locale).toBe('en');
});

test('should change locale', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result, act } = await renderHook(() => useLocale(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  act(() => {
    const [, setLocale] = result.current;
    setLocale('pt-BR');
  });

  const [locale] = result.current;

  expect(locale).toBe('pt-BR');
});
