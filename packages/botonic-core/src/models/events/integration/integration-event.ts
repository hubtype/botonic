import { BaseEvent, EventTypes } from '../base-event'

type IntegrationEventType =
  | EventTypes.NEW_USER
  | EventTypes.RECEIVED_MESSAGE
  | EventTypes.BOT_EXECUTED
  | EventTypes.ACTION_SENT

export interface IntegrationEvent extends BaseEvent {
  eventType: IntegrationEventType
  details: any
}
