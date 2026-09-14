import { mergeConfig } from 'vitest/config'
import { packageTests } from '../../scripts/testing/vitest.shared'

export default mergeConfig(packageTests(import.meta.url), {
  test: {
    exclude: [
      '**/dist/**',
      'tests/mocks/**',
      'tests/helpers/**',
      '**/*json*',
      '**/__mocks__/**',
    ],
  },
})
