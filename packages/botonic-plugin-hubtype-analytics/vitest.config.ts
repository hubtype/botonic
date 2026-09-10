import { mergeConfig } from 'vitest/config'
import { reactTests, testAssets } from '../../scripts/testing/react'
import { packageTests } from '../../scripts/testing/vitest.shared'

export default mergeConfig(packageTests(import.meta.url), {
  plugins: reactTests(),
  resolve: { alias: testAssets(import.meta.url) },
  test: {
    exclude: ['**/dist/**', 'tests/mocks/**', '**/*json*', '**/__mocks__/**'],
  },
})
