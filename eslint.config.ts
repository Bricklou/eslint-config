import { configLinter } from './src'

export default configLinter(
  {
    vue: {
      a11y: true,
    },
    react: true,
    angular: true,
    typescript: {
      erasableOnly: true,
    },
    markdown: {
      overrides: {
        'no-dupe-keys': 'off',
      },
    },
    formatters: true,
    pnpm: true,
    type: 'lib',
    jsx: {
      a11y: true,
    },
  },
  {
    ignores: [
      'fixtures',
      '_fixtures',
      '**/constants-generated.ts',
    ],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
)
