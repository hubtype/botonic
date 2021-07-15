import { restServerFactory } from '@botonic/api/src/rest'
import { app } from './app'

export default restServerFactory({
  env: ENV,
  app,
})
