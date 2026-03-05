import * as React from 'react';

import { createI18n } from '@sehv-oss/i18n';
import {
  I18nProvider,
  useTranslate,
  useLocale,
  useFormatNumber,
  useFormatCurrency,
  useFormatDate,
  Translate,
  FormatNumber,
  FormatCurrency,
  FormatDate,
  FormatList,
  FormatRelativeTime,
} from '@sehv-oss/i18n-react';

import { Section } from './section.tsx';
import { CodeBlock } from './code-block.tsx';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      greeting: 'Hello, {$name}!',
      welcome: 'Welcome to the app',
    },
    pt: {
      greeting: 'Olá, {$name}!',
      welcome: 'Bem-vindo ao app',
    },
  },
});

const CODE = `
import { createI18n } from '@sehv-oss/i18n';
import {
  I18nProvider,
  // Hooks
  useTranslate,
  useLocale,
  useFormatNumber,
  useFormatCurrency,
  useFormatDate,
  // Components
  Translate,
  FormatNumber,
  FormatCurrency,
  FormatDate,
  FormatList,
  FormatRelativeTime,
} from '@sehv-oss/i18n-react';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { greeting: 'Hello, {$name}!' },
    pt: { greeting: 'Olá, {$name}!' },
  },
});

function Hooks(): React.ReactElement {
  const translate = useTranslate();
  const [locale, setLocale] = useLocale();
  const formatNumber = useFormatNumber();
  const formatCurrency = useFormatCurrency();
  const formatDate = useFormatDate();

  return (
    <div>
      <p>{translate('greeting', { name: 'World' })}</p>
      <p>{formatNumber(1234.56)}</p>
      <p>{formatCurrency(99.9, 'BRL')}</p>
      <p>{formatDate(new Date(), { dateStyle: 'long' })}</p>
      <button onClick={() => setLocale('pt')}>Português</button>
    </div>
  );
}

function Components(): React.ReactElement {
  return (
    <div>
      <Translate id="greeting" values={{ name: 'World' }} />
      <FormatNumber value={1234.56} />
      <FormatCurrency value={99.9} currency="BRL" />
      <FormatDate value={new Date()} dateStyle="long" />
      <FormatList values={['a', 'b', 'c']} />
      <FormatRelativeTime value={-2} unit="days" />
    </div>
  );
}

function App(): React.ReactElement {
  return (
    <I18nProvider i18n={i18n}>
      <Hooks />
    </I18nProvider>
  );
}
`;

function ReactDemo(): React.ReactElement {
  const translate = useTranslate();
  const [locale, setLocale] = useLocale();
  const formatNumber = useFormatNumber();
  const formatCurrency = useFormatCurrency();
  const formatDate = useFormatDate();

  return (
    <div className="rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 min-w-0">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-wider">
          Live Output
        </h3>
        <div className="flex gap-2">
          {['en', 'pt'].map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                locale === l
                  ? 'bg-violet-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <p className="sm:text-xs font-mono text-zinc-500 mb-2">Hooks API</p>
          <div className="space-y-2">
            {[
              {
                label: 'useTranslate()',
                value: translate('greeting', { name: 'React' }),
              },
              { label: 'useFormatNumber()', value: formatNumber(1234.56) },
              {
                label: 'useFormatCurrency()',
                value: formatCurrency(99.9, 'BRL'),
              },
              {
                label: 'useFormatDate()',
                value: formatDate(new Date(), { dateStyle: 'long' }),
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1 min-w-0">
                <span className="sm:text-xs font-mono text-zinc-500 truncate">
                  {label}
                </span>
                <span className="text-xs sm:text-sm font-mono text-violet-400 bg-zinc-800/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 truncate">
                  "{value}"
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="sm:text-xs font-mono text-zinc-500 mb-2">
            Components API
          </p>
          <div className="space-y-2">
            {[
              {
                label: '<Translate />',
                value: <Translate id="greeting" values={{ name: 'React' }} />,
              },
              {
                label: '<FormatNumber />',
                value: <FormatNumber value={1234.56} />,
              },
              {
                label: '<FormatCurrency />',
                value: <FormatCurrency value={99.9} currency="BRL" />,
              },
              {
                label: '<FormatDate />',
                value: <FormatDate value={new Date()} dateStyle="long" />,
              },
              {
                label: '<FormatList />',
                value: <FormatList values={['React', 'Vue', 'Svelte']} />,
              },
              {
                label: '<FormatRelativeTime />',
                value: <FormatRelativeTime value={-2} unit="days" />,
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1 min-w-0">
                <span className="sm:text-xs font-mono text-zinc-500 truncate">
                  {label}
                </span>
                <span className="text-xs sm:text-sm font-mono text-violet-400 bg-zinc-800/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 truncate">
                  "{value}"
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReactExample(): React.ReactElement {
  return (
    <Section
      id="react"
      badge="React"
      title="React Bindings"
      description="First-class React support with hooks and declarative components. Auto re-renders on locale change."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-6">
          <CodeBlock code={CODE} lang="tsx" filename="hooks-api.tsx" />
        </div>

        <I18nProvider i18n={i18n}>
          <ReactDemo />
        </I18nProvider>
      </div>
    </Section>
  );
}
