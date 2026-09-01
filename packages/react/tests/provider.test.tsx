import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useLocale } from '../src/hooks/use-locale.ts';
import { I18nProvider } from '../src/provider.tsx';

function CurrentLocale() {
  const [locale] = useLocale();

  return <span data-testid="locale">{locale}</span>;
}

test('should observe a locale change that lands before the subscription', async () => {
  const i18n = createI18n({ locale: 'en' });
  let changed = false;

  function ChangesDuringRender() {
    if (!changed) {
      changed = true;
      i18n.setLocale('pt-BR');
    }

    return null;
  }

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <ChangesDuringRender />
      <CurrentLocale />
    </I18nProvider>
  );

  await expect.element(screen.getByTestId('locale')).toHaveTextContent('pt-BR');
});

test('should re-render on a locale change driven from outside React', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <CurrentLocale />
    </I18nProvider>
  );

  i18n.setLocale('fr');

  await expect.element(screen.getByTestId('locale')).toHaveTextContent('fr');
});

test('should keep every consumer on the same locale', async () => {
  const i18n = createI18n({ locale: 'en' });

  const screen = await render(
    <I18nProvider i18n={i18n}>
      <CurrentLocale />
      <CurrentLocale />
    </I18nProvider>
  );

  i18n.setLocale('es');

  const [first, second] = screen.getByTestId('locale').elements();

  await expect.element(first).toHaveTextContent('es');
  await expect.element(second).toHaveTextContent('es');
});
