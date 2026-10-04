import { DevApp } from '@botonic/react'

import { config } from '../src'
import { webchat } from '../src/client/webchat'
import { webviews } from '../src/client/webviews'
import { plugins } from '../src/server/plugins'
import { routes } from '../src/server/routes'

export const app = new DevApp({
  routes,
  locales: {},
  plugins,
  webviews,
  ...webchat,
  ...config,
} as unknown as ConstructorParameters<typeof DevApp>[0])
