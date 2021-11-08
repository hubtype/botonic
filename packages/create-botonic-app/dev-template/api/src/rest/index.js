import { dispatchersFactory, restServerFactory } from '@botonic/server'

import botExecutor from '../handlers/botExecutor'
import sender from '../handlers/sender'
import { getApp } from './app'

export const dispatchers = dispatchersFactory(ENV, { botExecutor, sender })

export default restServerFactory({
  // eslint-disable-next-line no-undef
  env: ENV,
  // eslint-disable-next-line no-undef
  app: getApp(ENV, {
    dispatchers,
  }),
})
