import * as React from 'react';

const MANAGERS = [
  { id: 'npm', label: 'npm' },
  { id: 'pnpm', label: 'pnpm' },
  { id: 'yarn', label: 'yarn' },
] as const;

const PACKAGES = [
  {
    name: '@sehv-oss/i18n',
    description: 'Core',
    commands: {
      npm: 'npm install @sehv-oss/i18n',
      pnpm: 'pnpm add @sehv-oss/i18n',
      yarn: 'yarn add @sehv-oss/i18n',
    },
  },
  {
    name: '@sehv-oss/i18n-react',
    description: 'React bindings',
    commands: {
      npm: 'npm install @sehv-oss/i18n @sehv-oss/i18n-react',
      pnpm: 'pnpm add @sehv-oss/i18n @sehv-oss/i18n-react',
      yarn: 'yarn add @sehv-oss/i18n @sehv-oss/i18n-react',
    },
  },
];

type ManagerId = (typeof MANAGERS)[number]['id'];

export function InstallTabs(): React.ReactElement {
  const [manager, setManager] = React.useState<ManagerId>('npm');
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, index: number): void => {
    void navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 sm:mt-14">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 text-center">
        Installation
      </h3>

      <div className="flex justify-center gap-1 mb-4">
        {MANAGERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setManager(id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              manager === id
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {PACKAGES.map((pkg, index) => (
          <div
            key={pkg.name}
            className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 shrink-0">
              {pkg.description}
            </span>
            <code className="flex-1 text-sm font-mono text-zinc-300 truncate">
              {pkg.commands[manager]}
            </code>
            <button
              onClick={() => handleCopy(pkg.commands[manager], index)}
              className="shrink-0 p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label={`Copy ${pkg.description} install command`}
            >
              {copiedIndex === index ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
