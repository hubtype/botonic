import { BaseEvent, EventTypes } from '..'

export enum ConnectionEventStatuses {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

export interface ConnectionEvent extends BaseEvent {
  eventType: EventTypes.CONNECTION
  status: ConnectionEventStatuses
}
