import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useTranslate } from '../../src/hooks/use-translate.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should return translate function', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: { greeting: 'Hello' },
    },
  });

  const { result } = await renderHook(() => useTranslate(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const translated = result.current('greeting');

  expect(translated).toBe('Hello');
});

test('should translate with interpolation', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: { greeting: 'Hello, {$name}!' },
    },
  });

  const { result } = await renderHook(() => useTranslate(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const translated = result.current('greeting', { name: 'World' });

  expect(translated).toBe('Hello, World!');
});

test('should return key when translation not found', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useTranslate(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const translated = result.current('nonexistent.key');

  expect(translated).toBe('nonexistent.key');
});
