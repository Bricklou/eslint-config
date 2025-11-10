import type { TypedFlatConfigItem } from '../types'

import { GLOB_HTML } from '../globs'
import { pluginNode } from '../plugins'

export async function node(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ignores: [GLOB_HTML],
      name: 'bricklou/node/rules',
      plugins: {
        node: pluginNode,
      },
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/prefer-global/buffer': ['error', 'never'],
        'node/prefer-global/process': ['error', 'never'],
        'node/process-exit-as-throw': 'error',
      },
    },
  ]
}
