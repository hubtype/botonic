import { mergeConfig } from 'vitest/config'
import { packageTests } from '../../scripts/testing/vitest.shared'

export default mergeConfig(packageTests(import.meta.url), {
  test: {
    // The command integration tests change cwd and launch real npm processes.
    pool: 'forks',
    testTimeout: 1_000_000,
    hookTimeout: 1_000_000,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/botonic-tmp*/**'],
  },
})
