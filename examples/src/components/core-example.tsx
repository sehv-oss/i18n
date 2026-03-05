import * as React from 'react';

import { createI18n } from '@sehv-oss/i18n';

import { Section } from './section.tsx';
import { CodeBlock } from './code-block.tsx';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      greeting: 'Hello, {$name}!',
      items: `.match {$count :number}
one {{You have {$count} item}}
*   {{You have {$count} items}}`,
    },
    pt: {
      greeting: 'Olá, {$name}!',
      items: `.match {$count :number}
one {{Você tem {$count} item}}
*   {{Você tem {$count} items}}`,
    },
  },
});

const CODE = `
import { createI18n } from '@sehv-oss/i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      greeting: 'Hello, {$name}!',
      items: \`.match {$count :number}
one {{You have {$count} item}}
*   {{You have {$count} items}}\`,
    },
    pt: {
      greeting: 'Olá, {$name}!',
      items: \`.match {$count :number}
one {{Você tem {$count} item}}
*   {{Você tem {$count} items}}\`,
    },
  },
});

// Translation
i18n.translate('greeting', { name: 'World' });
// → "Hello, World!"

// Pluralization (MessageFormat 2.0)
i18n.translate('items', { count: 1 });
// → "You have 1 item"
i18n.translate('items', { count: 5 });
// → "You have 5 items"

// Formatters
i18n.formatNumber(1234.56);
i18n.formatCurrency(99.9, 'USD');
i18n.formatDate(new Date(), { dateStyle: 'long' });
i18n.formatList(['apple', 'banana', 'orange']);
i18n.formatRelativeTime(-2, 'days');

// Change locale
i18n.setLocale('pt');
`;

export function CoreExample(): React.ReactElement {
  const [locale, setLocale] = React.useState('en');

  const handleLocaleChange = (newLocale: string) => {
    return (): void => {
      setLocale(newLocale);
      i18n.setLocale(newLocale);
    };
  };

  const outputs = [
    {
      label: 'translate("greeting")',
      value: i18n.translate('greeting', { name: 'World' }),
    },
    {
      label: 'translate("items", { count: 1 })',
      value: i18n.translate('items', { count: 1 }),
    },
    {
      label: 'translate("items", { count: 5 })',
      value: i18n.translate('items', { count: 5 }),
    },
    { label: 'formatNumber(1234.56)', value: i18n.formatNumber(1234.56) },
    {
      label: 'formatCurrency(99.9, "USD")',
      value: i18n.formatCurrency(99.9, 'USD'),
    },
    {
      label: 'formatDate(now)',
      value: i18n.formatDate(new Date(), { dateStyle: 'long' }),
    },
    {
      label: 'formatList([...])',
      value: i18n.formatList(['apple', 'banana', 'orange']),
    },
    {
      label: 'formatRelativeTime(-2, "days")',
      value: i18n.formatRelativeTime(-2, 'days'),
    },
  ];

  return (
    <Section
      id="core"
      badge="Universal"
      title="Core — Any Runtime"
      description="Built on Web Standards (Intl API + MessageFormat 2.0). Works in browsers, Node.js, Bun, and Deno with zero dependencies."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CodeBlock code={CODE} filename="example.ts" lang="typescript" />

        <div className="rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              Live Output
            </h3>
            <div className="flex gap-2">
              {['en', 'pt'].map((language) => (
                <button
                  key={language}
                  onClick={handleLocaleChange(language)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    locale === language
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {language.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 flex-1">
            {outputs.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] sm:text-xs font-mono text-zinc-500 truncate">
                  {label}
                </span>
                <span className="text-xs sm:text-sm font-mono text-emerald-400 bg-zinc-800/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 truncate">
                  "{value}"
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
