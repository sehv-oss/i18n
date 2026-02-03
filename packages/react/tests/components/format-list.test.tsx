import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { FormatList } from '../../src/components/format-list.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should render formatted list with default options', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatList values={['Apple', 'Banana', 'Orange']} />
    </I18nProvider>
  );

  const textElement = screen.getByText('Apple, Banana, and Orange');

  expect(textElement).toBeInTheDocument();
});

test('should render formatted list with disjunction type', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatList values={['Apple', 'Banana']} type="disjunction" />
    </I18nProvider>
  );

  const textElement = screen.getByText('Apple or Banana');

  expect(textElement).toBeInTheDocument();
});

test('should render formatted list in different locale', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatList values={['Maçã', 'Banana', 'Laranja']} />
    </I18nProvider>
  );

  const textElement = screen.getByText('Maçã, Banana e Laranja');

  expect(textElement).toBeInTheDocument();
});
