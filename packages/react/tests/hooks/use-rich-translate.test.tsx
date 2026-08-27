import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@sehv-oss/i18n';

import { useRichTranslate } from '../../src/hooks/use-rich-translate.tsx';
import { I18nProvider } from '../../src/provider.tsx';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      terms: 'Accept the {#link}terms{/link}, {$name}',
      plain: 'Nothing to wrap',
    },
  },
});

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}

test('should wrap a markup run with the matching tag', async () => {
  function Component() {
    const richTranslate = useRichTranslate();

    return (
      <p>
        {richTranslate(
          'terms',
          { name: 'World' },
          { link: (chunks) => <a href="/terms">{chunks}</a> }
        )}
      </p>
    );
  }

  const screen = await render(<Component />, { wrapper });

  await expect.element(screen.getByRole('link')).toHaveTextContent('terms');
  await expect
    .element(screen.getByRole('link'))
    .toHaveAttribute('href', '/terms');
});

test('should render the text of an unmapped tag without dropping it', async () => {
  function Component() {
    const richTranslate = useRichTranslate();

    return <p data-testid="out">{richTranslate('terms', { name: 'World' })}</p>;
  }

  const screen = await render(<Component />, { wrapper });

  await expect
    .element(screen.getByTestId('out'))
    .toHaveTextContent('Accept the terms, World');
});

test('should render a message with no markup as plain text', async () => {
  function Component() {
    const richTranslate = useRichTranslate();

    return <p data-testid="out">{richTranslate('plain')}</p>;
  }

  const screen = await render(<Component />, { wrapper });

  await expect
    .element(screen.getByTestId('out'))
    .toHaveTextContent('Nothing to wrap');
});
