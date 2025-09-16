import { DevApp } from '@botonic/react'

import { routes } from '../src/routes'
import { locales } from '../src/locales'
import { plugins } from '../src/plugins'
import { webchat } from '../src/webchat'
import { webviews } from '../src/webviews'
import { config } from '../src'

export const app = new DevApp({
  routes,
  locales,
  plugins,
  webviews,
  ...webchat,
  ...config,
})
