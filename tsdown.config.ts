import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
  ],
  outExtensions: () => ({
    js: '.js',
    dts: '.d.ts',
  }),
  shims: true,
  format: 'esm',
})
