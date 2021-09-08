import { NodeApp } from '@botonic/react/src/experimental'

import { locales } from './locales'
import { plugins } from './plugins'
import { routes } from './routes'

export const app = new NodeApp({
  routes,
  locales,
  plugins,
  ...{ defaultDelay: 0, defaultTyping: 0 },
})
