import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_HTML } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function html(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  await ensurePackages([
    '@html-eslint/eslint-plugin',
    '@html-eslint/parser',
  ])

  const [pluginHtml, parserHtml] = await Promise.all([
    interopDefault(import('@html-eslint/eslint-plugin')),
    interopDefault(import('@html-eslint/parser')),
  ] as const)

  return [
    {
      files: [GLOB_HTML],
      language: 'html/html',
      languageOptions: {
        parser: parserHtml,
      },
      name: 'bricklou/html/rules',
      plugins: {
        '@html-eslint': pluginHtml,
      },
      rules: {
        ...pluginHtml.configs['flat/recommended'].rules,
        ...overrides,
      },
    },
  ]
}
