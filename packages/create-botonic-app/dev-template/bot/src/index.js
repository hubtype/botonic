import { NodeApp } from '@botonic/react/src/experimental'
import { routes } from './routes'
import { plugins } from './plugins'
import { locales } from './locales'

export let app = new NodeApp({
  routes,
  locales,
  plugins,
  ...{ defaultDelay: 0, defaultTyping: 0 },
})
