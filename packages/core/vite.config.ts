import { defineConfig } from 'vite';
import path from 'path';

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
});
