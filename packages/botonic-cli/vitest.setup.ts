import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, vi } from 'vitest'

const originalDirectory = process.cwd()
const testDirectory = mkdtempSync(join(tmpdir(), 'botonic-cli-test-'))
process.chdir(testDirectory)

// Keep both project credentials and global credentials inside the test sandbox.
vi.mock('./src/util/file-system.js', async importOriginal => ({
  ...(await importOriginal<typeof import('./src/util/file-system.js')>()),
  getHomeDirectory: () => testDirectory,
}))

afterEach(() => {
  process.chdir(testDirectory)
  vi.restoreAllMocks()
})

afterAll(() => {
  process.chdir(originalDirectory)
  rmSync(testDirectory, { recursive: true, force: true })
})
