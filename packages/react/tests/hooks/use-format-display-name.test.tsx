import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useFormatDisplayName } from '../../src/hooks/use-format-display-name.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should name a language in the current locale', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const { result } = await renderHook(() => useFormatDisplayName(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  expect(result.current('en-US', { type: 'language' })).toBe(
    'inglês (Estados Unidos)'
  );
});

test('should name a region in the current locale', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const { result } = await renderHook(() => useFormatDisplayName(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  expect(result.current('BR', { type: 'region' })).toBe('Brasil');
});
