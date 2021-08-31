import { NodeApp } from '@botonic/react/src/experimental'
import { Router } from 'express'

import { botDispatcherFactory } from '../../bot-dispatcher'
import auth from './auth'
import botInputRouter from './bot-input'
import eventsRouter from './events'
import usersRouter from './users'

export const routes = (bot: NodeApp) => {
  const botDispatcher = botDispatcherFactory(ENV, bot)
  const router = Router()
  router.use('/users', usersRouter)
  router.use('/auth', auth)
  router.use('/events', eventsRouter({ botDispatcher }))
  router.use('/bot-input', botInputRouter(bot))
  return router
}
