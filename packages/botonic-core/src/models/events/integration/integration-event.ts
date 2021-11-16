import { BaseEvent, EventTypes } from '../base-event'

export type IntegrationEventType =
  | EventTypes.NEW_USER
  | EventTypes.RECEIVED_MESSAGE
  | EventTypes.BOT_EXECUTED
  | EventTypes.BOT_ACTION
  | EventTypes.ACTION_SENT

export interface IntegrationEvent extends BaseEvent {
  eventType: IntegrationEventType
  details: any
}
