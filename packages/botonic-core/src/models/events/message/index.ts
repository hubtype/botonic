import { BaseEvent } from '..'

export enum MessageEventTypes {
  AUDIO = 'audio',
  CAROUSEL = 'carousel',
  CUSTOM = 'custom',
  DOCUMENT = 'document',
  IMAGE = 'image',
  LOCATION = 'location',
  TEXT = 'text',
  VIDEO = 'video',
}

export enum MessageEventAck {
  DRAFT = 'draft',
  READ = 'read',
  RECEIVED = 'received',
  SENT = 'sent',
}

export enum MessageEventFrom {
  AGENT = 'agent',
  BOT = 'bot',
  USER = 'user',
}

export interface BotonicMessageEvent extends BaseEvent {
  ack: MessageEventAck
  from: MessageEventFrom
  type: MessageEventTypes
  typing: number
  delay: number
}
