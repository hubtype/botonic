import { Router } from 'express'

import authRouter from './auth'
import botInputRouter from './bot-input'
import eventsRouter from './events'
import usersRouter from './users'

export const routes = (args: any) => {
  const router = Router()
  router.use('/users', usersRouter(args))
  router.use('/auth', authRouter(args))
  router.use('/events', eventsRouter(args))
  router.use('/bot-input', botInputRouter(args))
  return router
}
