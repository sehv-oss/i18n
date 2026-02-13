import { useState } from 'react';
import {
  useTranslate,
  useLocale,
  useFormatNumber,
  useFormatCurrency,
  useFormatDate,
  useFormatList,
  useFormatRelativeTime,
  Translate,
  FormatNumber,
  FormatCurrency,
  FormatDate,
  FormatList,
  FormatRelativeTime,
} from '@sehv-oss/i18n-react';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'pt-BR', label: 'Português' },
  { code: 'es', label: 'Español' },
];

const fruitsByLocale: Record<string, string[]> = {
  en: ['apple', 'banana', 'orange'],
  'pt-BR': ['maçã', 'banana', 'laranja'],
  es: ['manzana', 'plátano', 'naranja'],
};

type Tab = 'hooks' | 'components';

export function App() {
  const translate = useTranslate();
  const [locale, setLocale] = useLocale();
  const formatNumber = useFormatNumber();
  const formatCurrency = useFormatCurrency();
  const formatDate = useFormatDate();
  const formatList = useFormatList();
  const formatRelativeTime = useFormatRelativeTime();

  const [tab, setTab] = useState<Tab>('hooks');
  const [count, setCount] = useState(1);

  const fruits = fruitsByLocale[locale] ?? fruitsByLocale['en']!;
  const now = new Date();

  return (
    <div className="container">
      <header>
        <h1>@sehv-oss/i18n — React</h1>
        <p className="subtitle">{translate('welcome')}</p>
        <div className="locale-switcher">
          {locales.map((l) => (
            <button
              key={l.code}
              className={`locale-btn ${locale === l.code ? 'active' : ''}`}
              onClick={() => setLocale(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <main>
        <section className="card">
          <div className="tabs">
            <button
              className={`tab ${tab === 'hooks' ? 'active' : ''}`}
              onClick={() => setTab('hooks')}
            >
              Hooks API
            </button>
            <button
              className={`tab ${tab === 'components' ? 'active' : ''}`}
              onClick={() => setTab('components')}
            >
              Components API
            </button>
          </div>

          {tab === 'hooks' ? (
            <HooksDemo
              translate={translate}
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              formatList={formatList}
              formatRelativeTime={formatRelativeTime}
              fruits={fruits}
              now={now}
            />
          ) : (
            <ComponentsDemo fruits={fruits} now={now} />
          )}
        </section>

        <section className="card">
          <h2>🔢 Pluralization (interactive)</h2>
          <div className="counter">
            <button onClick={() => setCount(Math.max(0, count - 1))}>−</button>
            <span className="count">{count}</span>
            <button onClick={() => setCount(count + 1)}>+</button>
          </div>
          <div className="result" style={{ marginTop: '0.75rem' }}>
            <span className="label">items:</span>
            <span className="value">{translate('items', { count })}</span>
          </div>
        </section>
      </main>
    </div>
  );
}

type HooksDemoProps = {
  translate: (key: string, values?: Record<string, unknown>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency: string, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatList: (values: string[], options?: Intl.ListFormatOptions) => string;
  formatRelativeTime: (value: number, unit: string, options?: Intl.RelativeTimeFormatOptions) => string;
  fruits: string[];
  now: Date;
};

function HooksDemo(props: HooksDemoProps) {
  const { translate, formatNumber, formatCurrency, formatDate, formatList, formatRelativeTime, fruits, now } = props;

  return (
    <>
      <h2>🪝 Hooks API</h2>
      <div className="result">
        <span className="label">useTranslate('greeting'):</span>
        <span className="value">{translate('greeting', { name: 'World' })}</span>
      </div>
      <div className="result">
        <span className="label">useFormatNumber(1234567.89):</span>
        <span className="value">{formatNumber(1234567.89)}</span>
      </div>
      <div className="result">
        <span className="label">useFormatCurrency(99.9, 'BRL'):</span>
        <span className="value">{formatCurrency(99.9, 'BRL')}</span>
      </div>
      <div className="result">
        <span className="label">useFormatDate(now, long):</span>
        <span className="value">{formatDate(now, { dateStyle: 'long' })}</span>
      </div>
      <div className="result">
        <span className="label">useFormatList(fruits):</span>
        <span className="value">{formatList(fruits)}</span>
      </div>
      <div className="result">
        <span className="label">useFormatRelativeTime(-2, 'days'):</span>
        <span className="value">{formatRelativeTime(-2, 'days')}</span>
      </div>
    </>
  );
}

function ComponentsDemo(props: { fruits: string[]; now: Date }) {
  const { fruits, now } = props;

  return (
    <>
      <h2>🧩 Components API</h2>
      <div className="result">
        <span className="label">{'<Translate />'}</span>
        <span className="value">
          <Translate id="greeting" values={{ name: 'World' }} />
        </span>
      </div>
      <div className="result">
        <span className="label">{'<FormatNumber />'}</span>
        <span className="value">
          <FormatNumber value={1234567.89} />
        </span>
      </div>
      <div className="result">
        <span className="label">{'<FormatCurrency />'}</span>
        <span className="value">
          <FormatCurrency value={99.9} currency="BRL" />
        </span>
      </div>
      <div className="result">
        <span className="label">{'<FormatDate />'}</span>
        <span className="value">
          <FormatDate value={now} dateStyle="long" />
        </span>
      </div>
      <div className="result">
        <span className="label">{'<FormatList />'}</span>
        <span className="value">
          <FormatList values={fruits} />
        </span>
      </div>
      <div className="result">
        <span className="label">{'<FormatRelativeTime />'}</span>
        <span className="value">
          <FormatRelativeTime value={-2} unit="days" />
        </span>
      </div>
    </>
  );
}
