import { EventTypes } from '@botonic/core'

import { createIntegrationEvent } from '../helpers'
import { sqsPublisher } from './sqs-publisher-instance'

export const publishIntegrationEvent = ({
  user,
  details,
}) => async eventType => {
  await sqsPublisher?.publish(
    createIntegrationEvent(eventType, { user, details })
  )
}

export async function publishNewUser(args) {
  await publishIntegrationEvent(args)(EventTypes.NEW_USER)
}

export async function publishReceivedMessage(args) {
  await publishIntegrationEvent(args)(EventTypes.RECEIVED_MESSAGE)
}

export async function publishBotExecuted(args) {
  await publishIntegrationEvent(args)(EventTypes.BOT_EXECUTED)
}

export async function publishBotAction(args) {
  await publishIntegrationEvent(args)(EventTypes.BOT_ACTION)
}

export async function publishActionSent(args) {
  await publishIntegrationEvent(args)(EventTypes.ACTION_SENT)
}
