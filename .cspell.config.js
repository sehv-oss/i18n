import { defineConfig } from 'cspell';

export default defineConfig({
  dictionaries: ['npm', 'typescript', 'node', 'html', 'css'],
  words: [
    'greetng',
    'itens',
    'laranja',
    'maçã',
    'messageformat',
    'nvmrc',
    'plik',
    'pliki',
    'pliku',
    'plików',
    'português',
    'sehv',
    'shiki',
    'typesafe',
    'vindo',
    'você',
  ],
  ignorePaths: ['pnpm-lock.yaml', 'CHANGELOG.md'],
  useGitignore: true,
});
