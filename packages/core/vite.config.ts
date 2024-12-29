import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
  root: '__tests__/setup',
  resolve: {
    alias: {
      '@webguard/core': path.resolve(__dirname, './src'),
      '@webguard/utils': path.resolve(__dirname, '../utils/src'),
      '@webguard/common': path.resolve(__dirname, '../common/src'),
      '@webguard/types': path.resolve(__dirname, '../types/src'),
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
    target: 'esnext',
    outDir: path.resolve(__dirname, './dist'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@webguard/core',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      output: {
        sourcemap: true, // 生成 sourcemap
      },
      external: ['@webguard/common', '@webguard/types', '@webguard/utils'],
    },
    minify: true,
  },
});
