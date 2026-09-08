# Rslib 1.0.0 and ESM-only packages

## Goal and scope

Build core, React, the three plugins and the CLI with exactly `@rslib/core@1.0.0`.
Publish unbundled ESM JavaScript, declarations and source maps. Keep the application
bundler's UMD outputs for browser development, production webchat/webviews and Node.
The configuration-only packages continue to ship without compilation.

The correction plan supplied for PR #3270 supersedes the original migration plan.
Work stays on `codex/rslib-esm-builds`, targeting `master`, in the same draft PR.
No package publication, bot deployment or protection-rule changes are included.

## Original migration

- Small per-package `.mts` configs use the existing shared Rslib configuration.
  Libraries target ES2020 and `lib/esm`; the CLI targets ES2022 and `lib/src`.
- Preserve `.js`, `.d.ts`, maps, resource imports, static files, ambient declarations,
  runtime environment variables and CLI command discovery. Exclude CLI tests.
- Resolve workspace dependencies through built entries, without published source aliases.
- Build dependencies before consumers. Explicit type re-exports avoid nonexistent
  runtime exports under SWC/isolated modules.

## Correction plan and implementation

1. Correct the published contract below. Keep the nested ESM module marker and
   shipped `src/**`; do not expand exports or change package-root module types.
2. Separate synthetic contract checks from integration with `blank-typescript`.
   Preserve the example manifest's scripts and dependencies; replace existing
   Botonic versions with tarball references and override transitive Botonic packages.
   Only the synthetic consumer directly depends on all six compiled packages.
3. Use normal `npm pack`, exercising CLI prepack/build/manifest and postpack cleanup.
   Check build prerequisites separately: `prepublishOnly` does not run during pack.
   Obtain the Rspack configuration from the installed bundler tarball, never the checkout.
4. Check ESM/require identity for core, testing, AI Agents and analytics, including
   default class names; check the CLI's public `run` entry and executable help/version.
   Bundle and execute retained React and Flow Builder exports with asset handling.
