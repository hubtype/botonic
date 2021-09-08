import { restServerFactory } from '@botonic/api/src/rest'
import { getApp } from './app'

import { handlers } from '../handlers'

export default restServerFactory({
  env: ENV,
  app: getApp(ENV, {
    handlers,
  }),
})
