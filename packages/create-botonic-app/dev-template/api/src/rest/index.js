import { restServerFactory } from '@botonic/api/src/rest'

import { handlers } from '../handlers'
import { getApp } from './app'

export default restServerFactory({
  // eslint-disable-next-line no-undef
  env: ENV,
  // eslint-disable-next-line no-undef
  app: getApp(ENV, {
    handlers,
  }),
})
