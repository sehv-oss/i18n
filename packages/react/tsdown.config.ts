import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/react.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'es2022',
  minify: true,
  sourcemap: true,
});
