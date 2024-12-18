/* eslint-disable @typescript-eslint/no-require-imports */
const { build } = require('vite');
const path = require('path');

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
    build: {
      outDir: path.join(__dirname, 'dist'),
      target: 'esnext',
      emptyOutDir: false,
      lib: {
        entry,
        formats: ['es', 'cjs'],
        fileName: format => fileName(format),
      },
    },
  });
});
