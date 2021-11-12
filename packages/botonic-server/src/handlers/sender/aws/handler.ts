import { Channels } from '@botonic/core'

import { publishActionSent } from '../../..'
import { sendEvents } from '../send-events'
import { webchatSender } from './webchat-sender'

const eventHandlers = {
  onActionSent: publishActionSent,
}

export function awsHandler(dataProvider) {
  return async function (event, context) {
    try {
      const { body } = event.Records[0]
      const { userId, events } = JSON.parse(body)
      const user = await dataProvider.getUser(userId)
      if (user.channel === Channels.WEBCHAT) {
        const sender = webchatSender
        await sendEvents({ user, events, sender, eventHandlers })
      }
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
