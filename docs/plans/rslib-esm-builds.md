# Rslib 1.0.0 and ESM-only packages

## Goal

Build core, React, the three plugins and the CLI with exactly `@rslib/core@1.0.0`.
Publish unbundled ESM JavaScript, declarations and source maps. Keep the application
bundler's UMD outputs for browser development, production webchat/webviews and Node.
The configuration-only packages continue to ship without compilation.

## Implementation

- Share build configuration with small per-package configs. Keep ES2020 for
  libraries, ES2022 for the CLI, `lib/esm` for libraries and `lib/src` for the CLI.
- Preserve `.js` and `.d.ts` extensions and mark `lib/esm` as a module scope.
- Resolve workspace dependencies through their built package entries; do not
  publish aliases pointing at workspace sources.
- Preserve runtime environment variables, React JSX behavior, resource imports,
  static files and ambient declarations. Support resources in watch mode.
- Point package metadata and core's testing subpath at ESM. Stop emitting CJS.
- Build dependencies before their consumers and remove duplicate publish steps.
- Preserve the CLI launcher and oclif command discovery; exclude tests from output.
- Update CI and validate installed tarballs independently of workspace links.

## Compatibility

Removing `lib/cjs` is a breaking change. Consumers must use public package imports
or migrate deep imports to `lib/esm`. Node >=22.19.0 remains required. Modern Node
can require synchronous ESM, but default exports are namespace `.default` members;
top-level await anywhere in the dependency graph prevents synchronous require.
Do not change the browser globals or the runtime contract of the UMD bot outputs.
External customers must validate their tooling before upgrading.

## Validation and delivery

Run clean installation, all six builds and existing test suites; validate package
contents, ESM and compatible require imports, NodeNext/Bundler declarations, CLI
help/version/manifest, environment evaluation and watch updates. Exercise a bot
in browser development and production browser/Node outputs, including an
interaction. Record actual results and any limitations below. Open a PR against
master, marking it draft if required integration validation remains blocked.
Do not publish packages or deploy bots.

## Results

- The original six TypeScript builds passed before migration. All six Rslib
  builds pass with ESM output and declarations. Config files use `.mts` to avoid
  ambiguous module interpretation while preserving existing CommonJS configs.
- Existing suites executed successfully: core 120, React 430 (3 skipped),
  AI agents 123, Flow Builder 278, analytics 27, CLI 46 tests (1,024 passed).
  The CLI logout test now isolates credential paths in a temporary directory.
- Installed tarball checks passed for NodeNext/Bundler type resolution, core
  ESM/require identity, CLI help/version and runtime environment variables.
  Real ESM loading exposed type re-exports that needed `export type`; build
  configs now enforce `isolatedModules` to prevent regressions.
- Production UMD builds and a simulated Node interaction passed after correcting
  those exports. Development UMD compilation also passed.
- Browser navigation to the local development server was denied by the browser
  permission policy. Conversation, rendered resources and hot reload in the
  browser remain unverified. No alternative browser access was attempted.
- Final clean-install/tarball rerun and watch verification remain pending at the
  time the draft PR is opened for review. No packages were published or bots
  deployed.
