import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout } from 'node:timers/promises'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const fixture = mkdtempSync(join(tmpdir(), 'botonic-watch-'))
const pkg = join(fixture, 'packages/botonic-react')
mkdirSync(join(fixture, 'scripts'), { recursive: true })
cpSync(join(root, 'scripts/build'), join(fixture, 'scripts/build'), {
  recursive: true,
})
cpSync(join(root, 'packages/botonic-react'), pkg, {
  recursive: true,
  filter: path =>
    !['node_modules', 'lib', 'coverage'].includes(path.split('/').at(-1)),
})
for (const file of ['tsconfig.base.json', 'tsconfig.cjs.base.json']) {
  cpSync(join(root, file), join(fixture, file))
}
symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
const source = join(pkg, 'src/watch-contract.ts')
const asset = join(pkg, 'src/assets/watch-contract.svg')
writeFileSync(source, "export const watchContract: 'before' = 'before'\n")
writeFileSync(asset, '<svg><!-- before --></svg>')
const child = spawn(
  process.execPath,
  [
    join(root, 'node_modules/@rslib/core/bin/rslib.js'),
    'build',
    '--watch',
    '--no-env',
  ],
  { cwd: pkg, stdio: ['ignore', 'pipe', 'pipe'] }
)
let log = ''
child.stdout.on('data', data => {
  log += data
})
child.stderr.on('data', data => {
  log += data
})
async function updated(marker) {
  const deadline = Date.now() + 120000
  while (Date.now() < deadline) {
    assert.equal(child.exitCode, null, log)
    try {
      if (
        [
          'watch-contract.js',
          'watch-contract.d.ts',
          'assets/watch-contract.svg',
        ].every(file =>
          readFileSync(join(pkg, 'lib/esm', file), 'utf8').includes(marker)
        )
      )
        return
    } catch {}
    await setTimeout(250)
  }
  throw Error(`Watch timeout: ${marker}\n${log}`)
}
try {
  await updated('before')
  writeFileSync(source, "export const watchContract: 'after' = 'after'\n")
  writeFileSync(asset, '<svg><!-- after --></svg>')
  await updated('after')
  console.log(
    'Watch smoke passed: JavaScript, declarations and resource updated (not HMR).'
  )
} finally {
  child.kill('SIGTERM')
  await Promise.race([
    new Promise(resolve => child.once('exit', resolve)),
    setTimeout(5000),
  ])
  if (child.exitCode === null && child.signalCode === null)
    child.kill('SIGKILL')
}
