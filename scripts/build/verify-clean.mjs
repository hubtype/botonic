import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  symlinkSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedOldBuild } from './cleanup-contract.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const fixture = mkdtempSync(join(tmpdir(), 'botonic-clean-'))
mkdirSync(join(fixture, 'scripts'), { recursive: true })
cpSync(join(root, 'scripts/build'), join(fixture, 'scripts/build'), {
  recursive: true,
})
cpSync(join(root, 'tsconfig.base.json'), join(fixture, 'tsconfig.base.json'))
symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')

for (const name of [
  'core',
  'react',
  'plugin-ai-agents',
  'plugin-flow-builder',
  'plugin-hubtype-analytics',
  'cli',
]) {
  const pkg = join(fixture, 'packages', `botonic-${name}`)
  cpSync(join(root, 'packages', `botonic-${name}`), pkg, {
    recursive: true,
    filter: path =>
      !['node_modules', 'lib', 'coverage'].includes(path.split('/').at(-1)),
  })
  const assertClean = seedOldBuild(pkg)
  // Direct Rslib invocation proves cleanup does not depend on npm lifecycle scripts.
  execFileSync(
    process.execPath,
    [join(root, 'node_modules/@rslib/core/bin/rslib.js'), 'build', '--no-env'],
    {
      cwd: pkg,
      stdio: 'inherit',
    }
  )
  assertClean()
  for (const file of ['index.js', 'index.d.ts', 'index.js.map']) {
    assert(existsSync(join(pkg, 'lib', file)), `${name}: missing ${file}`)
  }
  console.log(
    `${name}: Rslib cleaned old output and preserved files outside lib`
  )
}
