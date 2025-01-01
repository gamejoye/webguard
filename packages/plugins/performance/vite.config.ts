import { defineConfig } from 'vite';
import path from 'path';

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
    port: 3002,
    open: true,
  },
});
