import { Channels, MessageEventAck, MessageEventFrom } from '@botonic/core'

import { Commands } from '../../dispatchers'
import {
  createMessageEvent,
  createWebchatActionEvent,
  initChannelInformation,
} from '../../helpers'

export async function executeBot({ bot, user, input, dataProvider }) {
  const output = await bot.input({
    input,
    session: user.session,
    botState: user.botState,
    dataProvider,
  })

  /**
   * TODO: Adding channel information once the input has been processed (rethink this?)
   * Right now, modifying bot output to inject the channel information. (beware side effects)
   */
  // Function to append channel information metadata
  const messageEvents = output.messageEvents.map(messageEvent => ({
    ...messageEvent,
    ...initChannelInformation({
      channel: user.channel,
      idFromChannel: user.idFromChannel,
    }),
  }))
  output.messageEvents = messageEvents

  for (const messageEvent of messageEvents) {
    const botEvent = await dataProvider.saveEvent(
      createMessageEvent({
        user,
        properties: {
          ...messageEvent,
          from: MessageEventFrom.BOT,
          ack: MessageEventAck.SENT, // to be updated within sender. Should be save without ack or with received
        },
      })
    )
  }
  const updatedUser = {
    ...user,
    session: output.session,
    botState: output.botState,
  }
  await dataProvider.updateUser(updatedUser)
  return output
}

async function sendActions({ actions, user, eventHandlers, dispatchers }) {
  try {
    await dispatchers.dispatch(Commands.SEND, {
      userId: user.id,
      events: actions,
    })
    if ('onBotAction' in eventHandlers) {
      await eventHandlers.onBotAction({ user, details: actions })
    }
    // // Save ACK sent
  } catch (e) {
    // if ('onBotActionFailed' in eventHandlers) {
    //   await eventHandlers.onBotAction({ user, details: actions })
    // }
    // throw e
    // // Save ACK failed?
  }
}

export const botExecutor = (
  bot,
  dataProvider,
  dispatchers,
  eventHandlers: any = {}
) => async ({ userId, input }) => {
  const user = await dataProvider.getUser(userId)

  if ('onReceivedMessage' in eventHandlers) {
    // Append TRACE_ID to group events of the same group
    await eventHandlers.onReceivedMessage({ user, details: input })
  }

  const output = await executeBot({ bot, user, input, dataProvider })

  // Deleting dataProvider from output. We cannot pass dataProvider as it is an instance, would break.
  delete output.dataProvider

  if ('onBotExecuted' in eventHandlers) {
    await eventHandlers.onBotExecuted({ user, details: output })
  }

  const actions = output.messageEvents

  // TOOD: in Webchat/Dev we additionally want to update the client app
  if ([Channels.DEV, Channels.WEBCHAT].includes(user.channel)) {
    actions.push(
      createWebchatActionEvent({
        action: 'update_bot_state',
        user,
        properties: { botState: output.botState },
      }),
      createWebchatActionEvent({
        action: 'update_session',
        user,
        properties: { session: output.session },
      })
    )
  }

  await sendActions({
    actions,
    user,
    eventHandlers,
    dispatchers,
  })
}
