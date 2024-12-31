import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
  root: '__tests__/setup',
  resolve: {
    alias: {
      '@webguard/performance': path.resolve(__dirname, './src'),
      '@webguard/common': path.resolve(__dirname, '../../common/src'),
      '@webguard/types': path.resolve(__dirname, '../../types/src'),
      '@webguard/core': path.resolve(__dirname, '../../core/src'),
      '@webguard/utils': path.resolve(__dirname, '../../utils/src'),
    },
  },
  define: {
    __DEV__: true,
    __MODE__: JSON.stringify('web'),
  },
  publicDir: path.resolve(__dirname, '../../../assets'),
  server: {
    port: 3003,
    open: true,
  },
  build: {
    emptyOutDir: false,
    target: 'esnext',
    outDir: path.resolve(__dirname, './dist'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@webguard/api-performance',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@webguard/common', '@webguard/types', '@webguard/utils'],
    },
    sourcemap: true,
    minify: true,
  },
});
