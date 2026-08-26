import { useState } from 'react';
import { CoreExample } from './components/core-example.tsx';
import { InstallTabs } from './components/install-tabs.tsx';
import { ReactExample } from './components/react-example.tsx';
import { TypeSafeExample } from './components/type-safe-example.tsx';
import { YamlExample } from './components/yaml-example.tsx';

const NAV_ITEMS = [
  { id: 'core', label: 'Core' },
  { id: 'typesafe', label: 'Type-safe' },
  { id: 'react', label: 'React' },
  { id: 'yaml', label: 'Custom Loaders' },
];

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-[var(--font-sans)]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-base sm:text-lg font-bold tracking-tight">
              <span className="text-blue-400">@sehv-oss</span>
              <span className="text-zinc-500">/</span>
              <span className="text-white">i18n</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">
              site
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="https://github.com/sehv-oss/i18n"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
            >
              GitHub
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur-xl">
            <nav className="flex flex-col px-4 py-3 gap-1">
              {NAV_ITEMS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                >
                  {label}
                </a>
              ))}
              <a
                href="https://github.com/sehv-oss/i18n"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-16">
        <section className="py-14 sm:py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs sm:text-sm text-zinc-400 mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Built on Web Standards
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="text-white">Modern i18n for</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
              JavaScript & React
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            Lightweight, type-safe internationalization powered by the Intl API
            and MessageFormat 2.0. One dependency, nothing transitive, works
            everywhere.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-16 px-2">
            {[
              'MessageFormat 2.0',
              'Zero Transitive Deps',
              'Tree-shakeable',
              'Typed Keys',
              'Custom Loaders',
              'SSR Ready',
            ].map((feature) => (
              <span
                key={feature}
                className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-zinc-900 text-zinc-300 border border-zinc-800"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-6 sm:gap-8 text-sm text-zinc-500">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white">2</span>
              <span>Packages</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white">0</span>
              <span>Transitive Deps</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white">∞</span>
              <span>Runtimes</span>
            </div>
          </div>

          <InstallTabs />
        </section>

        <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24">
          <CoreExample />
          <TypeSafeExample />
          <ReactExample />
          <YamlExample />
        </div>
      </main>

      <footer className="border-t border-zinc-800/50 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
          <span>ISC License — @sehv-oss/i18n</span>
          <a
            href="https://github.com/sehv-oss/i18n"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            github.com/sehv-oss/i18n
          </a>
        </div>
      </footer>
    </div>
  );
}
