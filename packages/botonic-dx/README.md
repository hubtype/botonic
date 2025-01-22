# Botonic CI (continuous integration)

## What Does This Package Do?

This package simplifies the configuration of all CI tasks for projects which use botonic.

### Features

- eslint
- typescript type checking

## Setup

- Install this package

```
npm install -D @botonic/dx
```

- Copy the contents of the `sample-config` folder to the root of your project
  (Merge this package.json's scripts into your project ones)
- The files at `sample-config` just import the configuration maintained within this project.
  To adapt them to your project needs, you just need to patch the specific options after importing the baseline.
  See instructions on each of these files.

### package.json

Instructions here because it cannot contain comments

- Even if you don't plan to publish your package, it's important to correctly configure the "files" field.
  Otherwise, you may get the node/no-unpublished-import
  eslint error when importing a dev dependency from a test or a configuration file
  (remove --cache from eslint command after updating your package.json).

## Usage

### eslint

For a project to use our proposed [eslint](https://eslint.org/) configuration, you'll need to:

- Add the scripts starting with `lint` from sample-config/package.json to your package.json.
- `npm run lint` will now perform a quick check which will also fix some of the detected issues.
- `npm run lint-ci` will perform a slower check which detects more issues. It will not fix any issue,
  since it's designed to be integrated into your CI pipeline.

Due to an [eslint_d issue](https://github.com/mantoni/eslint_d.js/issues/157), `--fix --quiet` does not autofix issues.

Please check the [eslint user guide](https://eslint.org/docs/user-guide/) for adapting this configuration to your needs.

### Typescript

In case your project uses typescript (or contains .d.ts files), add the scripts starting with
`build` from sample-config/package.json to your package.json

- `npm run build` will transpile into JS.
- `npm run build-ci` will validate your project source code and tests using your tsconfig.test.json configuration

## Implementation details

Depends on @botonic/eslint-config. As per the
[official documentation](https://eslint.org/docs/developer-guide/shareable-configs),
the eslint plugins are configured there as peer dependencies.

## Version

Due to a [npm bug](https://github.com/npm/cli/issues/2010), `npm version` interaction with git
(check clean stage, commit and create tag) is broken. Hence, sample-config manually checks that
there are no modifications in git files.
