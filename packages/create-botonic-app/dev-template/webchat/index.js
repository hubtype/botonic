import {
  BrowserDevApp,
  BrowserProdApp,
  FullstackDevApp,
  FullstackProdApp,
} from '@botonic/react/src/experimental'

import { webchat } from './webchat-config'
export let app

if (FULLSTACK) {
  app = PRODUCTION
    ? new FullstackProdApp(webchat)
    : new FullstackDevApp({ ...webchat, playgroundCode: PLAYGROUND_CODE })
} else {
  const appParams = {
    routes: require('../bot/src/routes').routes,
    plugins: require('../bot/src/plugins').plugins,
    locales: require('../bot/src/locales').locales,
    ...webchat,
  }
  app = PRODUCTION
    ? new BrowserProdApp(appParams)
    : new BrowserDevApp(appParams)
}
