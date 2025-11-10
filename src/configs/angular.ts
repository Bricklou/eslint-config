import type { Linter } from 'eslint'
import type { OptionAngular, TypedFlatConfigItem } from '../types'
import { GLOB_HTML, GLOB_TS } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function angular(
  options: OptionAngular = {},
): Promise<TypedFlatConfigItem[]> {
  const { html, selectors, ts } = options

  const tsConfig = Object.assign({
    files: [GLOB_TS],
    overrides: {},
  }, ts)

  const htmlConfig = Object.assign({
    files: [GLOB_HTML],
    overrides: {},
  }, html)

  const componentSelectors = selectors?.component || {}
  const directiveSelectors = selectors?.directive || {}

  await ensurePackages([
    '@typescript-eslint/parser',
    '@angular-eslint/eslint-plugin',
    '@angular-eslint/eslint-plugin-template',
    '@angular-eslint/template-parser',
  ])

  const [
    parserTs,
    pluginAngular,
    pluginAngularTemplate,
    parserAngularTemplate,
  ] = await Promise.all([
    interopDefault(import('@typescript-eslint/parser')),
    interopDefault(import('@angular-eslint/eslint-plugin')),
    interopDefault(import('@angular-eslint/eslint-plugin-template')),
    interopDefault(import('@angular-eslint/template-parser')),
  ])

  const processInlineTemplates = pluginAngularTemplate.processors?.['extract-inline-html'] as Linter.Processor

  return [
    {
      files: tsConfig.files,
      languageOptions: {
        parser: parserTs,
        sourceType: 'module',
      },
      name: 'bricklou/angular/ts-base',
      plugins: {
        angular: pluginAngular,
      },
      processor: processInlineTemplates,
    },

    {
      files: tsConfig.files,
      name: 'bricklou/angular/recommended',
      rules: {
        '@angular-eslint/contextual-lifecycle': 'error',
        '@angular-eslint/no-empty-lifecycle-method': 'error',
        '@angular-eslint/no-input-rename': 'error',
        '@angular-eslint/no-inputs-metadata-property': 'error',
        '@angular-eslint/no-output-native': 'error',
        '@angular-eslint/no-output-on-prefix': 'error',
        '@angular-eslint/no-output-rename': 'error',
        '@angular-eslint/no-outputs-metadata-property': 'error',
        '@angular-eslint/prefer-inject': 'error',
        '@angular-eslint/prefer-standalone': 'error',
        '@angular-eslint/use-lifecycle-interface': 'warn',
        '@angular-eslint/use-pipe-transform-interface': 'error',
      },
    },

    {
      files: tsConfig.files,
      name: 'bricklou/angular/rules',
      rules: {
        'angular/component-selector': [
          'error',
          {
            prefix: componentSelectors.prefix ?? '',
            style: directiveSelectors.style ?? 'kebab-case',
            type: componentSelectors.type ?? 'element',
          },
        ],
        'angular/directive-selector': [
          'error',
          {
            prefix: directiveSelectors.prefix ?? '',
            style: directiveSelectors.style ?? 'camelCase',
            type: directiveSelectors.type ?? 'attribute',
          },
        ],
        'angular/no-async-lifecycle-method': 'error',
        'angular/no-duplicates-in-metadata-arrays': 'warn',
        'angular/prefer-host-metadata-property': 'warn',
        'angular/prefer-on-push-component-change-detection': 'error',

        'angular/prefer-signals': 'error',

        ...tsConfig.overrides,
      },
    },

    {
      files: htmlConfig.files,
      languageOptions: {
        parser: parserAngularTemplate,
      },
      name: 'bricklou/angular/template-base',
      plugins: {
        'angular-template': pluginAngularTemplate,
      },
    },

    {
      files: htmlConfig.files,
      languageOptions: {
        parser: parserAngularTemplate,
      },
      name: 'bricklou/angular/template-recommended',
      plugins: {
        'angular-template': pluginAngularTemplate,
      },
      rules: {
        'angular-template/banana-in-box': 'error',
        'angular-template/eqeqeq': 'error',
        'angular-template/no-negated-async': 'error',
      },
    },

    {
      files: htmlConfig.files,
      name: 'bricklou/angular/template-accessibility',
      rules: {
        'angular-template/alt-text': 'error',
        'angular-template/click-events-have-key-events': 'error',
        'angular-template/elements-content': 'error',
        'angular-template/interactive-supports-focus': 'error',
        'angular-template/label-has-associated-control': 'error',
        'angular-template/mouse-events-have-key-events': 'error',
        'angular-template/no-autofocus': 'error',
        'angular-template/no-distracting-elements': 'error',
        'angular-template/role-has-required-aria': 'error',
        'angular-template/table-scope': 'error',
        'angular-template/valid-aria': 'error',
      },
    },

    {
      files: htmlConfig.files,
      name: 'bricklou/angular/templates/rules',
      rules: {
        'angular-template/attributes-order': 'error',
        'angular-template/button-has-type': 'error',
        'angular-template/i18n': 'off',
        // Since this rules doesn't support signals
        'angular-template/no-call-expression': 'off',
        'angular-template/no-duplicate-attributes': 'error',
        'angular-template/no-empty-control-flow': 'error',
        'angular-template/no-inline-styles': 'error',
        'angular-template/no-interpolation-in-attributes': 'warn',
        'angular-template/no-nested-tags': 'error',
        'angular-template/prefer-at-else': 'warn',
        'angular-template/prefer-at-empty': 'warn',
        'angular-template/prefer-built-in-pipes': 'warn',
        'angular-template/prefer-contextual-for-variables': 'warn',
        'angular-template/prefer-control-flow': 'warn',
        'angular-template/prefer-self-closing-tags': 'warn',
        'angular-template/prefer-static-string-properties': 'warn',
        'angular-template/prefer-template-literal': 'warn',

        ...htmlConfig.overrides,
      },
    },
  ]
}
