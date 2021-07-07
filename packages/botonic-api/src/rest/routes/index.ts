import { Router } from 'express'

import events from './events'
import users from './users'

export const routes = bot => {
  const router = Router()
  router.use('/users', users)
  router.use('/events', events)
  router.route('/bot-input').post(async (req, res) => {
    // TODO: parse: Boolean arg to indicate if we should parse the output or not (default true)
    // TODO: get session and route from DataProvider
    const output = await bot.app.input({
      input: req.body.input,
      session: req.body.session,
      lastRoutePath: req.body.route,
    })
    res.json(output)
  })
  return router
}
