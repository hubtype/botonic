export enum EventTypes {
  CONNECTION = 'connection',
  MESSAGE = 'message',
  ACK = 'ack',
  TRACK = 'track',
}

export interface BaseEvent {
  eventId: string
  userId: string
  eventType: EventTypes
  createdAt: string
  modifiedAt?: string
}
