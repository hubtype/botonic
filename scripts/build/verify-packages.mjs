import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const fixture = mkdtempSync(join(tmpdir(), 'botonic-esm-'))
const tarballs = join(fixture, 'tarballs')
mkdirSync(tarballs)
console.log(`Isolated consumer: ${fixture}`)

function run(command, args, cwd = fixture, env = {}) {
  return execFileSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    maxBuffer: 32 * 1024 * 1024,
  })
}

const names = [
  'core',
  'react',
  'plugin-ai-agents',
  'plugin-flow-builder',
  'plugin-hubtype-analytics',
  'cli',
  'dx',
  'dx-bundler-rspack',
  'eslint-config',
]
const archives = []
// Exercise the CLI's real prepack hook, including command discovery.
run('npm', ['run', 'prepack', '-w', '@botonic/cli'], root)
for (const name of names) {
  const [pack] = JSON.parse(
    run(
      'npm',
      ['pack', '--json', '--ignore-scripts', '--pack-destination', tarballs],
      join(root, 'packages', `botonic-${name}`)
    )
  )
  archives.push(join(tarballs, pack.filename))
  const files = pack.files.map(file => file.path)
  assert(
    !files.some(file => file.startsWith('lib/cjs/')),
    `${name}: stale CJS output`
  )
  if (name === 'cli') {
    assert(files.includes('oclif.manifest.json'))
    assert(!files.some(file => file.startsWith('lib/tests/')))
  } else if (!['dx', 'dx-bundler-rspack', 'eslint-config'].includes(name)) {
    for (const file of [
      'index.js',
      'index.d.ts',
      'index.js.map',
      'package.json',
    ]) {
      assert(files.includes(`lib/esm/${file}`), `${name}: missing ${file}`)
    }
  }
}

cpSync(join(root, 'examples/blank-typescript'), fixture, {
  recursive: true,
  filter: source =>
    !['node_modules', 'package-lock.json', 'dist'].includes(
      source.split('/').at(-1)
    ),
})
// Exercise the shipped application bundler, with the published ESM packages.
cpSync(
  join(root, 'packages/botonic-dx-bundler-rspack/baseline/rspack.config.ts'),
  join(fixture, 'rspack.config.ts')
)
writeFileSync(
  join(fixture, 'package.json'),
  JSON.stringify({ name: 'botonic-esm-consumer', private: true }, null, 2)
)
console.log(
  run('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    ...archives,
    'typescript@5.9.3',
  ])
)

writeFileSync(
  join(fixture, 'src/routes.tsx'),
  `import React from 'react'
import { Text } from '@botonic/react'
export const routes = [{ path: 'echo', text: /.*/, action: () => <Text>ESM build verified</Text> }]
`
)
// Prefer the fixture route over the empty route file from the template.
writeFileSync(
  join(fixture, 'src/routes.ts'),
  "export { routes } from './routes.tsx'\n"
)
writeFileSync(
  join(fixture, 'src/bot-config.ts'),
  'export const botConfig = { smokeTest: true }\n'
)
writeFileSync(
  join(fixture, 'rspack-entries/bot-config-entry.ts'),
  "export { botConfig } from '../src/bot-config'\n"
)

writeFileSync(
  join(fixture, 'consumer.mts'),
  `import { CoreBot } from '@botonic/core'
import { createTestBotRequest } from '@botonic/core/testing'
import { NodeApp, Text } from '@botonic/react'
import * as agents from '@botonic/plugin-ai-agents'
import * as flow from '@botonic/plugin-flow-builder'
import * as analytics from '@botonic/plugin-hubtype-analytics'
void [CoreBot, createTestBotRequest, NodeApp, Text, agents, flow, analytics]
`
)
for (const resolution of ['NodeNext', 'Bundler']) {
  console.log(
    run(process.execPath, [
      'node_modules/typescript/bin/tsc',
      '--noEmit',
      '--skipLibCheck',
      '--strict',
      '--target',
      'ES2020',
      '--module',
      resolution === 'NodeNext' ? 'NodeNext' : 'ESNext',
      '--moduleResolution',
      resolution,
      'consumer.mts',
    ])
  )
}
console.log(
  run(process.execPath, [
    '--input-type=module',
    '-e',
    `
  import assert from 'node:assert/strict';
  import { createRequire } from 'node:module';
  import * as core from '@botonic/core';
  import * as testing from '@botonic/core/testing';
  const require = createRequire(import.meta.url);
  assert.equal(core.CoreBot, require('@botonic/core').CoreBot);
  assert.equal(testing.createTestBotRequest, require('@botonic/core/testing').createTestBotRequest);
  await import('@botonic/plugin-ai-agents');
  await import('@botonic/plugin-hubtype-analytics');
  console.log('Installed ESM and synchronous require passed');
`,
  ])
)

const reactSource = join(fixture, 'node_modules/@botonic/react/src')
for (const file of readdirSync(join(reactSource, 'assets'))) {
  if (/\.(svg|png|d\.ts)$/.test(file)) {
    assert.deepEqual(
      readFileSync(join(reactSource, 'assets', file)),
      readFileSync(
        join(fixture, 'node_modules/@botonic/react/lib/esm/assets', file)
      )
    )
  }
}
for (const mode of ['development', 'production']) {
  const result = run(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    const { isProd } = await import('./node_modules/@botonic/plugin-ai-agents/lib/esm/constants.js');
    if (isProd !== (process.env.NODE_ENV === 'production')) throw Error('Environment was inlined');
  `,
    ],
    fixture,
    { NODE_ENV: mode }
  )
  assert.equal(result, '')
}

console.log(
  run(process.execPath, ['node_modules/@botonic/cli/bin/run.js', '--help'])
)
console.log(
  run(process.execPath, ['node_modules/@botonic/cli/bin/run.js', '--version'])
)
console.log(
  run(
    process.execPath,
    [
      'node_modules/@rspack/cli/bin/rspack.js',
      'build',
      '--env',
      'target=all',
      '--mode=production',
    ],
    fixture,
    { ENVIRONMENT: 'production', NODE_ENV: 'production' }
  )
)
for (const file of [
  'bot.js',
  'bot-config.js',
  'webchat.botonic.js',
  'webviews/webviews.js',
]) {
  assert(existsSync(join(fixture, 'dist', file)), `Missing UMD output: ${file}`)
}
console.log(
  run(process.execPath, [
    '--input-type=module',
    '-e',
    `
  import assert from 'node:assert/strict';
  import { createRequire } from 'node:module';
  import { createTestBotRequest } from '@botonic/core/testing';
  const require = createRequire(import.meta.url);
  const app = require('./dist/bot.js');
  const response = await app.input(createTestBotRequest({ input: { data: 'hello' } }));
  assert(JSON.stringify(response).includes('ESM build verified'));
  assert.equal(require('./dist/bot-config.js').smokeTest, true);
  console.log('Node UMD interaction passed');
`,
  ])
)
console.log(
  `Package and UMD checks passed. Browser fixture retained at ${fixture}`
)
