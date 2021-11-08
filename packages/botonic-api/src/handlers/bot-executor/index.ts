import { EventTypes, MessageEventAck, MessageEventFrom } from '@botonic/core'
import { ulid } from 'ulid'

import { Environments } from '../..'

const botExecutor = (bot, dataProvider, dispatchers) =>
  async function executeBot({ userId, input }) {
    const user = await dataProvider.getUser(userId)
    const output = await bot.input({
      input,
      session: user.session,
      botState: user.botState,
      dataProvider,
    })

    for (const messageEvent of output.messageEvents) {
      // @ts-ignore
      const botEvent = await dataProvider.saveEvent({
        ...messageEvent,
        userId,
        eventId: ulid(),
        createdAt: new Date().toISOString(),
        from: MessageEventFrom.BOT,
        ack: MessageEventAck.SENT,
      })
    }

    const botExecuted = await dataProvider.saveEvent({
      userId,
      createdAt: new Date().toISOString(),
      eventId: ulid(),
      eventType: EventTypes.BOT_EXECUTED,
      details: {
        input,
        response: output.response,
        messageEvents: output.messageEvents,
        session: output.session,
        botState: output.botState,
      },
    })

    const updatedUser = {
      ...user,
      session: output.session,
      botState: output.botState,
    }
    await dataProvider.updateUser(updatedUser)

    const events = [
      ...output.messageEvents,
      { action: 'update_bot_state', ...output.botState },
      { action: 'update_session', ...output.session },
    ]
    // post events to sender sqs
    await dispatchers.dispatch('sender', {
      userId,
      events,
    })
  }

export function botExecutorHandlerFactory(env, bot, dataProvider, dispatchers) {
  if (env === Environments.LOCAL)
    return botExecutor(bot, dataProvider, dispatchers)
  if (env === Environments.AWS) {
    return async function (event, context) {
      try {
        const params = JSON.parse(event.Records[0].body)
        const userId = params.userId
        // Publish Received Message Event
        const receivedMessage = await dataProvider.saveEvent({
          userId,
          createdAt: new Date().toISOString(),
          eventId: ulid(),
          eventType: EventTypes.RECEIVED_MESSAGE,
          details: params.input,
        })
        await botExecutor(bot, dataProvider, dispatchers)(params)
      } catch (e) {
        // Bot Failed Event
        console.error(e)
        return {
          statusCode: 500,
        }
      }
      return {
        statusCode: 200,
      }
    }
  }
}
