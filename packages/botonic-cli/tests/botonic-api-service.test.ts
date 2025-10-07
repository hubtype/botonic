import { runCommand } from '@oclif/test'
import { assert } from 'console'
import { chdir, cwd } from 'process'

import { BotonicAPIService } from '../src/botonic-api-service.js'
import { EXAMPLES } from '../src/botonic-examples.js'
import { createTempDir, removeRecursively } from '../src/util/file-system.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { cpSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// El root debe ser el directorio del CLI, no el temporal
const CLI_ROOT = path.join(__dirname, '..')

describe('TEST: BotonicApiService', () => {
  const BLANK_EXAMPLE = EXAMPLES[0]
  assert(BLANK_EXAMPLE.name === 'blank')

  it('Builds correctly a project', async () => {
    const originalCwd = cwd()
    const tmpPath = createTempDir('botonic-tmp')

    try {
      // // Cambiar al directorio temporal antes de ejecutar el comando
      chdir(tmpPath)
      // Pasa 'blank' como projectName para evitar el prompt interactivo
      const { stdout, stderr } = await runCommand(
        ['new', 'test-blank', 'blank'],
        {
          root: CLI_ROOT,
        }
      )

      // El stdout debería contener el mensaje de éxito
      expect(stdout).toContain('was successfully created')

      // cpSync(BLANK_EXAMPLE.localTestPath, path.join('..', tmpPath), {recursive: true})
      // const botonicApiService = new BotonicAPIService()
      // const buildOut = await botonicApiService.build()
      // expect(buildOut).toBe(true)
    } finally {
      // Restaurar el directorio original y limpiar
      chdir(originalCwd)
      removeRecursively(tmpPath)
    }
  })
})
