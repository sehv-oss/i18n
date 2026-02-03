import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useFormatNumber } from '../../src/hooks/use-format-number.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should format number with default options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatNumber(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(1234567.89);

  expect(formatted).toBe('1,234,567.89');
});

test('should format number with options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatNumber(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(1234567.89, { maximumFractionDigits: 0 });

  expect(formatted).toBe('1,234,568');
});

test('should format number in different locale', async () => {
  const i18n = createI18n({ locale: 'de' });

  const { result } = await renderHook(() => useFormatNumber(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(1234567.89);

  expect(formatted).toBe('1.234.567,89');
});
