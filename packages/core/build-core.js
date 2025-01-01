import { build } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

build({
  configFile: false, // 禁用配置文件 防止开发态使用的静态资源被打包进来
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
      name: '@webguard/core',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@webguard/common', '@webguard/types', '@webguard/utils'],
    },
    minify: true,
    sourcemap: true, // 生成 sourcemap
  },
});
