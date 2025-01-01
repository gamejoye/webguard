import { build } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

build({
  configFile: false, // 防止打包assets资源
  define: {
    __DEV__: false,
    __MODE__: JSON.stringify('web'),
  },
  build: {
    emptyOutDir: false,
    target: 'esnext',
    outDir: resolve(__dirname, './dist'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@webguard/api-performance',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@webguard/common', '@webguard/types', '@webguard/utils'],
    },
    minify: true,
    sourcemap: true,
  },
});
