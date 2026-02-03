import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { Translate } from '../../src/components/translate.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should render translated text', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: { greeting: 'Hello' },
    },
  });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <Translate id="greeting" />
    </I18nProvider>
  );

  const textElement = screen.getByText('Hello');

  expect(textElement).toBeInTheDocument();
});

test('should render translated text with interpolation', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: { greeting: 'Hello, {$name}!' },
    },
  });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <Translate id="greeting" values={{ name: 'World' }} />
    </I18nProvider>
  );

  const textElement = screen.getByText('Hello, World!');

  expect(textElement).toBeInTheDocument();
});

test('should render key when translation not found', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <Translate id="nonexistent.key" />
    </I18nProvider>
  );

  const textElement = screen.getByText('nonexistent.key');

  expect(textElement).toBeInTheDocument();
});
