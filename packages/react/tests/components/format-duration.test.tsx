import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { FormatDuration } from '../../src/components/format-duration.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should render a formatted duration', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatDuration value={{ hours: 1, minutes: 30 }} style="long" />
    </I18nProvider>
  );

  const textElement = screen.getByText('1 hora e 30 minutos');

  expect(textElement).toBeInTheDocument();
});

test('should render a formatted duration in the digital style', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatDuration
        value={{ hours: 1, minutes: 30, seconds: 5 }}
        style="digital"
      />
    </I18nProvider>
  );

  const textElement = screen.getByText('1:30:05');

  expect(textElement).toBeInTheDocument();
});
