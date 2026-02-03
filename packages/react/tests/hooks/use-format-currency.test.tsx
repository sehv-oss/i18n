import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useFormatCurrency } from '../../src/hooks/use-format-currency.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should format currency with USD', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatCurrency(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(99.9, 'USD');

  expect(formatted).toBe('$99.90');
});

test('should format currency with EUR', async () => {
  const i18n = createI18n({ locale: 'de' });

  const { result } = await renderHook(() => useFormatCurrency(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(99.9, 'EUR');

  expect(formatted).toBe('99,90 €');
});

test('should format currency with options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatCurrency(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  const formatted = result.current(99.9, 'USD', { maximumFractionDigits: 0 });

  expect(formatted).toBe('$100');
});
