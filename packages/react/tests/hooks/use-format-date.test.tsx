import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useFormatDate } from '../../src/hooks/use-format-date.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should format date with default options', async () => {
  const i18n = createI18n({ locale: 'en' });
  const date = new Date(2000, 0, 1);

  const { result } = await renderHook(() => useFormatDate(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(date);

  expect(formatted).toBe('1/1/2000');
});

test('should format date with dateStyle option', async () => {
  const i18n = createI18n({ locale: 'en' });
  const date = new Date(2000, 0, 1);

  const { result } = await renderHook(() => useFormatDate(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(date, { dateStyle: 'long' });

  expect(formatted).toBe('January 1, 2000');
});

test('should format timestamp', async () => {
  const i18n = createI18n({ locale: 'en' });
  const timestamp = new Date(2000, 0, 1).getTime();

  const { result } = await renderHook(() => useFormatDate(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(timestamp);

  expect(formatted).toBe('1/1/2000');
});
