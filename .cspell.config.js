import { defineConfig } from 'cspell';

export default defineConfig({
  dictionaries: ['npm', 'typescript', 'node', 'html', 'css'],
  words: [
    'laranja',
    'maçã',
    'messageformat',
    'nvmrc',
    'português',
    'sehv',
    'shiki',
    'vindo',
    'você',
  ],
  ignorePaths: ['pnpm-lock.yaml', 'CHANGELOG.md'],
  useGitignore: true,
});
