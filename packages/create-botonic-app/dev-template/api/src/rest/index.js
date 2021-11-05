import { restServerFactory } from '@botonic/api/src/rest'
import { dispatchersFactory } from '@botonic/api/src/dispatchers/index'

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
