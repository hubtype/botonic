import { DevApp } from './dev-app'
import { NodeApp } from './index'
import { WebchatApp } from './webchat-app'
import { WebviewApp } from './webview'
import {
  routes,
  plugins,
  locales,
  webchat,
  webviews,
  config,
  // eslint-disable-next-line import/no-unresolved,node/no-missing-import
} from 'BotonicProject'

export let app
if (process.env.BOTONIC_TARGET === 'dev') {
  app = new DevApp({
    routes,
    locales,
    plugins,
    ...webchat,
    ...config,
  })
} else if (process.env.BOTONIC_TARGET === 'node') {
  app = new NodeApp({ routes, locales, plugins, ...config })
} else if (process.env.BOTONIC_TARGET === 'webchat') {
  app = new WebchatApp(webchat)
} else if (process.env.BOTONIC_TARGET === 'webviews') {
  app = new WebviewApp({ webviews, locales })
}
