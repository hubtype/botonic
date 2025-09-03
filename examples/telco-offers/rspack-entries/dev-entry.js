import { DevApp } from '@botonic/react'

import { config } from '../src'
import { routes } from '../src/routes'
import { locales } from '../src/locales'
import { plugins } from '../src/plugins'
import { webchat } from '../src/webchat'
import { webviews } from '../src/webviews'

export const app = new DevApp({
  routes,
  locales,
  plugins,
  webviews,
  ...webchat,
  ...config,
})
