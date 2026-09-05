import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useFormatDuration } from '../../src/hooks/use-format-duration.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should format a duration in the current locale', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const { result } = await renderHook(() => useFormatDuration(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  expect(result.current({ hours: 1, minutes: 30 }, { style: 'long' })).toBe(
    '1 hora e 30 minutos'
  );
});

test('should format a duration with no options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useFormatDuration(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  expect(result.current({ minutes: 5 })).toContain('5');
});
