# Botonic Project Rules — Packages

## Repository

- The default branch is `master`.

## Monorepo Structure

Botonic is an **npm workspaces monorepo**. All packages live in `packages/`:

```
packages/
├── botonic-cli/           # CLI to create, serve and deploy bots
├── botonic-core/         # Framework core (no @botonic dependencies)
├── botonic-react/        # React components (depends on @botonic/core)
├── botonic-dx/           # Dev experience, bundlers
├── botonic-dx-bundler-rspack/
├── botonic-dx-bundler-webpack/
├── botonic-eslint-config/
├── botonic-plugin-ai-agents/
├── botonic-plugin-flow-builder/
├── botonic-plugin-hubtype-analytics/
├── botonic-plugin-knowledge-bases/
```

## Package Dependencies

- **@botonic/core**: Base package, no dependencies on other `@botonic/*`
- **@botonic/react**: Depends on `@botonic/core`
- **@botonic/plugin-flow-builder**: Depends on `@botonic/react`
- Plugins (ai-agents, hubtype-analytics, knowledge-bases): Depend on `@botonic/core`
- **@botonic/dx**: Depends on `@botonic/dx-bundler-rspack` and `@botonic/eslint-config`

When adding dependencies, respect this graph to avoid cycles.

**Shared types**: Types used in more than one package must be declared in `@botonic/core` and exported from there, so other packages import them from a single source of truth.

## Standard Package Structure

```
packages/<package-name>/
├── src/                  # TypeScript/TSX source code
├── lib/                  # Compiled ESM JavaScript, declarations and source maps
├── tests/                # Jest tests
├── package.json
├── tsconfig.json         # Development type checking (no emit)
├── tsconfig.build.json   # Rslib declaration/build settings
└── README.md
```

## Build

- Core, React, the three plugins and CLI compile to **ESM** with Rslib.
- Standard script: `rslib build --no-env`; watch adds `--watch`.
- Output: `lib/`; Rslib cleans it before building (`output.cleanDistPath: true`).
- `package.json`: `main` and `module` (where present) → `./lib/index.js`.
- Configuration-only packages ship without compilation.

## TypeScript Configuration

- Development configs extend `../../tsconfig.base.json` with `noEmit: true`.
- Libraries use ESNext/Bundler; CLI development uses NodeNext.
- `tsconfig.build.json` uses ESNext/Bundler, `rootDir: "src"`, `outDir: "lib"` and enables declarations/emission.
- CommonJS Jest settings belong in test configs; CLI tests remain ESM.
- Workspace paths at root: `@botonic/core` and `@botonic/react` point to `./packages/*/src`

## Linting and Formatting

- **Biome** for lint and format
- All packages must pass lint and format checks
- Lint and format must run **without errors** before considering development complete
- Config in `biome.json` (root); `packages/botonic-react` has overrides for React

## Testing

- When adding or modifying a feature, tests must be added to cover the use case
- Each package has a `tests/` folder with all test files
- Test file names must end with `test.ts` or `test.tsx`
- All packages must pass tests before considering development complete
- **Jest** with `jest.config.js` or `jest.config.cjs` per package
- Tests in `tests/`, with structure similar to `src/`
- Use `__mocks__/` for shared mocks within the package

## Code Conventions

1. **Imports**: Sort imports (Biome `organizeImports: on`)
2. **Types**: Use `import type` when importing types only
3. Avoid `any`, prefer explicit types

## Adding/Modifying Packages

1. Create folder in `packages/<name>/`
2. Add `package.json` with `name: "@botonic/<name>"`
3. When creating a new package, start with a version equal to the current minor version of `@botonic/core`
4. Create `tsconfig.json` and `tsconfig.build.json` if it compiles TS
5. Include scripts: `build`, `test`, `lint`, `lint:check`, `format`
6. Add `engines: { "node": ">=22.19.0", "npm": ">=10.0.0" }`
