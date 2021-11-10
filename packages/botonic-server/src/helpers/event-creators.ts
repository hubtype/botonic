import {
  BaseEvent,
  BotonicEvent,
  BotonicMessageEvent,
  ConnectionEventStatuses,
  EventTypes,
  MessageEventAck,
  MessageEventFrom,
  User,
} from '@botonic/core'
import { ulid } from 'ulid'

// TODO: To be obtained from new row in DynamoDB table
export const ID_FROM_CHANNEL = '1234'

export function initBaseEvent(user: User, eventType: EventTypes): BaseEvent {
  return {
    userId: user.id,
    eventId: ulid(),
    createdAt: new Date().toISOString(),
    idFromChannel: user.idFromChannel || ID_FROM_CHANNEL,
    channel: user.channel,
    eventType,
  }
}

type ConnectionEventArgs = { user: User; status: ConnectionEventStatuses }
export function createConnectionEvent(args: ConnectionEventArgs): BotonicEvent {
  const { user, status } = args
  return {
    ...initBaseEvent(user, EventTypes.CONNECTION),
    status,
  } as BotonicEvent
}

type BotonicMessageEventArgs = {
  user: User
  properties: Partial<BotonicMessageEvent>
}
export function createMessageEvent(
  args: BotonicMessageEventArgs
): BotonicEvent {
  const { user, properties } = args
  return {
    ...properties,
    ...initBaseEvent(user, EventTypes.MESSAGE),
  } as BotonicEvent
}

type IntegrationEventArgs = { user: User; details: any }
export function createIntegrationEvent(
  eventType: EventTypes,
  args: IntegrationEventArgs
): BotonicEvent {
  const { user, details } = args
  return { ...initBaseEvent(user, eventType), details } as BotonicEvent
}

function initChannelInformation(user: User) {
  const { idFromChannel, channel } = user
  return { idFromChannel, channel }
}

// TODO: Validate how to define these kind of events
// We need channel information in these events to distinguish in which cases it should be executed
type WebchatActionEventArgs = { user: User; action: string; properties: any }
export function createWebchatActionEvent(args: WebchatActionEventArgs): any {
  const { user, properties, action } = args
  return {
    ...initChannelInformation(user),
    ...properties,
    action,
  } as BotonicEvent
}
