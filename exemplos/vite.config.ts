import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'usando-o-core': resolve(__dirname, 'usando-o-core/index.html'),
        'criando-um-loader-de-yaml': resolve(
          __dirname,
          'criando-um-loader-de-yaml/index.html'
        ),
        'usando-react': resolve(__dirname, 'usando-react/index.html'),
      },
    },
  },
});
