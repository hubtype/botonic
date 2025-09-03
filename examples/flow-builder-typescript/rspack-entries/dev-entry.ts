import { DevApp } from '@botonic/react'

import { config } from '../src'
import { webchat } from '../src/client/webchat'
import { plugins } from '../src/server/plugins'
import { routes } from '../src/server/routes'
import { webviews } from '../src/webviews'

export const app = new DevApp({
  routes,
  locales: {},
  plugins,
  webviews,
  ...webchat,
  ...config,
})
