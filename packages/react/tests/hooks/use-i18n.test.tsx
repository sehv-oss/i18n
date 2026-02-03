import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createI18n, I18nInstance } from '@sehv-oss/i18n';

import { useI18n } from '../../src/hooks/use-i18n.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should return i18n instance', async () => {
  const i18n = createI18n({ locale: 'en' });

  const { result } = await renderHook(() => useI18n(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    ),
  });

  expect(result.current).toBeInstanceOf(I18nInstance);
});
