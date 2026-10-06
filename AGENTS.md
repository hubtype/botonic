# Botonic — Agent guide

Botonic is an **npm workspaces monorepo** for building conversational apps with React. Node **>=22.19** and npm **>=10** are required.

This document is the single source of truth for monorepo conventions. It covers the six packages on the Vitest + Rslib stack: **core**, **react**, **ai-agents**, **flow-builder**, **hubtype-analytics** and **cli**.

## Quick start

```sh
npm ci
npm run build
npm test -w @botonic/<package>   # package you changed
```

Tests resolve `@botonic/*` dependencies through compiled **`lib/`** output, not
`src/`. Always build before running tests.

## Root scripts

- `npm run build` — core → react → ai-agents → flow-builder → hubtype-analytics → cli
- `npm test` — the same six packages, in dependency order
- `npm run lint:check -w @botonic/<package>` — lint a single workspace package

## Repository

- The default branch is `master`.

## Monorepo structure

All packages live in `packages/`:

```
packages/
├── botonic-cli/                    # CLI to create, serve and deploy bots
├── botonic-core/                   # Framework core (no @botonic dependencies)
├── botonic-react/                  # React components (depends on @botonic/core)
├── botonic-plugin-ai-agents/
├── botonic-plugin-flow-builder/
└── botonic-plugin-hubtype-analytics/
```

## Package dependencies

- **@botonic/core**: Base package, no dependencies on other `@botonic/*`
- **@botonic/react**: Depends on `@botonic/core`
- **@botonic/plugin-flow-builder**: Depends on `@botonic/react`
- Plugins (ai-agents, hubtype-analytics): Depend on `@botonic/core`

When adding dependencies, respect this graph to avoid cycles.

**Shared types**: Types used in more than one package must be declared in
`@botonic/core` and exported from there, so other packages import them from a
single source of truth.

## Standard package structure

```
packages/<package-name>/
├── src/                  # TypeScript/TSX source code
├── lib/                  # Compiled ESM JavaScript, declarations and source maps
├── tests/                # Vitest tests (when the package has tests)
├── package.json
├── tsconfig.json         # Development type checking (no emit, src/)
├── tsconfig.build.json   # Rslib declaration/build settings
├── tsconfig.tests.json   # Type checking for src/ and tests/ (when present)
└── README.md
```

## Build

- Core, React, the three plugins and CLI compile to **ESM** with Rslib.
- Standard script: `rslib build --no-env`; watch adds `--watch`.
- Output: `lib/`; Rslib cleans it before building (`output.cleanDistPath: true`).
- `package.json`: `main` and `module` (where present) → `./lib/index.js`.
- Configuration-only packages ship without compilation.

## TypeScript configuration

- Development configs extend `tsconfig.base.json` with `noEmit: true`.
- Libraries use ESNext/Bundler; CLI development uses NodeNext.
- `tsconfig.build.json` uses ESNext/Bundler, `rootDir: "src"`, `outDir: "lib"`
  and enables declarations/emission.
- Packages with tests use `tsconfig.tests.json` at the package root and
  `tests/tsconfig.json` extending it so the IDE type-checks test files
  correctly. See [TESTING.md](TESTING.md#typescript-project-for-test-files).
- Workspace paths at root: `@botonic/core` and `@botonic/react` point to
  `./packages/*/src`

## Linting and formatting

- **Biome** for lint and format
- All packages must pass lint and format checks
- Lint and format must run **without errors** before considering development complete
- Config in `biome.json` (root); `packages/botonic-react` has overrides for React

## Testing

- Packages with a `test` script use **Vitest** 4.1.11; root `npm test` runs
  Core, React, the three plugins and the CLI in dependency order
- When adding or modifying a feature in a tested package, add or update tests
  for the use case
- Test file names must end with `test.ts` or `test.tsx`
- All tested packages must pass before considering development complete
- Shared config lives in `scripts/testing/`; each tested package has
  `vitest.config.ts`
- Run `npm ci && npm run build` before tests; packages resolve through compiled
  `lib/` entries
- Tests in `tests/`, with structure similar to `src/`
- Use Vitest globals; import `vi` explicitly for mocks. See
  [TESTING.md](TESTING.md) for commands, snapshots and conventions

## Code conventions

1. **Imports**: Sort imports (Biome `organizeImports: on`)
2. **Types**: Use `import type` when importing types only
3. Avoid `any`, prefer explicit types

## Adding or modifying packages

1. Create folder in `packages/<name>/`
2. Add `package.json` with `name: "@botonic/<name>"`
3. When creating a new package, start with a version equal to the current minor
   version of `@botonic/core`
4. Create `tsconfig.json` and `tsconfig.build.json` if it compiles TS
5. If the package has tests, add `tsconfig.tests.json` and `tests/tsconfig.json`
   (see [TESTING.md](TESTING.md#typescript-project-for-test-files))
6. Include scripts: `build`, `test`, `lint`, `lint:check`, `format`
7. Add `engines: { "node": ">=22.19.0", "npm": ">=10.0.0" }`

## Definition of done

Before marking work complete:

- Build passes for affected packages
- Tests pass for affected packages (`npm test -w @botonic/<package>`)
- `lint:check` passes without errors on modified packages
- Changes stay scoped to the requested task; avoid unrelated edits
- Do not create commits or pull requests unless explicitly asked

## Common pitfalls

- Do not run tests without `npm run build` first — packages resolve via `lib/`,
  not source aliases
- Do not assume every package under `packages/` uses Vitest or Rslib yet
- Constructor mocks must use **named regular functions**, not arrow functions
  (Biome rewrites arrows into non-constructable mocks)
- Import `vi` explicitly; do not rely on implicit mock globals
- Put shared types in `@botonic/core`, not in individual plugins
- New packages with tests need both `tsconfig.tests.json` and
  `tests/tsconfig.json` for correct IDE type-checking

## Further reading

| Topic | Location |
| --- | --- |
| Running and writing tests | [TESTING.md](TESTING.md) |
| AI Agents Vitest mock patterns | [packages/botonic-plugin-ai-agents/.cursor/rules/mock-patterns.md](packages/botonic-plugin-ai-agents/.cursor/rules/mock-patterns.md) |
| React Biome overrides | [packages/botonic-react/.cursor/rules/biome-config.md](packages/botonic-react/.cursor/rules/biome-config.md) |
| React component display names | [packages/botonic-react/.cursor/rules/component-display-name.md](packages/botonic-react/.cursor/rules/component-display-name.md) |
| Human contribution process | [CONTRIBUTING.md](CONTRIBUTING.md) |
