import { defineConfig } from 'cspell';

export default defineConfig({
  dictionaries: ['npm', 'typescript', 'node', 'html', 'css'],
  words: ['sehv', 'nvmrc', 'messageformat'],
  ignorePaths: ['pnpm-lock.yaml'],
});
