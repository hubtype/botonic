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
  ack: typeof MessageEventAck[keyof typeof MessageEventAck]
  from: typeof MessageEventFrom[keyof typeof MessageEventFrom]
  type: typeof MessageEventTypes[keyof typeof MessageEventTypes]
}
