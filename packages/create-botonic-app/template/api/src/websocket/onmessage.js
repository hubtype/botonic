import { dataProviderFactory } from '@botonic/api/src/data-provider'
import { app } from 'bot/src'
import { ulid } from 'ulid'
import { BotonicOutputParser } from '@botonic/core/src/output-parser'
import {
  MessageEventAck,
  MessageEventFrom,
} from '@botonic/core/src/models/events/message'

export const onMessage = async ({ websocketId, data, send }) => {
  const botonicOutputParser = new BotonicOutputParser()
  var dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
  var { message, sender } = JSON.parse(data)
  const senderId = sender.id
  await dp.updateConnection(websocketId, senderId)
  let user = await dp.getUser(senderId)
  if (!user) {
    user = await dp.saveUser({
      id: senderId,
      isOnline: true,
      route: '/',
      session: JSON.stringify({}),
      websocketId: websocketId,
    })
  }
  const parsedUserEvent = botonicOutputParser.parseFromUserInput(message)
  await dp.saveEvent({
    ...parsedUserEvent,
    userId: user.id,
    eventId: ulid(),
    createdAt: new Date().toISOString(),
    from: MessageEventFrom.USER,
    ack: MessageEventAck.SENT,
  })
  const output = await app.input({
    input: message,
    session: JSON.parse(user.session),
    lastRoutePath: user.route,
  })
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
    await send(messageEvent)
  }
  await dp.updateUser({
    ...user,
    session: JSON.stringify(output.session),
    route: output.lastRoutePath,
    websocketId: websocketId,
  })
}
