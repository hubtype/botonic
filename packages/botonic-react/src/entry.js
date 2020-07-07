/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable node/no-missing-require */
/* eslint-disable @typescript-eslint/no-var-requires */

export let app

if (process.env.BOTONIC_TARGET === 'dev') {
  const { DevApp } = require('./dev-app')
  const {
    routes,
    locales,
    plugins,
    webchat,
    config,
  } = require('BotonicProject')
  app = new DevApp({
    routes,
    locales,
    plugins,
    ...webchat,
    ...config,
  })
} else if (process.env.BOTONIC_TARGET === 'node') {
  const { NodeApp } = require('./node-app')
  const { routes, locales, plugins, config } = require('BotonicProject')
  app = new NodeApp({ routes, locales, plugins, ...config })
} else if (process.env.BOTONIC_TARGET === 'webchat') {
  const { WebchatApp } = require('./webchat-app')
  const { webchat } = require('BotonicProject/webchat')
  app = new WebchatApp(webchat)
} else if (process.env.BOTONIC_TARGET === 'webviews') {
  const { WebviewApp } = require('./webview')
  const { webviews } = require('BotonicProject/webviews')
  const { locales } = require('BotonicProject/locales')
  app = new WebviewApp({ webviews, locales })
}
