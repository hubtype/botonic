import { Router } from 'express'

import { botDispatcherFactory } from '../../bot-dispatcher'
import authRouter from './auth'
import botInputRouter from './bot-input'
import eventsRouter from './events'
import usersRouter from './users'

export const routes = (args: any) => {
  const { env, bot } = args
  const router = Router()
  router.use('/users', usersRouter(args))
  router.use('/auth', authRouter(args))
  const botDispatcher = botDispatcherFactory(env, bot)
  router.use('/events', eventsRouter({ botDispatcher, ...args }))
  router.use('/bot-input', botInputRouter(args))
  return router
}
