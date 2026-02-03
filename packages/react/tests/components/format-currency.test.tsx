import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { FormatCurrency } from '../../src/components/format-currency.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should render formatted currency with USD', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatCurrency value={99.9} currency="USD" />
    </I18nProvider>
  );

  const textElement = screen.getByText('$99.90');

  expect(textElement).toBeInTheDocument();
});

test('should render formatted currency with EUR', async () => {
  const i18n = createI18n({ locale: 'de' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatCurrency value={99.9} currency="EUR" />
    </I18nProvider>
  );

  const textElement = screen.getByText('99,90 €');

  expect(textElement).toBeInTheDocument();
});

test('should render formatted currency with options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatCurrency value={99.9} currency="USD" maximumFractionDigits={0} />
    </I18nProvider>
  );

  const textElement = screen.getByText('$100');

  expect(textElement).toBeInTheDocument();
});
