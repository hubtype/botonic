import assert from 'node:assert/strict'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

// Use only in disposable fixtures, never in a developer's package directory.
export function seedOldBuild(pkg) {
  const stale = [
    'obsolete.js',
    'esm/obsolete.js',
    'src/obsolete.js',
    'cjs/obsolete.js',
  ]
  for (const file of stale) {
    const path = join(pkg, 'lib', file)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, 'obsolete output\n')
  }
  const outside = join(pkg, 'cleanup-contract.txt')
  writeFileSync(outside, 'keep outside lib\n')
  return () => {
    for (const file of stale) {
      assert(
        !existsSync(join(pkg, 'lib', file)),
        `Stale output: ${pkg}/lib/${file}`
      )
    }
    for (const directory of ['esm', 'src', 'cjs']) {
      assert(
        !existsSync(join(pkg, 'lib', directory)),
        `Old output directory: ${directory}`
      )
    }
    assert.equal(readFileSync(outside, 'utf8'), 'keep outside lib\n')
  }
}
