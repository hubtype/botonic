# Botonic Migration Guide

## Version 0.8 to 0.9

Botonic v0.9 introduces some changes that are **not backwards compatible**. These changes are not very difficult to apply (you'll only need to change 3 files), but they're important as they affect the entry point of your project.

### TL;DR

1. Rename `src/app.js` to `src/index.js` and leave it just like this:

```javascript
export { routes } from './routes'
export { locales } from './locales'
export { plugins } from './plugins'
export { webchat } from './webchat'
export { webviews } from './webviews'
```

2. Create a `src/plugins.js` file (if you don't already have it in your project) with:

```
export const plugins = []
```

3. Create a `src/webchat/index.js` file with:

```
export const webchat = {}
```

TODO: add link to webchat documentation

4. Replace your `webpack.config.js` for [this one](https://github.com/hubtype/botonic/blob/master/packages/botonic-cli/templates/blank/webpack.config.js).

5. Replace the "build" script in your `package.json` for the following two scripts:

```javascript
"build": "webpack --env.target=all --mode=development",
"build_development": "webpack --env.node --mode=development",
```

---

**NOTE**

When you are ready to deploy your bot, remember to pass as the build's script mode the flag `production`. This will optimize the code and will remove unnecessary dependencies in production environment.

---

## Why?

In Botonic v0.9 the generic class `App`, that it used to be in the `src/app.js` file (the entry point of your project) has been refactored and broken down into different classes. These classes better encapsulate what's needed for each target (dev, node, webchat and webviews) and helps us leverage webpack's tree-shaking capabilities, resulting in more optimized code, smaller bundles and getting rid of nasty errors when mixing incompatible browser and node code. Also, adding the new and shiny webchat SDK surfaced some architectural design flaws and it became obvious it needed a big refactor.

These benefits come at a cost: the configuration of webpack and the project's entry point is a bit more complex. We've hidden this complexity from you so that you just need to export the symbols that Botonic needs to build your project in `src/index.js`.These symbols are: `routes`, `locales`, `plugins`, `webchat` and `webviews`. These symbols are always needed, even if they're empty, and we recommend that you keep them in separate files so it's easier to maintain in the future.

The entry point is now located inside `@botonic/react/src/entry.js` and so your project's webpack configuration needs to reflect this change. This obviously means changing the "entry" fields in `webpack.config.js` and other subtle changes like adding `resolve: {alias: BotonicProject: path.resolve(__dirname, 'src')}` which allows Botonic to find the exported symbols in your `src/index.js` and adding a `BOTONIC_TARGET` env var using webpack.DefinePlugin that helps the new entry point create different artifacts depending on the target we're building for (dev, node, webchat or webviews).
