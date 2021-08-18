import { NodeApp } from '@botonic/react/src/experimental'
import { Router } from 'express'

import auth from './auth'
import botInputRouter from './bot-input'
import events from './events'
import users from './users'

export const routes = (bot: NodeApp) => {
  const router = Router()
  router.use('/users', users)
  router.use('/auth', auth)
  router.use('/events', events)
  router.use('/bot-input', botInputRouter(bot))
  return router
}
