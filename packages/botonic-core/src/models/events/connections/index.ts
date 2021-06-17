import { BaseEvent, EventTypes } from '..'

export enum ConnectionEventStatus {
  connected = 'connected',
  disconnected = 'disconnected',
}

export interface ConnectionEvent extends BaseEvent<EventTypes.connection> {
  status: keyof typeof ConnectionEventStatus
}
