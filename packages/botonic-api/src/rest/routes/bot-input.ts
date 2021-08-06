import { Session } from '@botonic/core'
import { MessageEventFrom } from '@botonic/core/lib/models/events/message'
import { BotonicOutputParser } from '@botonic/core/lib/output-parser'
import { BotonicEvent } from '@botonic/core/src/models/events'
import { MessageEventAck } from '@botonic/core/src/models/events/message'
import { User } from '@botonic/core/src/models/user'
import { Request, Router } from 'express'
import { ulid } from 'ulid'
import { v4 } from 'uuid'

import { dataProviderFactory } from '../../data-provider'

const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)

export default function botInputRouter(bot: any): Router {
  // TODO: bot was typed like bot: NodeApp, but this requires to add @botonic/react as an extra dependency. We should rethink how to handle this
  const router = Router()
  const botonicOutputParser = new BotonicOutputParser()

  router.route('/').post(async (req, res) => {
    // TODO: parse: Boolean arg to indicate if we should parse the output or not (default true)
    const user =
      (await getUser(req)) ??
      (await createUser(req.body.session.user.provider_id))

    const output = await bot.input({
      input: req.body.input,
      session: { user },
      lastRoutePath: user.route,
    })

    const parsedUserEvent = botonicOutputParser.parseFromUserInput(
      req.body.input
    )
    await dp.saveEvent({
      ...parsedUserEvent,
      userId: user.id,
      eventId: ulid(),
      createdAt: new Date().toISOString(),
      from: MessageEventFrom.USER,
      ack: MessageEventAck.SENT,
    } as BotonicEvent)

    const messages = output.parsedResponse
    for (const messageEvent of messages) {
      await dp.saveEvent({
        ...messageEvent,
        userId: user.id,
        eventId: ulid(),
        createdAt: new Date().toISOString(),
        from: MessageEventFrom.BOT,
        ack: MessageEventAck.SENT,
      })
    }
    res.json(output)
  })

  return router
}

async function getUser(req: Request): Promise<User | undefined> {
  return (
    (await dp.getUser(req.body.session.user.id)) ??
    (await dp.getUserByField('provider_id', req.body.session.user.provider_id))
  )
}

async function createUser(providerId: string): Promise<User> {
  const user: User = {
    id: v4(),
    providerId,
    isOnline: true,
    route: '/',
    session: {} as Session,
    // TODO: fill information
    websocketId: '',
    locationInfo: '',
  }
  return dp.saveUser(user)
}
