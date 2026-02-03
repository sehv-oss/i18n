import nodeUrl from 'node:url';
import nodePath from 'node:path';

import { defineConfig, defineProject } from 'vitest/config';

import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';

const __filename = nodeUrl.fileURLToPath(import.meta.url);
const __dirname = nodePath.dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.interface.ts', '**/*.types.ts', 'dist'],
    },
    projects: [
      defineProject({
        test: {
          name: 'core',
          environment: 'node',
          include: ['packages/core/tests/**/*.test.ts'],
        },
      }),
      defineProject({
        plugins: [react()],
        resolve: {
          alias: {
            '@sehv-oss/i18n': nodePath.resolve(
              __dirname,
              'packages/core/src/i18n.ts'
            ),
          },
        },
        test: {
          name: 'react',
          include: ['packages/react/tests/**/*.test.tsx'],
          browser: {
            provider: playwright(),
            screenshotFailures: false,
            enabled: true,
            instances: [{ browser: 'chromium' }],
            headless: true,
          },
        },
      }),
    ],
  },
});
