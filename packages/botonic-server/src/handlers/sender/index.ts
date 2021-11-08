import { EventTypes } from '@botonic/core'
import { ulid } from 'ulid'
import { sqsPublisher } from '../..'

import { Environments } from '../../constants'
import { awsSender } from './aws-sender'
import { localSender } from './local-sender'

export function senderHandlerFactory(env, dataProvider) {
  if (env === Environments.LOCAL) {
    return async function ({ userId, events }) {
      const user = await dataProvider.getUser(userId)
      for (const event of events)
        await localSender({ event, websocketId: user.websocketId })
    }
  }
  if (env === Environments.AWS) {
    return async function (event, context) {
      try {
        const { body } = event.Records[0]
        const { userId, events } = JSON.parse(body)
        const user = await dataProvider.getUser(userId)
        for (const event of events) {
          await awsSender({ event, websocketId: user.websocketId })
          await sqsPublisher?.publish({
            userId,
            createdAt: new Date().toISOString(),
            eventId: ulid(),
            eventType: EventTypes.ACTION_SENT,
            details: event,
          })
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
