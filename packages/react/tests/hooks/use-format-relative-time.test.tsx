import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useFormatRelativeTime } from '../../src/hooks/use-format-relative-time.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should format relative time in days', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatRelativeTime(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(-1, 'day');

  expect(formatted).toBe('1 day ago');
});

test('should format relative time in future', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatRelativeTime(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(2, 'week');

  expect(formatted).toBe('in 2 weeks');
});

test('should format relative time in different locale', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const { result } = await renderHook(() => useFormatRelativeTime(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(-1, 'day');

  expect(formatted).toBe('há 1 dia');
});
