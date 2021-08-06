import { Router } from 'express'

import botInputRouter from './bot-input'
import events from './events'
import users from './users'

export const routes = (bot: any) => {
  // TODO: bot was typed like bot: NodeApp, but this requires to add @botonic/react as an extra dependency. We should rethink how to handle this
  const router = Router()
  router.use('/users', users)
  router.use('/events', events)
  router.use('/bot-input', botInputRouter(bot))
  return router
}
