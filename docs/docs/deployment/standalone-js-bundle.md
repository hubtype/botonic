---
id: standalone-js-bundle
title: Standalone JS bundle
---

A standalone JS bundle allows you to encapsulate all your botonic app in a single static file that you can host anywhere and load it into your HTML. This is actually what the `botonic serve` command does! In this guide we'll show how to tweak the webpack config to create a production ready JS bundle. Even though it has a lot of limitations, it could be a good choice for simple web-based use cases.

This is the best option if you:

- Just need a chatbot embedded in your website or mobile app
- Are paranoid about privacy and don't want any user data to leave the browser and be stored in any database

DON'T choose this option if you:

- Are worried about **page load** (the generated bundle can be pretty heavy)
- Need to use **sensitive tokens** in your codebase (they'll be public)
- Need integration with **messaging apps**
- Need to use **bot/human handoff**
- Need to use libraries that only work on Node (we always suggest to use isomorphic libraries if possible)

  See [Deploy to Hubtype](/docs/deployment/hubtype) for these use cases.

## Generate a Standalone Javascript Bundle step by step

1. Create a new folder `<projectRoot>/src/self-hosted` in your botonic project
2. Create an `app.js` file in that folder and copy/paste this code:

```javascript
import React from 'react'
import { render } from 'react-dom'

import { ReactBot } from '@botonic/react/src/react-bot'
import { WebchatApp } from '@botonic/react/src/webchat-app'
import { Webchat } from '@botonic/react/src/webchat'

export class SelfHostedApp extends WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    blockInputs,
    emojiPicker,
    enableAttachments,
    onInit,
    onOpen,
    onClose,
    onMessage,
    ...botOptions
  }) {
    super({
      theme,
      persistentMenu,
      blockInputs,
      emojiPicker,
      enableAttachments,
      onInit,
      onOpen,
      onClose,
      onMessage,
    })
    this.bot = new ReactBot({
      ...botOptions,
    })
  }

  render(dest, optionsAtRuntime = {}) {
    let {
      theme = {},
      persistentMenu,
      blockInputs,
      emojiPicker,
      enableAttachments,
      onInit,
      onOpen,
      onClose,
      onMessage,
      ...webchatOptions
    } = optionsAtRuntime
    theme = { ...this.theme, ...theme }
    persistentMenu = persistentMenu || this.persistentMenu
    blockInputs = blockInputs || this.blockInputs
    emojiPicker = emojiPicker || this.emojiPicker
    enableAttachments = enableAttachments || this.enableAttachments
    this.onInit = onInit || this.onInit
    this.onOpen = onOpen || this.onOpen
    this.onClose = onClose || this.onClose
    this.onMessage = onMessage || this.onMessage
    render(
      <Webchat
        ref={this.webchatRef}
        {...webchatOptions}
        theme={theme}
        persistentMenu={persistentMenu}
        blockInputs={blockInputs}
        emojiPicker={emojiPicker}
        enableAttachments={enableAttachments}
        getString={(stringId, session) => this.bot.getString(stringId, session)}
        setLocale={(locale, session) => this.bot.setLocale(locale, session)}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
      />,
      dest
    )
  }

  async onUserInput({ input, session, lastRoutePath }) {
    this.onMessage && this.onMessage(this, { from: 'user', message: input })
    let resp = await this.bot.input({ input, session, lastRoutePath })
    this.onMessage &&
      resp.response.map(r => this.onMessage(this, { from: 'bot', message: r }))
    this.webchatRef.current.addBotResponse(resp)
  }
}
```

3. Create a new entry file at `<projectRoot>/webpack-entries/self-hosted-entry.js` with this code:

```javascript
import { SelfHostedApp } from '../src/self-hosted/app'

import { routes } from '../src/routes'
import { locales } from '../src/locales'
import { plugins } from '../src/plugins'
import { webchat } from '../src/webchat'
import { config } from '../src'
​
​
export const app = new SelfHostedApp({
  routes,
  locales,
  plugins,
  ...webchat,
  ...config,
})
```

4. Edit the `webpack.config.js` file and add this configuration:

```javascript
function botonicSelfHostedConfig(mode) {
  return {
    optimization: {
      minimizer: [terserPlugin],
    },
    mode: mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve('webpack-entries', 'self-hosted-entry.js'),
    module: {
      rules: [babelLoaderConfig, fileLoaderConfig, stylesLoaderConfig],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webchat.botonic.js',
      library: 'Botonic',
      libraryTarget: 'umd',
      libraryExport: 'app',
      publicPath: './',
    },
    resolve: resolveConfig,
    plugins: [
      imageminPlugin,
      new webpack.EnvironmentPlugin({
        HUBTYPE_API_URL: null,
        BOTONIC_TARGET: BOTONIC_TARGETS.DEV,
      }),
    ],
  }
}
```

and also replace the exported function at the end of `webpack.config.js` by:

```javascript
module.exports = function (env) {
  if (env.target === 'all') {
    return [botonicServerConfig, botonicWebviewsConfig, botonicWebchatConfig]
  } else if (env.target === 'dev') {
    return [botonicDevConfig]
  } else if (env.target === 'node') {
    return [botonicServerConfig]
  } else if (env.target === 'webviews') {
    return [botonicWebviewsConfig]
  } else if (env.target === 'webchat') {
    return [botonicWebchatConfig]
  } else if (env.target === 'self-hosted') {
    return [botonicSelfHostedConfig]
  }
}
```

5. Finally, in your `package.json` add a script to build the bundle:

```
  "scripts": {
    ...
    "build:self-hosted": "webpack --env target=self-hosted --mode=production",
  },
```

Now you can run `npm run build:self-hosted` that will generate a `dist/webchat.botonic.js` file that you can host anywhere and load in your html with `<script src="webchat.botonic.js"></script>`.
