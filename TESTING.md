# Tests

Monorepo conventions: [AGENTS.md](AGENTS.md).

Core, React, AI Agents, Flow Builder, Hubtype Analytics and the CLI use Vitest
**4.1.11** with V8 coverage. Node >=22.19 and npm >=10 are required.

## Running tests

Install and build first: tests resolve other Botonic packages through their
published `lib` entries. The Vitest configuration does not alias them to source.

```sh
npm ci
npm run build

# All six packages, in dependency order.
npm test

# Only the five library packages, in order.
npm test -w @botonic/core &&
npm test -w @botonic/react &&
npm test -w @botonic/plugin-ai-agents &&
npm test -w @botonic/plugin-flow-builder &&
npm test -w @botonic/plugin-hubtype-analytics

# Filter by file/directory or test name.
npm test -w @botonic/core -- tests/routing
npm test -w @botonic/plugin-ai-agents -- -t 'RouterAgent'
npm test -w @botonic/cli -- tests/util
npm run test_ci -w @botonic/cli

# React without coverage; update snapshots after reviewing the differences.
npm run test:no-coverage -w @botonic/react
npm run updateSnapshot -w @botonic/react

# The same commands work from a package directory.
cd packages/botonic-core
npm test
```

Every `test` script enables coverage and writes `coverage/lcov.info`,
`coverage/coverage-summary.json` and `junit.xml` inside its package. These match
the existing CI artifact paths. Add `-- --update` to a package's test command
to update its snapshots, or `-- --reporter=default --reporter=junit
--reporter=json --outputFile.json=/tmp/results.json` to capture a machine-readable
test inventory alongside the usual reporters.

Each package fixes its own test root. Files run in isolation, Node is the default
environment, and React's existing DOM tests retain their individual `jsdom`
annotations and URLs. JSX in `.js` files uses the automatic React runtime.
Images use local stubs and styles use `identity-obj-proxy`, including resources
imported through built Botonic dependencies.

Use Vitest globals for tests and assertions, and explicitly import `vi` for mocks.
Partial ESM mocks use asynchronous `importOriginal`; values accessed by hoisted
factories use `vi.hoisted`. Constructor mocks must use named regular functions
so Biome does not rewrite them into non-constructable arrow functions. Tests
that change `isProd` register the scenario with `vi.doMock`, reset the module
registry and then import the consumer.

## TypeScript project for test files

Each package with tests keeps production sources in `tsconfig.json` (`include`:
`src/`) and test sources in `tsconfig.tests.json` (`include`: `src/**` and
`tests/**`). The CLI type-check uses the tests config explicitly:

```sh
npx tsc -p packages/botonic-<package>/tsconfig.tests.json --noEmit
```

The IDE does **not** pick up `tsconfig.tests.json` automatically when you open
a file under `tests/`. It walks up the directory tree looking for
`tsconfig.json`; if the nearest match only includes `src/`, the test file falls
into an inferred project with the wrong module resolution, which surfaces errors
such as `Cannot find module '@botonic/core'`.

Add a `tests/tsconfig.json` in every package that has a `tests/` tree and a
`tsconfig.tests.json` at the package root. It extends the tests config and sets
`noEmit` so the language service type-checks without writing output:

```json
{
  "extends": "../tsconfig.tests.json",
  "compilerOptions": {
    "noEmit": true
  }
}
```

`noEmit` does not suppress type errors; it only prevents emitting JavaScript.
The fix is project association, not hiding diagnostics. After adding or changing
this file, restart the TypeScript server (or reload the window).

Packages that follow this layout: Core, React, AI Agents, Flow Builder, Hubtype
Analytics and the CLI.

## Package-specific conventions

- **AI Agents**: Vitest mock patterns for `@openai/agents` are documented in
  [`packages/botonic-plugin-ai-agents/.cursor/rules/mock-patterns.md`](packages/botonic-plugin-ai-agents/.cursor/rules/mock-patterns.md).
- **CLI**: Command tests use isolated forked processes because commands change
  `process.cwd()`. Integration tests download the published blank example, run
  real `npm install` and `npm run build`, and require npm registry access.
  `npm test -w @botonic/cli -- tests/util` runs only the local utility tests.
