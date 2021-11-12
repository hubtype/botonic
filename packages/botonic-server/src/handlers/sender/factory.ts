import { PROVIDER } from '@botonic/core'

import { Environments } from '../../constants'
import { publishActionSent } from '../../notifying'
import { awsSender } from './aws-sender'
import { localSender } from './local-sender'
import { sendEvents } from './send-events'

const eventHandlers = {
  onActionSent: publishActionSent,
}

export function senderHandlerFactory(env, dataProvider) {
  if (env === Environments.LOCAL) {
    return async function ({ userId, events }) {
      const user = await dataProvider.getUser(userId)
      if (user.channel === PROVIDER.DEV) {
        const sender = localSender
        await sendEvents({ user, events, sender })
      }
    }
  }
  if (env === Environments.AWS) {
    return async function (event, context) {
      try {
        const { body } = event.Records[0]
        const { userId, events } = JSON.parse(body)
        const user = await dataProvider.getUser(userId)
        if (user.channel === PROVIDER.WEBCHAT) {
          const sender = awsSender
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
}
