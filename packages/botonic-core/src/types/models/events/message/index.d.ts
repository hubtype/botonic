import { BaseEvent } from '..'
export declare enum MessageEventTypes {
  AUDIO = 'audio',
  CAROUSEL = 'carousel',
  CUSTOM = 'custom',
  DOCUMENT = 'document',
  IMAGE = 'image',
  LOCATION = 'location',
  TEXT = 'text',
  POSTBACK = 'postback',
  VIDEO = 'video',
}
export declare enum MessageEventAck {
  DRAFT = 'draft',
  READ = 'read',
  RECEIVED = 'received',
  SENT = 'sent',
}
export declare enum MessageEventFrom {
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
