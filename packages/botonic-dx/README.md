# Botonic CI (continuous integration)

## What Does This Package Do?

This package simplifies the configuration of all CI tasks for projects which use botonic.

### Features

* eslint
* typescript type checking


## Setup

* Install this package
```
npm install -D @botonic/dx
```
* Copy the contents of the `sample-config` folder to the root of your project 
  (Merge this package.json's scripts into your project ones)
* These files just import the configuration maintained within this project. 
  To adapt them to your project needs, you just need to patch the specific options after importing the baseline.
  See instructions on each of these files.


## Usage

### eslint

For a project to use our proposed [eslint](https://eslint.org/) configuration, you'll need to:
* Add the scripts starting with `lint` from sample-config/package.json to your package.json.
* `npm run lint` will now perform a quick check which will also fix some of the detected issues. 
* `npm run lint-ci` will perform a slower check which detects more issues. It will not fix any issue,
since it's designed to be integrated into your CI pipeline.

Please check the [eslint user guide](https://eslint.org/docs/user-guide/) for adapting this configuration to your needs.

### Typescript

In case your project uses typescript (or contains .d.ts files), add the scripts starting with 
`build` from sample-config/package.json to your package.json
* `npm run build` will transpile into JS.
* `npm run build-ci` will validate your project source code and tests using your tsconfig.test.json configuration
```    
```

## Implementation details
Depends on @botonic/eslint-config. As per the
[official documentation](https://eslint.org/docs/developer-guide/shareable-configs),
the eslint plugins are configured there as peer dependencies.
This is why they appear here again as dependencies, but with free version (*),
to avoid duplicating the version specification.

## Dependencies
@types/node must be a direct dependency. If only defined in a parent package.json, we get TSC errors for
symbols from these libs: "ES2016.Array.Include", "ES2017.object"
