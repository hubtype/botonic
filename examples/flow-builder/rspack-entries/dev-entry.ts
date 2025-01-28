import { DevApp } from '@botonic/react'

import { config } from '../src'
import { webchat } from '../src/client/webchat'
import { plugins } from '../src/server/plugins'
import { routes } from '../src/server/routes'
import { locales } from '../src/shared/locales'

export const app = new DevApp({
  routes,
  locales,
  plugins,
  ...webchat,
  ...config,
})
