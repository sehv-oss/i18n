import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { FormatNumber } from '../../src/components/format-number.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should render formatted number with default options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatNumber value={1234567.89} />
    </I18nProvider>
  );

  const textElement = screen.getByText('1,234,567.89');

  expect(textElement).toBeInTheDocument();
});

test('should render formatted number with options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatNumber value={1234567.89} maximumFractionDigits={0} />
    </I18nProvider>
  );

  const textElement = screen.getByText('1,234,568');

  expect(textElement).toBeInTheDocument();
});

test('should render formatted number in different locale', async () => {
  const i18n = createI18n({ locale: 'de' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatNumber value={1234567.89} />
    </I18nProvider>
  );

  const textElement = screen.getByText('1.234.567,89');

  expect(textElement).toBeInTheDocument();
});
