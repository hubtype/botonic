import { runCommand } from '@oclif/test'
import { assert } from 'console'
import { chdir, cwd } from 'process'

import { EXAMPLES } from '../src/botonic-examples.js'
import { createTempDir, removeRecursively } from '../src/util/file-system.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const CLI_ROOT = path.join(__dirname, '..')

describe('TEST: BotonicApiService', () => {
  const BLANK_EXAMPLE = EXAMPLES[0]
  assert(BLANK_EXAMPLE.name === 'blank')

  it('Builds correctly a project', async () => {
    const originalCwd = cwd()
    const tmpPath = createTempDir('botonic-tmp')

    try {
      chdir(tmpPath)
      const { stdout, stderr } = await runCommand(
        ['new', 'test-blank', 'blank'],
        {
          root: CLI_ROOT,
        }
      )

      expect(stdout).toContain('was successfully created')
    } finally {
      chdir(originalCwd)
      removeRecursively(tmpPath)
    }
  })
})
