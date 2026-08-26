import type * as React from 'react';

import { Section } from './section.tsx';
import { CodeBlock } from './code-block.tsx';

const MESSAGES_CODE = `
// locales/en.ts
export default {
  greeting: 'Hello, {$name}!',
  home: {
    title: 'Home',
    items: \`.input {$count :number}
.match $count
one {{You have {$count} item}}
*   {{You have {$count} items}}\`,
  },
} as const;
`;

const REGISTER_CODE = `
// i18n.d.ts — write this once, anywhere in your app
import type en from './locales/en.ts';

declare module '@sehv-oss/i18n' {
  interface Register {
    messages: typeof en;
  }
}
`;

const USAGE_CODE = `
import { useTranslate, Translate } from '@sehv-oss/i18n-react';

function Greeting() {
  // No generic, no factory — the hook already knows your keys
  const translate = useTranslate();

  return (
    <>
      <p>{translate('greeting', { name: 'World' })}</p>
      <p>{translate('home.items', { count: 5 })}</p>
      <Translate id="home.title" />
    </>
  );
}
`;

type Check = {
  code: string;
  note: string;
  ok: boolean;
};

const CHECKS: Check[] = [
  {
    code: `translate('home.title')`,
    note: 'Nested messages are reached by dot path',
    ok: true,
  },
  {
    code: `translate('greeting', { name: 'World' })`,
    note: 'Placeholders are read straight from the message text',
    ok: true,
  },
  {
    code: `translate('greetng', { name: 'World' })`,
    note: 'Misspelled key',
    ok: false,
  },
  {
    code: `translate('home.subtitle')`,
    note: 'Path does not exist',
    ok: false,
  },
  {
    code: `translate('home')`,
    note: "'home' is a group of messages, not a message",
    ok: false,
  },
  {
    code: `translate('greeting')`,
    note: 'The message declares $name, so values is required',
    ok: false,
  },
  {
    code: `translate('greeting', {})`,
    note: "'name' is missing",
    ok: false,
  },
  {
    code: `translate('greeting', { name, extra })`,
    note: "'extra' is not declared by the message",
    ok: false,
  },
];

function CheckRow(props: Check): React.ReactElement {
  const { code, note, ok } = props;

  return (
    <li className="flex gap-3 min-w-0">
      <span
        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-xs font-bold ${
          ok
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}
      >
        {ok ? '✓' : '✗'}
      </span>
      <span className="min-w-0">
        <code
          className={`block font-mono text-[11px] sm:text-xs break-words ${
            ok ? 'text-emerald-300' : 'text-rose-300 line-through'
          }`}
        >
          {code}
        </code>
        <span className="block text-xs text-zinc-500 mt-0.5">{note}</span>
      </span>
    </li>
  );
}

export function TypeSafeExample(): React.ReactElement {
  return (
    <Section
      id="typesafe"
      badge="Type-safe"
      title="Keys Checked at Compile Time"
      description="Register your messages once and every key, dot path and placeholder becomes statically checked — in the core API, in the hooks and in the components alike."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-6">
          <CodeBlock
            code={MESSAGES_CODE}
            filename="locales/en.ts"
            lang="typescript"
          />
          <CodeBlock
            code={REGISTER_CODE}
            filename="i18n.d.ts"
            lang="typescript"
          />
          <CodeBlock code={USAGE_CODE} filename="greeting.tsx" lang="tsx" />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 sm:mb-4">
              What the compiler catches
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {CHECKS.map((check) => (
                <CheckRow key={check.code} {...check} />
              ))}
            </ul>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 sm:mb-4">
              Good to know
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-400">
              <li>
                Skip the augmentation and everything still works — keys simply
                fall back to{' '}
                <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                  string
                </code>
                .
              </li>
              <li>
                A JSON file typed with{' '}
                <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                  typeof import('./en.json')
                </code>{' '}
                gives you checked keys. TypeScript widens its values to{' '}
                <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                  string
                </code>
                , so placeholder checking needs a{' '}
                <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                  .ts
                </code>{' '}
                module with{' '}
                <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                  as const
                </code>
                .
              </li>
              <li>
                Placeholders come from the message text:{' '}
                <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                  {'{$count :number}'}
                </code>{' '}
                asks for{' '}
                <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                  count
                </code>
                , and names bound by{' '}
                <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                  .local
                </code>{' '}
                are left out, since they never reach the caller.
              </li>
              <li>
                Nothing is threaded through the provider. The registry is
                global, so hooks and components pick it up on their own.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
