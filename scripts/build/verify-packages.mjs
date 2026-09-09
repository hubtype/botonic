import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
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
// npm pack does not run prepublishOnly: require completed builds first.
for (const name of names.slice(0, 6)) {
  const directory = join(root, 'packages', `botonic-${name}`)
  const manifest = JSON.parse(readFileSync(join(directory, 'package.json')))
  assert(
    existsSync(join(directory, manifest.main)),
    `${name}: run npm run build first`
  )
}
const references = {}
for (const name of names) {
  const output = run(
    'npm',
    ['pack', '--json', '--pack-destination', tarballs],
    join(root, 'packages', `botonic-${name}`)
  )
  // Lifecycle scripts may print before npm's JSON result.
  const [pack] = JSON.parse(output.slice(output.lastIndexOf('\n[') + 1))
  references[`@botonic/${name}`] = `file:${join(tarballs, pack.filename)}`
  const files = pack.files.map(file => file.path)
  assert(
    !files.some(file => /^lib\/(cjs|esm|src)\//.test(file)),
    `${name}: stale output directory`
  )
  if (name === 'cli') {
    for (const file of ['index.js', 'index.d.ts', 'index.js.map']) {
      assert(files.includes(`lib/${file}`), `${name}: missing ${file}`)
    }
    assert(files.includes('oclif.manifest.json'))
    assert(
      !existsSync(join(root, 'packages/botonic-cli/oclif.manifest.json')),
      'CLI postpack did not clean manifest'
    )
    assert(!files.some(file => file.startsWith('lib/tests/')))
  } else if (!['dx', 'dx-bundler-rspack', 'eslint-config'].includes(name)) {
    assert(
      files.some(file => file.startsWith('src/')),
      `${name}: missing shipped sources`
    )
    for (const file of [
      'index.js',
      'index.d.ts',
      'index.js.map',
      'package.json',
    ]) {
      assert(files.includes(`lib/${file}`), `${name}: missing ${file}`)
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
// Integration keeps the example's scripts and dependency graph. Only replace
// existing Botonic references; transitive packages are selected with overrides.
const example = JSON.parse(readFileSync(join(fixture, 'package.json')))
example.overrides = references
for (const group of ['dependencies', 'devDependencies']) {
  for (const name of Object.keys(example[group] || {})) {
    if (references[name]) example[group][name] = references[name]
  }
}
writeFileSync(join(fixture, 'package.json'), JSON.stringify(example, null, 2))
console.log(run('npm', ['install', '--no-audit', '--no-fund']))
cpSync(
  join(
    fixture,
    'node_modules/@botonic/dx-bundler-rspack/baseline/rspack.config.ts'
  ),
  join(fixture, 'rspack.config.ts')
)

// Synthetic contract consumer intentionally depends on all compiled packages.
const integration = fixture
const contract = join(fixture, 'contract')
mkdirSync(contract)
writeFileSync(
  join(contract, 'package.json'),
  JSON.stringify(
    {
      private: true,
      dependencies: Object.fromEntries(
        names
          .slice(0, 6)
          .map(name => [`@botonic/${name}`, references[`@botonic/${name}`]])
      ),
      overrides: references,
      devDependencies: {
        typescript: '5.9.3',
        '@types/node': '^22.0.0',
        '@types/react': '^18.3.18',
        '@types/react-dom': '^18.3.5',
        '@types/styled-components': '^5.1.34',
        '@types/uuid': '^10.0.0',
        '@types/lodash.merge': '^4.6.9',
        '@types/ua-parser-js': '^0.7.39',
        '@types/react-router-dom': '^5.3.3',
      },
    },
    null,
    2
  )
)
console.log(run('npm', ['install', '--no-audit', '--no-fund'], contract))

function verifyInstalled(directory) {
  const lock = JSON.parse(readFileSync(join(directory, 'package-lock.json')))
  for (const [path, pkg] of Object.entries(lock.packages)) {
    const name = path.split('node_modules/').at(-1)
    if (!name.startsWith('@botonic/')) continue
    assert(references[name], `Unexpected Botonic package: ${name}`)
    assert.equal(
      realpathSync(resolve(directory, pkg.resolved.replace(/^file:/, ''))),
      realpathSync(references[name].slice(5)),
      `${path}: wrong tarball`
    )
    const installed = join(directory, path)
    assert(!realpathSync(installed).startsWith(root), `${path}: checkout link`)
    if (names.slice(0, 5).some(short => name === `@botonic/${short}`)) {
      assert.equal(
        JSON.parse(readFileSync(join(installed, 'lib/package.json'))).type,
        'module'
      )
    }
    if (existsSync(join(installed, 'lib'))) {
      for (const file of readdirSync(join(installed, 'lib'), {
        recursive: true,
      })) {
        if (!/\.(js|d\.ts)$/.test(file)) continue
        const contents = readFileSync(join(installed, 'lib', file), 'utf8')
        assert(!contents.includes(root), `${name}/${file}: checkout reference`)
        for (const match of contents.matchAll(
          /(?:from\s*|import\s*|require\s*\()(['"])([^'"]+)\1/g
        )) {
          assert(
            !match[2].startsWith('file:') && !match[2].startsWith('/'),
            `${name}/${file}: absolute import`
          )
        }
      }
    }
  }
}
verifyInstalled(integration)
verifyInstalled(contract)

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
  join(contract, 'consumer.mts'),
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
    run(
      process.execPath,
      [
        'node_modules/typescript/bin/tsc',
        '--noEmit',
        '--strict',
        '--target',
        'ES2020',
        '--module',
        resolution === 'NodeNext' ? 'NodeNext' : 'ESNext',
        '--moduleResolution',
        resolution,
        'consumer.mts',
      ],
      contract
    )
  )
  console.log(`${resolution} declarations passed without skipLibCheck`)
}

console.log(
  run(
    process.execPath,
    [
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
  for (const [name, className] of [
    ['plugin-ai-agents', 'BotonicPluginAiAgents'],
    ['plugin-hubtype-analytics', 'BotonicPluginHubtypeAnalytics'],
  ]) {
    const esm = await import('@botonic/' + name);
    assert.equal(typeof esm.default, 'function');
    assert.equal(esm.default.name, className);
    assert.equal(esm.default, require('@botonic/' + name).default);
  }
  assert.equal(typeof (await import('@botonic/cli')).run, 'function');
  for (const name of ['core', 'core/testing', 'react', 'plugin-ai-agents', 'plugin-flow-builder', 'plugin-hubtype-analytics', 'cli']) {
    assert(require.resolve('@botonic/' + name).startsWith(process.cwd() + '/node_modules/'));
  }
  assert.throws(() => require('@botonic/core/lib/index.js'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
  assert.throws(() => require('@botonic/core/lib/esm/index.js'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
  console.log('Installed ESM and synchronous require passed');
`,
    ],
    contract
  )
)

const reactSource = join(contract, 'node_modules/@botonic/react/src')
for (const file of readdirSync(join(reactSource, 'assets'))) {
  if (/\.(svg|png|d\.ts)$/.test(file)) {
    assert.deepEqual(
      readFileSync(join(reactSource, 'assets', file)),
      readFileSync(
        join(contract, 'node_modules/@botonic/react/lib/assets', file)
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
    const { isProd } = await import('./node_modules/@botonic/plugin-ai-agents/lib/constants.js');
    if (isProd !== (process.env.NODE_ENV === 'production')) throw Error('Environment was inlined');
  `,
    ],
    contract,
    { NODE_ENV: mode }
  )
  assert.equal(result, '')
}

console.log(
  run(
    process.execPath,
    ['node_modules/@botonic/cli/bin/run.js', '--help'],
    contract
  )
)
console.log(
  run(process.execPath, ['node_modules/.bin/botonic', '--version'], contract)
)
// Execute retained React and Flow Builder exports with resource handling in Node.
writeFileSync(
  join(contract, 'bundled-consumer.mjs'),
  `
import assert from 'node:assert/strict'
import React from 'react'
import { NodeApp, Text } from '@botonic/react'
import FlowBuilder from '@botonic/plugin-flow-builder'
const plugin = new FlowBuilder({ getAccessToken: () => 'synthetic-token' })
assert.equal(typeof plugin.pre, 'function')
assert.equal(plugin.getPayloadParams('payload') instanceof Object, true)
assert.equal(React.createElement(Text, {}, 'contract').type, Text)
assert.equal(typeof NodeApp, 'function')
console.log('Bundled React/Flow Builder runtime passed')
`
)
writeFileSync(
  join(fixture, 'contract.rspack.config.cjs'),
  `
module.exports = {
  mode: 'development', target: 'node',
  entry: ${JSON.stringify(join(contract, 'bundled-consumer.mjs'))},
  output: { path: ${JSON.stringify(join(contract, 'dist'))}, filename: 'consumer.cjs', publicPath: '' },
  optimization: { minimize: false, usedExports: false, sideEffects: false },
  module: { rules: [
    { test: /\\.(svg|png|jpe?g|gif)$/, type: 'asset/resource' },
    { test: /\\.(scss|css)$/, use: 'null-loader' },
  ] },
}
`
)
console.log(
  run(process.execPath, [
    'node_modules/@rspack/cli/bin/rspack.js',
    'build',
    '--config',
    'contract.rspack.config.cjs',
  ])
)
console.log(run(process.execPath, ['dist/consumer.cjs'], contract))
console.log(run('npm', ['run', 'build']))
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
  run(
    process.execPath,
    [
      'node_modules/@rspack/cli/bin/rspack.js',
      'build',
      '--env',
      'target=dev',
      '--mode=development',
    ],
    fixture,
    { ENVIRONMENT: 'local', NODE_ENV: 'development' }
  )
)
console.log(
  `Contract and Node UMD runtime passed; webchat/webviews and dev are compilation-only checks. Fixture: ${fixture}`
)

console.log(run(process.execPath, ['scripts/build/verify-watch.mjs'], root))
console.log(run(process.execPath, ['scripts/build/verify-clean.mjs'], root))
