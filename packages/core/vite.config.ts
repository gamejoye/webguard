import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
  root: '__tests__',
  resolve: {
    alias: {
      '@web-guard/core': path.resolve(__dirname, './src'),
      '@web-guard/utils': path.resolve(__dirname, '../utils/src'),
      '@web-guard/common': path.resolve(__dirname, '../common/src'),
      '@web-guard/types': path.resolve(__dirname, '../types/src'),
    },
  },
  define: {
    __DEV__: true,
    __MODE__: JSON.stringify('web'),
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    emptyOutDir: false,
    outDir: path.resolve(__dirname, './dist'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@web-guard/core',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      output: {
        sourcemap: true, // 生成 sourcemap
      },
    },
    minify: true,
  },
});
