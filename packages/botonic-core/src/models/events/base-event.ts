export enum EventTypes {
  CONNECTION = 'connection',
  MESSAGE = 'message',
  ACK = 'ack',
  TRACK = 'track',
  // Integration Events
  NEW_USER = 'newUser',
  RECEIVED_MESSAGE = 'receivedMessage',
  BOT_EXECUTED = 'botExecuted',
  BOT_ACTION = 'botAction',
  ACTION_SENT = 'actionSent',
}

export interface BaseEvent {
  eventId: string
  userId: string
  eventType: EventTypes
  createdAt: string
  modifiedAt?: string
}
