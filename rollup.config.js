import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import babel from '@rollup/plugin-babel';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createRollupConfig(packageName) {
  return defineConfig({
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.min.js',
        format: 'iife',
        name: packageName,
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [
      del({ targets: 'dist/*' }),
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        sourceMap: true,
        declaration: true,
        declarationDir: 'dist',
      }),
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.tsx'],
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      }),
    ],
  });
}
