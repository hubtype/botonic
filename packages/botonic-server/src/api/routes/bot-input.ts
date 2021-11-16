import {
  BotonicOutputParser,
  MessageEventAck,
  MessageEventFrom,
  Session,
  User,
} from '@botonic/core'
import { Request, Router } from 'express'
import { v4 } from 'uuid'

import { dataProviderFactory } from '../../data-provider'
import { createMessageEvent } from '../../helpers'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

export default function botInputRouter(args: any): Router {
  const router = Router()
  const botonicOutputParser = new BotonicOutputParser()
  const { bot } = args

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

    await dataProvider.saveEvent(
      createMessageEvent({
        user,
        properties: {
          ...parsedUserEvent,
          from: MessageEventFrom.USER,
          ack: MessageEventAck.SENT,
        },
      })
    )

    const { messageEvents } = output

    for (const messageEvent of messageEvents) {
      await dataProvider.saveEvent(
        createMessageEvent({
          user,
          properties: {
            ...messageEvent,
            from: MessageEventFrom.BOT,
            ack: MessageEventAck.SENT,
          },
        })
      )
    }
    res.json(output)
  })

  return router
}

async function getUser(req: Request): Promise<User | undefined> {
  return (
    (await dataProvider.getUser(req.body.session.user.id)) ??
    (await dataProvider.getUserByField(
      'provider_id',
      req.body.session.user.provider_id
    ))
  )
}

async function createUser(providerId: string): Promise<User> {
  const user: User = {
    id: v4(),
    providerId,
    isOnline: true,
    route: '/',
    session: {} as Session,
  }
  return dataProvider.saveUser(user)
}
