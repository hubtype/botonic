import { DevApp } from '@botonic/react'

import { config } from '../src'
import { locales } from '../src/locales'
import { plugins } from '../src/plugins'
import { routes } from '../src/routes'
import { webchat } from '../src/webchat'

export const app = new DevApp({
  routes,
  locales,
  plugins,
  ...webchat,
  ...config,
})
