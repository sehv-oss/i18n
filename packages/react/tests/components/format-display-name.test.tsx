import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { FormatDisplayName } from '../../src/components/format-display-name.ts';
import { I18nProvider } from '../../src/provider.tsx';

test('should render the name of a language', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatDisplayName value="en-US" type="language" />
    </I18nProvider>
  );

  const textElement = screen.getByText('inglês (Estados Unidos)');

  expect(textElement).toBeInTheDocument();
});

test('should render the name of a region', async () => {
  const i18n = createI18n({ locale: 'pt-BR' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <FormatDisplayName value="BR" type="region" />
    </I18nProvider>
  );

  const textElement = screen.getByText('Brasil');

  expect(textElement).toBeInTheDocument();
});