5. Check NodeNext and Bundler declarations with strict checking and no `skipLibCheck`.
   Install the consumer's React, Node, styled-components, router and other type packages.
   These checks exposed two Botonic declaration problems, now fixed: Pusher 5's CJS
   default resolves as a namespace under NodeNext (use its named Runtime constructor
   type), and `DevApp.render` returned void while its base returns Promise<void>
   (make the override async, matching the base's scheduling semantics).
6. Verify every installed Botonic package against the tarball path in its lockfile,
   reject checkout symlinks/absolute emitted imports, check nested module markers,
   and compare copied React resources. Retain the Node UMD interaction and bot config
   checks. Browser-target outputs are compilation checks only.
7. Smoke-test watch in a temporary copy: change a TS literal and SVG and wait for
   updated JavaScript, declarations and copied SVG; terminate the watcher. This is
   **not** a test of HMR.
8. Run all six Jest suites on every `pull_request`, including forks, with no path
   filter so shared manifests/configuration/lockfile changes cannot bypass tests.
   Retain package-specific push and manual triggers. Tests have read-only repository
   permissions and no inherited secrets. Upload reports as artifacts; a separate
   `workflow_run` workflow publishes reports/coverage for branch runs only and never
   executes PR code. It becomes active after its file reaches the default branch.
9. Logout tests create fake credentials in their temporary directory and assert real
   deletion, plus successful logout when the file is absent. Reads/writes are mocked;
   deletion is not.

## Published compatibility contract

Removing `lib/cjs` is a breaking change. Node >=22.19.0 remains required.
Core supports **only** `@botonic/core` and `@botonic/core/testing`; its exports map
blocks deep paths, including `@botonic/core/lib/esm/*`. Migrate to those public entries.

React and Flow Builder's current entries require a bundler that handles SVG and
other resources. Direct Node import is not promised. Existing React/plugin deep
paths remain governed by their existing package layout; no new exports maps or
uniform deep-import policy are introduced here. Keep `src/**` because the application
bundler still loads HTML templates from it.

All five libraries ship `lib/esm/package.json` with `"type": "module"`, verified in
the installed tarballs. Root module types remain unchanged; the CLI was already ESM.

Modern Node can synchronously require this ESM graph, returning a module namespace.
Use `require('@botonic/plugin-ai-agents').default` and similarly for analytics.
Top-level await in a dependency graph would prevent synchronous require. No
compatibility wrappers are added. Default-import behavior was compared with fresh
TypeScript CJS artifacts from pre-migration commit
`d15d0d99d82140683d946dcffa4c615ae109e25f` (the merge base):

- AI Agents and analytics: loading the old CJS artifacts returned an object with
  `.default` named `BotonicPluginAiAgents` / `BotonicPluginHubtypeAnalytics`.
  The new ESM namespaces expose the same class names and identical constructors
  through ESM import and require. `.default` was already necessary for old CJS.
- Flow Builder: the old emitted CJS entry explicitly assigned
  `exports.default = BotonicPluginFlowBuilder`. The new default class is instantiated
  and used in the bundled runtime consumer. This is not a direct-Node import claim.
- React has no default export in the old CJS entry; consumers use named exports.
  Core/testing and the CLI retain their named public entries.

To reproduce the old-artifact comparison, extract that commit with `git archive`
into a temporary directory, make the installed root dependencies available there,
then run `tsc -p tsconfig.json` in core, React, AI Agents, Flow Builder and analytics
in that order. Inspect `lib/cjs/index.js` and load the two resource-free plugin
entries with Node. This comparison does not claim a historical registry-tarball test.

## Reproducible final validation

```sh
npm ci
npm run build
for pkg in core react plugin-ai-agents plugin-flow-builder plugin-hubtype-analytics cli; do
  npm run test -w "@botonic/$pkg" -- --runInBand
done
npm run test:packages
```

`test:packages` creates new temporary tarballs and two new consumer installations,
then runs all contract, types, resource, CLI, UMD and watch checks described above.
It logs the retained fixture path. Run with registry/cache access: the CLI suites
also install temporary example bots. No manually edited build artifacts are reused.

Local clean sequence passed on 2026-09-08 with Node 22.22.0, npm 11.10.0 and
Rslib 1.0.0. Fresh `npm ci` and all six builds completed successfully, followed by:

| Package | Suites passed | Tests passed | Skipped |
| --- | ---: | ---: | ---: |
| core | 9 | 120 | 0 |
| React | 42 | 430 | 3 |
| AI Agents | 10 | 123 | 0 |
| Flow Builder | 43 | 278 | 0 |
| analytics | 16 | 27 | 0 |
| CLI | 6 | 47 | 0 |
| Total | 126 | 1,025 | 3 |

The final harness passed normal pack hooks, both fresh installations, tarball
provenance/module scopes/resources, strict NodeNext and Bundler declarations,
ESM/require identity, CLI public entry/help/version, runtime environment checks,
bundled React/Flow Builder execution, production UMD compilation, simulated Node
interaction and bot config, development compilation, and the temporary watch smoke.
No third-party declaration errors remain in these consumer checks. Rspack emitted
browser bundle-size recommendations; dependency deprecation warnings also remain.

All six package lint commands exited successfully (existing warning-level findings
remain). Workflow YAML parsing, reusable input names and report-trigger names were
checked locally. GitHub-hosted runs are separate evidence, not implied by local success.
The first hosted run failed before build: Node's bundled npm 10 rejected missing
optional peer dependencies in the existing lockfile, whereas local npm 11.10.0
completed the clean sequence. The package workflows now explicitly install npm
11.10.0 to match the user's local toolchain. Pre-commit also identified formatting
in the six build tsconfigs, now corrected without changing their values. Hosted
rerun results are pending. No npm 10 lockfile regeneration was performed.
The initial sandboxed CLI suite failed to reach the registry (`ENOTFOUND`); the final
clean sequence with registry access passed. Previous migration results are historical
and are not used as evidence for this revision.

Local evidence for this run: `/tmp/botonic-final-ci.log`,
`/tmp/botonic-final-build.log`, `/tmp/botonic-final-test-<package>.log` and
`/tmp/botonic-final-packages.log`. These are local temporary logs, not repository
artifacts. The final consumer fixture is `botonic-esm-DygQKy` under the system temp
directory; rerunning the commands creates a new independent fixture.

## Required checks and delivery

Read-only GitHub API review on 2026-09-08 found no classic branch protection on
`master` (404: Branch not protected). Effective ruleset 16126606 requires one PR
approval and prevents non-fast-forward updates, but lists no required status checks.
An administrator should consider requiring the six all-packages Jest job checks and
`published-packages` once their final check names are visible in Actions. No rules
were changed. Tests must not depend on report publication or Codecov credentials.

Keep PR #3270 in draft until the user publishes an alpha and tests a real bot:

- Clean installation of the alpha, verifying the resolved Botonic versions.
- Local browser conversation, rendered resources and webviews.
- Reload after source/resource changes, including browser HMR behavior.
- Production webchat/webviews in the browser and server outputs in Node/Lambda.

**Browser validation remains blocked/unverified:** the earlier attempt to navigate
to the local server was denied by browser permissions. Neither compilation nor the
simulated Node interaction makes that test pass. No browser success is claimed.
No packages have been published and no bots deployed by this work.

After receiving alpha results, fix observed failures first. Defer shared tsconfig
refactoring, a single package graph and uniform exports/subpath policy until then.
