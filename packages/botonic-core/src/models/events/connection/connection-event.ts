import { BaseEvent, EventTypes } from '../base-event'

export enum ConnectionEventStatuses {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

export interface ConnectionEvent extends BaseEvent {
  eventType: EventTypes.CONNECTION
  status: ConnectionEventStatuses
}
