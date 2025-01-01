import { build } from 'vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFileName = (format, ext) => {
  return {
    es: `index${ext}.mjs`,
    cjs: `index${ext}.cjs`,
  }[format];
};

const entrys = [
  {
    entry: path.join(__dirname, 'src/index.ts'),
    fileName: format => getFileName(format, ''),
  },
];

entrys.forEach(({ entry, fileName }) => {
  build({
    define: {
      __MODE__: JSON.stringify('web'),
    },
    build: {
      outDir: path.join(__dirname, 'dist'),
      target: 'esnext',
      emptyOutDir: false,
      lib: {
        entry,
        name: '@webguard/common',
        formats: ['es', 'cjs'],
        fileName: format => fileName(format),
      },
      sourcemap: true,
    },
  });
});
