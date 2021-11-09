import { EventTypes, MessageEventAck, MessageEventFrom } from '@botonic/core'
import { ulid } from 'ulid'

import { Environments } from '../../constants'
import { Commands } from '../../dispatchers'
import { sqsPublisher } from '../../notifying'

const botExecutor = (bot, dataProvider, dispatchers) =>
  async function executeBot({ userId, input }) {
    const user = await dataProvider.getUser(userId)
    const output = await bot.input({
      input,
      session: user.session,
      botState: user.botState,
      dataProvider,
    })
    // Adding channel information once the input has been processed
    const messageEvents = output.messageEvents.map(messageEvent => ({
      ...messageEvent,
      channel: user.channel,
      idFromChannel: user.idFromChannel,
    }))

    for (const messageEvent of messageEvents) {
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

    await sqsPublisher?.publish({
      userId,
      createdAt: new Date().toISOString(),
      eventId: ulid(),
      eventType: EventTypes.BOT_EXECUTED,
      details: {
        input,
        response: output.response,
        messageEvents,
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
      ...messageEvents,
      {
        action: 'update_bot_state',
        botState: output.botState,
        idFromChannel: user.idFromChannel,
        channel: user.channel,
      },
      {
        action: 'update_session',
        session: output.session,
        idFromChannel: user.idFromChannel,
        channel: user.channel,
      },
    ]

    await sqsPublisher?.publish({
      userId,
      createdAt: new Date().toISOString(),
      eventId: ulid(),
      eventType: EventTypes.BOT_ACTION,
      details: events,
    })

    // post events to sender sqs
    await dispatchers.dispatch(Commands.SEND, {
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
        const { userId } = params
        await sqsPublisher?.publish({
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
