import type { OptionAngular, TypedFlatConfigItem } from '../types'
import { defineConfig } from '@eslint/config-helpers'
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
    'angular-eslint',
  ])

  const pluginAngular = await interopDefault(import('angular-eslint'))

  return defineConfig(
    {
      // @ts-expect-error -- Angular ESLint types are broken with the new `defineConfig` API from `eslint`
      extends: [...pluginAngular.configs.tsRecommended],
      files: tsConfig.files,
      name: 'bricklou/angular/setup',
    },
    {
      extends: [
        ...pluginAngular.configs.templateRecommended,
        ...pluginAngular.configs.templateAccessibility,
      ],
      files: htmlConfig.files,
      name: 'bricklou/angular/template/setup',
    },
    {
      files: tsConfig.files,
      name: 'bricklou/angular/rules',
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            prefix: componentSelectors.prefix ?? '',
            style: directiveSelectors.style ?? 'kebab-case',
            type: componentSelectors.type ?? 'element',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            prefix: directiveSelectors.prefix ?? '',
            style: directiveSelectors.style ?? 'camelCase',
            type: directiveSelectors.type ?? 'attribute',
          },
        ],
        '@angular-eslint/no-async-lifecycle-method': 'error',
        '@angular-eslint/no-duplicates-in-metadata-arrays': 'warn',
        '@angular-eslint/prefer-host-metadata-property': 'warn',
        '@angular-eslint/prefer-inject': 'error',
        '@angular-eslint/prefer-on-push-component-change-detection': 'error',

        '@angular-eslint/prefer-signals': 'error',
        '@angular-eslint/use-lifecycle-interface': 'warn',

        ...tsConfig.overrides,
      },
    },
    {
      files: htmlConfig.files,
      name: 'bricklou/angular/templates/rules',
      rules: {
        '@angular-eslint/template/attributes-order': 'error',
        '@angular-eslint/template/button-has-type': 'error',
        '@angular-eslint/template/i18n': 'off',
        // Since this rules doesn't support signals
        '@angular-eslint/template/no-call-expression': 'off',
        '@angular-eslint/template/no-duplicate-attributes': 'error',
        '@angular-eslint/template/no-empty-control-flow': 'error',
        '@angular-eslint/template/no-inline-styles': 'error',
        '@angular-eslint/template/no-interpolation-in-attributes': 'warn',
        '@angular-eslint/template/no-nested-tags': 'error',
        '@angular-eslint/template/prefer-at-else': 'warn',
        '@angular-eslint/template/prefer-at-empty': 'warn',
        '@angular-eslint/template/prefer-built-in-pipes': 'warn',
        '@angular-eslint/template/prefer-contextual-for-variables': 'warn',
        '@angular-eslint/template/prefer-control-flow': 'warn',
        '@angular-eslint/template/prefer-self-closing-tags': 'warn',
        '@angular-eslint/template/prefer-static-string-properties': 'warn',
        '@angular-eslint/template/prefer-template-literal': 'warn',

        ...htmlConfig.overrides,
      },
    },
  )
}
