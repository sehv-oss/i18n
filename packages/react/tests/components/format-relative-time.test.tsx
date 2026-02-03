import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { FormatRelativeTime } from '../../src/components/format-relative-time.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should render relative time in days', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatRelativeTime value={-1} unit="day" />
    </I18nProvider>
  );

  const textElement = screen.getByText('1 day ago');

  expect(textElement).toBeInTheDocument();
});

test('should render relative time in future', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatRelativeTime value={2} unit="week" />
    </I18nProvider>
  );

  const textElement = screen.getByText('in 2 weeks');

  expect(textElement).toBeInTheDocument();
});

test('should render relative time in different locale', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatRelativeTime value={-1} unit="day" />
    </I18nProvider>
  );

  const textElement = screen.getByText('há 1 dia');

  expect(textElement).toBeInTheDocument();
});
