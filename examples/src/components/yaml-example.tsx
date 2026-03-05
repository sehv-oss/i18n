import type * as React from 'react';

import { Section } from './section.tsx';
import { CodeBlock } from './code-block.tsx';

const YAML_LOADER_CODE = `
import { createI18n, type ILoader } from '@sehv-oss/i18n';
import YAML from 'yaml';

// Create a custom YAML loader
const yamlLoader: ILoader = {
  extensions: ['.yaml', '.yml'],
  parse(content) {
    return YAML.parse(content);
  },
};

const i18n = createI18n({
  locale: 'en',
  loaders: [yamlLoader],
});

// Load messages from a YAML file
await i18n.loadMessagesAsync('/locales/en.yaml');
`;

const YAML_FILE_CODE = `
# /locales/en.yaml
greeting: "Hello, {$name}!"
farewell: "Goodbye, {$name}!"
notifications:
  new_message: "You have a new message from {$sender}"
items: |
  .match {$count :number}
  one {{You have {$count} item}}
  *   {{You have {$count} items}}
`;

const CUSTOM_LOADER_CODE = `
import { type ILoader } from '@sehv-oss/i18n';
import { parse } from 'csv-parse/sync';

// Any format — just implement ILoader
const csvLoader: ILoader = {
  extensions: ['.csv'],
  parse(content) {
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
    const messages: Record<string, string> = {};
    for (const record of records) {
      messages[record.key] = record.value;
    }
    return messages;
  },
};
`;

export function YamlExample(): React.ReactElement {
  return (
    <Section
      id="yaml"
      badge="Extensible"
      title="Custom Loaders"
      description="Extend @sehv-oss/i18n with custom loaders for any format. YAML, CSV, TOML — you name it."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-6">
          <CodeBlock
            code={YAML_LOADER_CODE}
            filename="yaml-loader.ts"
            lang="typescript"
          />
          <CodeBlock
            code={CUSTOM_LOADER_CODE}
            filename="csv-loader.ts"
            lang="typescript"
          />
        </div>

        <div className="space-y-6">
          <CodeBlock
            code={YAML_FILE_CODE}
            lang="yaml"
            filename="locales/en.yaml"
          />

          <div className="rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 sm:mb-4">
              How It Works
            </h3>
            <ol className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>
                  Implement the{' '}
                  <code className="text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    ILoader
                  </code>{' '}
                  interface with{' '}
                  <code className="text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    extensions
                  </code>{' '}
                  and{' '}
                  <code className="text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    parse()
                  </code>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>
                  Pass the loader to{' '}
                  <code className="text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    {'createI18n({ loaders: [...] })'}
                  </code>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>
                  Use{' '}
                  <code className="text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    loadMessagesAsync()
                  </code>{' '}
                  — the library matches the file extension to your loader
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <span>
                  The locale is automatically extracted from the filename (e.g.{' '}
                  <code className="text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    en.yaml
                  </code>{' '}
                  →{' '}
                  <code className="text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    en
                  </code>
                  )
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}
