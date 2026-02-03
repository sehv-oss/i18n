import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { FormatDate } from '../../src/components/format-date.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should render formatted date with default options', async () => {
  const i18n = createI18n({ locale: 'en' });
  const date = new Date(2000, 0, 1);

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatDate value={date} />
    </I18nProvider>
  );

  const textElement = screen.getByText('1/1/2000');

  expect(textElement).toBeInTheDocument();
});

test('should render formatted date with dateStyle option', async () => {
  const i18n = createI18n({ locale: 'en' });
  const date = new Date(2000, 0, 1);

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatDate value={date} dateStyle="long" />
    </I18nProvider>
  );

  const textElement = screen.getByText('January 1, 2000');

  expect(textElement).toBeInTheDocument();
});

test('should render formatted timestamp', async () => {
  const i18n = createI18n({ locale: 'en' });
  const timestamp = new Date(2000, 0, 1).getTime();

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatDate value={timestamp} />
    </I18nProvider>
  );

  const textElement = screen.getByText('1/1/2000');

  expect(textElement).toBeInTheDocument();
});
