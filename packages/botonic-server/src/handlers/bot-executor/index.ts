import { EventTypes, MessageEventAck, MessageEventFrom } from '@botonic/core'
import { ulid } from 'ulid'

import { Environments } from '../../constants'
import { Commands } from '../../dispatchers'
import {
  createIntegrationEvent,
  createMessageEvent,
  createWebchatActionEvent,
  initChannelInformation,
} from '../../helpers'
import { sqsPublisher } from '../../notifying'

const botExecutor = (bot, dataProvider, dispatchers) =>
  async function executeBot({ userId, input }) {
    const user = await dataProvider.getUser(userId)
    await sqsPublisher?.publish(
      createIntegrationEvent(EventTypes.RECEIVED_MESSAGE, {
        user,
        details: input,
      })
    )
    const output = await bot.input({
      input,
      session: user.session,
      botState: user.botState,
      dataProvider,
    })

    // TODO: Adding channel information once the input has been processed (rethink it?)
    const messageEvents = output.messageEvents.map(messageEvent => ({
      ...messageEvent,
      ...initChannelInformation({
        channel: user.channel,
        idFromChannel: user.idFromChannel,
      }),
    }))

    for (const messageEvent of messageEvents) {
      const botEvent = await dataProvider.saveEvent(
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

    await sqsPublisher?.publish(
      createIntegrationEvent(EventTypes.BOT_EXECUTED, {
        user,
        details: {
          input,
          response: output.response,
          messageEvents,
          session: output.session,
          botState: output.botState,
        },
      })
    )

    const updatedUser = {
      ...user,
      session: output.session,
      botState: output.botState,
    }
    await dataProvider.updateUser(updatedUser)

    const events = [
      ...messageEvents,
      createWebchatActionEvent({
        action: 'update_bot_state',
        user,
        properties: { botState: output.botState },
      }),
      createWebchatActionEvent({
        action: 'update_session',
        user,
        properties: { session: output.session },
      }),
    ]

    await sqsPublisher?.publish(
      createIntegrationEvent(EventTypes.BOT_ACTION, { user, details: events })
    )

    // post events to sender sqs
    await dispatchers.dispatch(Commands.SEND, {
      userId,
      events,
    })
  }

export function botExecutorHandlerFactory(env, bot, dataProvider, dispatchers) {
  if (env === Environments.LOCAL) {
    return botExecutor(bot, dataProvider, dispatchers)
  }
  if (env === Environments.AWS) {
    return async function (event, context) {
      try {
        const params = JSON.parse(event.Records[0].body)
        await botExecutor(bot, dataProvider, dispatchers)(params)
      } catch (e) {
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
